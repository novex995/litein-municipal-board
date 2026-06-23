import { supabaseAdmin } from '../config/supabase.js'
import bcrypt from 'bcryptjs'

// Get all users with filtering
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 100 } = req.query
    const offset = (page - 1) * limit

    console.log('📋 Fetching users with params:', { role, status, search, page, limit })

    let query = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' })

    // Filter by role
    if (role) {
      query = query.eq('role', role)
    }

    // Filter by status (only if is_active column exists)
    if (status === 'active') {
      query = query.eq('is_active', true)
    } else if (status === 'inactive') {
      query = query.eq('is_active', false)
    }

    // Search by name or email
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    console.log('✅ Fetched users:', { count, dataLength: data?.length, error })

    if (error) {
      console.error('Database error:', error)
      // If error is about is_active column, try without it
      if (error.message && error.message.includes('is_active')) {
        console.log('⚠️ is_active column not found, fetching without status filter')
        
        let retryQuery = supabaseAdmin
          .from('users')
          .select('id, email, full_name, phone, role, avatar_url, created_at, updated_at', { count: 'exact' })

        if (role) retryQuery = retryQuery.eq('role', role)
        if (search) retryQuery = retryQuery.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)

        const { data: retryData, error: retryError, count: retryCount } = await retryQuery
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (retryError) throw retryError

        // Add is_active: true to all results (default)
        const dataWithStatus = retryData.map(user => ({ ...user, is_active: true }))

        return res.json({
          success: true,
          data: dataWithStatus,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: retryCount,
            pages: Math.ceil(retryCount / limit)
          },
          warning: 'is_active column not found in database. Please run migration.'
        })
      }
      throw error
    }

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      details: error.message
    })
  }
}

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    })
  }
}

// Create new user (staff member)
export const createUser = async (req, res) => {
  try {
    const { email, password, full_name, phone, role, department, position, employee_id } = req.body

    console.log('📝 Creating new user:', { email, full_name, role, department, position })

    // Validate required fields
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, full name, and role are required'
      })
    }

    // Check if user already exists in public.users
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    if (checkError) {
      console.error('❌ Error checking existing user:', checkError)
    }

    if (existingUser) {
      console.log('❌ User already exists in public.users:', email)
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      })
    }

    // Create user in Supabase Auth
    console.log('🔐 Creating user in Supabase Auth...')
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role
      }
    })

    if (authError) {
      console.error('❌ Auth creation error:', authError)
      // Check if it's a duplicate email error from Supabase Auth
      if (authError.message?.includes('already') || authError.message?.includes('exists')) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists in authentication system'
        })
      }
      throw authError
    }

    console.log('✅ User created in Auth:', authUser.user.id)

    // Create user in public.users table
    console.log('📋 Creating user in public.users table...')
    const insertData = {
      id: authUser.user.id,
      email,
      full_name,
      phone,
      role,
      is_active: true
    }

    // Add optional fields if provided
    if (department) insertData.department = department
    if (position) insertData.position = position
    if (employee_id) insertData.employee_id = employee_id

    const { data: newUser, error: dbError } = await supabaseAdmin
      .from('users')
      .insert(insertData)
      .select()
      .single()

    if (dbError) {
      console.error('❌ Database insert error:', dbError)
      // Try to clean up auth user if database insert fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      throw dbError
    }

    console.log('✅ User created successfully:', newUser)

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('❌ Create user error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create user'
    })
  }
}

// Update user status (enable/disable)
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { is_active } = req.body

    // Validate input
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'is_active must be a boolean value'
      })
    }

    // Prevent disabling own account
    if (req.user.id === id && !is_active) {
      return res.status(400).json({
        success: false,
        error: 'You cannot disable your own account'
      })
    }

    // Update user status
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ 
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    res.json({
      success: true,
      data,
      message: `User ${is_active ? 'enabled' : 'disabled'} successfully`
    })
  } catch (error) {
    console.error('Update user status error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update user status'
    })
  }
}

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body

    // Validate role
    const validRoles = ['citizen', 'municipal_staff', 'department_head', 'municipal_manager', 'super_admin']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      })
    }

    // Prevent changing own role
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot change your own role'
      })
    }

    // Update user role
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ 
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    res.json({
      success: true,
      data,
      message: 'User role updated successfully'
    })
  } catch (error) {
    console.error('Update user role error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update user role'
    })
  }
}

// Update user details (general update)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, phone, role, department, position, employee_id, avatar_url } = req.body

    console.log('📝 Updating user:', id, 'with data:', req.body)

    // Build update object with only provided fields
    const updateData = {
      updated_at: new Date().toISOString()
    }

    if (full_name !== undefined) updateData.full_name = full_name
    if (phone !== undefined) updateData.phone = phone
    if (department !== undefined) updateData.department = department
    if (position !== undefined) updateData.position = position
    if (employee_id !== undefined) updateData.employee_id = employee_id
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url

    // Handle role separately with validation
    if (role !== undefined) {
      const validRoles = ['citizen', 'municipal_staff', 'department_head', 'municipal_manager', 'super_admin']
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role'
        })
      }

      // Prevent changing own role
      if (req.user.id === id) {
        return res.status(400).json({
          success: false,
          error: 'You cannot change your own role'
        })
      }

      updateData.role = role
    }

    // Update user in database
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('❌ Database update error:', error)
      throw error
    }

    // Check if user was found and updated
    if (!data || data.length === 0) {
      console.error('❌ User not found:', id)
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    console.log('✅ User updated successfully:', data[0])

    res.json({
      success: true,
      data: data[0],
      message: 'User updated successfully'
    })
  } catch (error) {
    console.error('❌ Update user error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      details: error.message
    })
  }
}

// Delete user (permanent)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    console.log('🗑️ Attempting to delete user:', id)
    console.log('👤 Requesting user:', req.user?.id)

    // Prevent deleting own account
    if (req.user.id === id) {
      console.log('❌ Cannot delete own account')
      return res.status(400).json({
        success: false,
        error: 'You cannot delete your own account'
      })
    }

    // Check for related records that would prevent deletion
    console.log('🔍 Checking for related records...')
    
    // Check if user has authored any news articles
    const { data: newsArticles, error: newsError } = await supabaseAdmin
      .from('news')
      .select('id, title')
      .eq('author_id', id)
    
    if (newsError) {
      console.error('⚠️ Error checking news articles:', newsError)
    }

    // Check if user has any grievances/complaints
    const { data: complaints, error: complaintsError } = await supabaseAdmin
      .from('complaints')
      .select('id')
      .eq('user_id', id)
    
    if (complaintsError) {
      console.error('⚠️ Error checking complaints:', complaintsError)
    }

    const hasNewsArticles = newsArticles && newsArticles.length > 0
    const hasComplaints = complaints && complaints.length > 0

    console.log('📊 Related records:', {
      newsArticles: newsArticles?.length || 0,
      complaints: complaints?.length || 0
    })

    // If user has related records, offer options
    if (hasNewsArticles || hasComplaints) {
      const relatedItems = []
      if (hasNewsArticles) relatedItems.push(`${newsArticles.length} news article(s)`)
      if (hasComplaints) relatedItems.push(`${complaints.length} grievance(s)`)
      
      console.log('⚠️ User has related records, cannot delete')
      return res.status(400).json({
        success: false,
        error: 'Cannot delete user with related records',
        details: `This user has ${relatedItems.join(' and ')}. Please reassign or delete these records first, or disable the user account instead.`,
        relatedRecords: {
          newsArticles: newsArticles?.length || 0,
          complaints: complaints?.length || 0
        },
        suggestion: 'disable' // Suggest disabling instead
      })
    }

    // No related records, proceed with deletion
    console.log('✅ No related records found, proceeding with deletion')

    // First, delete the user from auth
    console.log('🔐 Deleting user from Supabase Auth...')
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)
    if (authError) {
      console.error('⚠️ Auth delete error:', authError)
      // Continue even if auth delete fails - user might not exist in auth
    } else {
      console.log('✅ User deleted from Auth')
    }

    // Delete from public.users table
    console.log('📋 Deleting user from public.users table...')
    const { data, error: dbError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id)
      .select()

    if (dbError) {
      console.error('❌ Database delete error:', dbError)
      throw dbError
    }

    console.log('✅ User deleted successfully:', data)

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('❌ Delete user error:', error)
    
    // Handle foreign key constraint errors specifically
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete user with related records',
        details: 'This user has related data in the system. Please reassign or remove their associated records first, or disable the account instead.',
        suggestion: 'disable'
      })
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      details: error.message
    })
  }
}
