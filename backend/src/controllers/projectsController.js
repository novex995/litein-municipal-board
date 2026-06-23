import { supabaseAdmin } from '../config/supabase.js'

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('projects')
      .select('*, project_images(*), departments(name)', { count: 'exact' })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

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
    console.error('Get projects error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    })
  }
}

// Get single project
export const getProject = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*, project_images(*), project_updates(*), departments(name)')
      .eq('id', id)
      .single()

    if (error) throw error

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    })
  }
}

// Create project (admin only)
export const createProject = async (req, res) => {
  try {
    console.log('📦 Creating project with data:', JSON.stringify(req.body, null, 2))
    
    const {
      name,
      description,
      location,
      budget,
      contractor,
      fundingSource,
      funding_source,
      status,
      startDate,
      start_date,
      endDate,
      end_date,
      departmentId,
      department_id,
      completion_percentage,
      images
    } = req.body

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Project name is required'
      })
    }

    const projectInsertData = {
      name,
      description,
      location,
      budget: parseFloat(budget) || 0,
      contractor,
      funding_source: fundingSource || funding_source,
      status: status || 'planned',
      start_date: startDate || start_date,
      end_date: endDate || end_date,
      department_id: departmentId || department_id || null,
      completion_percentage: completion_percentage || 0
    }

    console.log('📝 Inserting project:', projectInsertData)

    // Insert project
    const { data: projectData, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert(projectInsertData)
      .select()
      .single()

    if (projectError) {
      console.error('❌ Project insert error:', projectError)
      return res.status(400).json({
        success: false,
        error: projectError.message || 'Failed to create project'
      })
    }

    console.log('✅ Project created:', projectData.id)

    // Insert project images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      console.log(`📷 Inserting ${images.length} images...`)
      
      const imageInserts = images.map(img => ({
        project_id: projectData.id,
        image_url: img.image_url,
        caption: img.caption || null
      }))

      const { error: imagesError } = await supabaseAdmin
        .from('project_images')
        .insert(imageInserts)

      if (imagesError) {
        console.error('⚠️ Images insert error:', imagesError)
        // Don't fail the entire request if images fail
      } else {
        console.log('✅ Images inserted successfully')
      }
    }

    // Fetch complete project with images
    const { data: completeProject, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('*, project_images(*)')
      .eq('id', projectData.id)
      .single()

    if (fetchError) {
      console.error('⚠️ Fetch complete project error:', fetchError)
      // Return project without images if fetch fails
      return res.status(201).json({
        success: true,
        data: projectData,
        message: 'Project created successfully'
      })
    }

    console.log('🎉 Project creation complete')

    res.status(201).json({
      success: true,
      data: completeProject,
      message: 'Project created successfully'
    })
  } catch (error) {
    console.error('❌ Create project error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create project'
    })
  }
}

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      data,
      message: 'Project updated successfully'
    })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    })
  }
}

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params

    // Delete project (images will cascade delete due to ON DELETE CASCADE)
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    })
  }
}

// Add project update
export const addProjectUpdate = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, completionPercentage } = req.body

    const { data, error } = await supabaseAdmin
      .from('project_updates')
      .insert({
        project_id: id,
        title,
        description,
        completion_percentage: completionPercentage,
        created_by: req.user.id
      })
      .select()
      .single()

    if (error) throw error

    // Update project completion percentage
    if (completionPercentage !== undefined) {
      await supabaseAdmin
        .from('projects')
        .update({ completion_percentage: completionPercentage })
        .eq('id', id)
    }

    res.status(201).json({
      success: true,
      data,
      message: 'Project update added successfully'
    })
  } catch (error) {
    console.error('Add project update error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to add project update'
    })
  }
}

// Get project statistics
export const getProjectStats = async (req, res) => {
  try {
    console.log('📊 Fetching project statistics...')
    
    const { count: totalCount, error: totalError } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: true })

    const { count: ongoingCount, error: ongoingError } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ongoing')

    const { count: completedCount, error: completedError } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    const { data: budgetData, error: budgetError } = await supabaseAdmin
      .from('projects')
      .select('budget')

    if (totalError || ongoingError || completedError || budgetError) {
      console.error('Stats query errors:', { totalError, ongoingError, completedError, budgetError })
      throw new Error('Failed to fetch statistics')
    }

    const totalBudget = budgetData?.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0) || 0

    const stats = {
      total: totalCount || 0,
      ongoing: ongoingCount || 0,
      completed: completedCount || 0,
      totalBudget
    }

    console.log('✅ Project stats:', stats)

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('❌ Get project stats error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    })
  }
}
