import { supabaseAdmin } from '../config/supabase.js'

/**
 * Get activity logs with filtering and pagination
 */
export const getActivityLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      action,
      entity_type,
      user_email,
      start_date,
      end_date,
      search
    } = req.query

    console.log('📋 Fetching activity logs with params:', { 
      page, limit, action, entity_type, user_email, start_date, end_date, search 
    })

    const offset = (page - 1) * limit

    // Build query
    let query = supabaseAdmin
      .from('activity_logs')
      .select('*', { count: 'exact' })

    // Apply filters
    if (action && action !== 'all') {
      query = query.eq('action', action)
    }

    if (entity_type && entity_type !== 'all') {
      query = query.eq('entity_type', entity_type)
    }

    if (user_email) {
      query = query.eq('user_email', user_email)
    }

    if (start_date) {
      query = query.gte('created_at', start_date)
    }

    if (end_date) {
      query = query.lte('created_at', end_date)
    }

    if (search) {
      query = query.or(`description.ilike.%${search}%,user_email.ilike.%${search}%,user_name.ilike.%${search}%`)
    }

    // Order and paginate
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('❌ Error fetching activity logs:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch activity logs'
      })
    }

    console.log('✅ Fetched activity logs:', { count, dataLength: data?.length })

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('❌ Error in getActivityLogs:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

/**
 * Get activity statistics
 */
export const getActivityStats = async (req, res) => {
  try {
    console.log('📊 Fetching activity statistics...')

    // Get total activities count
    const { count: totalCount } = await supabaseAdmin
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })

    // Get activities by action type
    const { data: actionStats } = await supabaseAdmin
      .from('activity_logs')
      .select('action')

    // Get activities by entity type
    const { data: entityStats } = await supabaseAdmin
      .from('activity_logs')
      .select('entity_type')

    // Get recent 24 hours activity
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: last24Hours } = await supabaseAdmin
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday)

    // Get most active users
    const { data: topUsers } = await supabaseAdmin
      .from('activity_logs')
      .select('user_email, user_name')
      .limit(1000)

    // Process statistics
    const actionCounts = {}
    actionStats?.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1
    })

    const entityCounts = {}
    entityStats?.forEach(log => {
      if (log.entity_type) {
        entityCounts[log.entity_type] = (entityCounts[log.entity_type] || 0) + 1
      }
    })

    const userCounts = {}
    topUsers?.forEach(log => {
      const email = log.user_email
      if (email) {
        userCounts[email] = {
          email,
          name: log.user_name,
          count: (userCounts[email]?.count || 0) + 1
        }
      }
    })

    const topUsersArray = Object.values(userCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const stats = {
      totalActivities: totalCount || 0,
      last24Hours: last24Hours || 0,
      byAction: actionCounts,
      byEntity: entityCounts,
      topUsers: topUsersArray
    }

    console.log('✅ Activity statistics:', stats)

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('❌ Error in getActivityStats:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

/**
 * Create activity log
 */
export const createActivityLog = async (req, res) => {
  try {
    const {
      action,
      entity_type,
      entity_id,
      description,
      metadata
    } = req.body

    const user = req.user

    // Get IP and user agent
    const ip_address = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const user_agent = req.headers['user-agent']

    console.log('📝 Creating activity log:', { action, entity_type, description })

    const { data, error } = await supabaseAdmin
      .from('activity_logs')
      .insert({
        user_id: user.id,
        user_email: user.email,
        user_name: user.full_name,
        action,
        entity_type,
        entity_id,
        description,
        ip_address,
        user_agent,
        metadata
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating activity log:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to create activity log'
      })
    }

    console.log('✅ Activity log created:', data.id)

    res.status(201).json({
      success: true,
      data
    })
  } catch (error) {
    console.error('❌ Error in createActivityLog:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

/**
 * Export activity logs (CSV)
 */
export const exportActivityLogs = async (req, res) => {
  try {
    const { start_date, end_date, action, entity_type } = req.query

    console.log('📥 Exporting activity logs...')

    // Build query
    let query = supabaseAdmin
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10000) // Limit export to 10k records

    // Apply filters
    if (action && action !== 'all') {
      query = query.eq('action', action)
    }

    if (entity_type && entity_type !== 'all') {
      query = query.eq('entity_type', entity_type)
    }

    if (start_date) {
      query = query.gte('created_at', start_date)
    }

    if (end_date) {
      query = query.lte('created_at', end_date)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Error exporting activity logs:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to export activity logs'
      })
    }

    // Convert to CSV
    const headers = ['Date/Time', 'User Email', 'User Name', 'Action', 'Entity Type', 'Description', 'IP Address']
    const csvRows = [headers.join(',')]

    data?.forEach(log => {
      const row = [
        new Date(log.created_at).toLocaleString(),
        log.user_email || '',
        log.user_name || '',
        log.action || '',
        log.entity_type || '',
        `"${(log.description || '').replace(/"/g, '""')}"`, // Escape quotes
        log.ip_address || ''
      ]
      csvRows.push(row.join(','))
    })

    const csv = csvRows.join('\n')

    console.log('✅ Exported', data?.length, 'activity logs')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="activity-logs-${Date.now()}.csv"`)
    res.send(csv)
  } catch (error) {
    console.error('❌ Error in exportActivityLogs:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}
