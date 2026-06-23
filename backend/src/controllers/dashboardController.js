import { supabaseAdmin } from '../config/supabase.js'

// Get Admin Dashboard Stats
export const getAdminDashboardStats = async (req, res) => {
  try {
    console.log('🔍 Fetching admin dashboard stats...')
    
    // Get total users count from auth.users (all staff with @litein.go.ke emails)
    const { data: authUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id')
    
    const usersCount = authUsers?.length || 0
    
    console.log('Users count:', usersCount, 'Error:', usersError)

    // Get active complaints
    const { count: complaintsCount, error: complaintsError } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'under_review', 'assigned', 'in_progress'])
    
    console.log('Complaints count:', complaintsCount, 'Error:', complaintsError)

    // Get active projects
    const { count: projectsCount, error: projectsError } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .in('status', ['planned', 'tendering', 'ongoing'])
    
    console.log('Projects count:', projectsCount, 'Error:', projectsError)

    // Get pending approvals
    const { count: approvalsCount, error: approvalsError } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'assigned')
    
    console.log('Approvals count:', approvalsCount, 'Error:', approvalsError)
    console.log('Approvals count:', approvalsCount, 'Error:', approvalsError)

    // Get recent activities (last 4 from various sources)
    const { data: recentComplaints, error: complaintsDataError } = await supabaseAdmin
      .from('complaints')
      .select('id, title, status, created_at')
      .order('created_at', { ascending: false})
      .limit(2)
    
    console.log('Recent complaints:', recentComplaints, 'Error:', complaintsDataError)

    const { data: recentProjects, error: projectsDataError } = await supabaseAdmin
      .from('projects')
      .select('id, name, status, updated_at')
      .order('updated_at', { ascending: false})
      .limit(2)
    
    console.log('Recent projects:', recentProjects, 'Error:', projectsDataError)

    const activities = [
      ...(recentComplaints || []).map(c => ({
        action: 'Complaint submitted',
        user: c.title,
        time: new Date(c.created_at).toLocaleString(),
        type: 'warning'
      })),
      ...(recentProjects || []).map(p => ({
        action: p.status === 'completed' ? 'Project completed' : 'Project updated',
        user: p.name,
        time: new Date(p.updated_at).toLocaleString(),
        type: 'success'
      }))
    ]

    const responseData = {
      totalUsers: usersCount || 0,
      activeComplaints: complaintsCount || 0,
      activeProjects: projectsCount || 0,
      pendingApprovals: approvalsCount || 0,
      recentActivities: activities.slice(0, 4)
    }

    console.log('✅ Sending response:', responseData)

    res.json({
      success: true,
      data: responseData
    })
  } catch (error) {
    console.error('❌ Error fetching admin dashboard stats:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get Staff Dashboard Stats
export const getStaffDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id

    // Get completed tasks
    const { count: completedCount } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .eq('status', 'resolved')
      .eq('assigned_to', userId)

    // Get pending tasks
    const { count: pendingCount } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .in('status', ['submitted', 'under_review', 'assigned', 'in_progress'])
      .eq('assigned_to', userId)

    // Get documents count
    const { count: docsCount } = await supabaseAdmin
      .from('documents')
      .select('*', { count: 'exact', head: 'only' })
      .eq('uploaded_by', userId)

    // Get active projects count
    const { count: projectsCount } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: 'only' })
      .in('status', ['planned', 'tendering', 'ongoing'])

    // Get recent activities
    const { data: activities } = await supabaseAdmin
      .from('complaints')
      .select('id, title, status, updated_at')
      .eq('assigned_to', userId)
      .order('updated_at', { ascending: false })
      .limit(4)

    res.json({
      success: true,
      data: {
        completedTasks: completedCount || 0,
        pendingTasks: pendingCount || 0,
        documents: docsCount || 0,
        activeProjects: projectsCount || 0,
        recentActivities: activities || []
      }
    })
  } catch (error) {
    console.error('Error fetching staff dashboard stats:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get Manager Dashboard Stats
export const getManagerDashboardStats = async (req, res) => {
  try {
    // Get total staff count
    const { count: staffCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: 'only' })
      .eq('role', 'municipal_staff')

    // Get active projects
    const { count: projectsCount } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: 'only' })
      .in('status', ['planned', 'tendering', 'ongoing'])

    // Get pending approvals
    const { count: approvalsCount } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .eq('status', 'assigned')

    // Get budget info (sum all projects budgets)
    const { data: budgetData } = await supabaseAdmin
      .from('projects')
      .select('budget')
      .not('budget', 'is', null)

    const totalBudget = budgetData?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0

    // Get recent activities
    const { data: activities } = await supabaseAdmin
      .from('complaints')
      .select('id, title, status, updated_at')
      .order('updated_at', { ascending: false })
      .limit(4)

    res.json({
      success: true,
      data: {
        totalStaff: staffCount || 0,
        activeProjects: projectsCount || 0,
        pendingApprovals: approvalsCount || 0,
        budgetUsed: Math.round((totalBudget / 500000000) * 100), // 500M budget
        recentActivities: activities || []
      }
    })
  } catch (error) {
    console.error('Error fetching manager dashboard stats:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get Department Head Dashboard Stats
export const getDepartmentHeadDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id

    // Get department info
    const { data: department } = await supabaseAdmin
      .from('departments')
      .select('id')
      .eq('head_id', userId)
      .single()

    if (!department) {
      return res.json({
        success: true,
        data: {
          departmentStaff: 0,
          activeProjects: 0,
          pendingTasks: 0,
          openComplaints: 0,
          recentActivities: []
        }
      })
    }

    // Get department staff count
    const { count: staffCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: 'only' })
      .eq('role', 'municipal_staff')

    // Get active projects in department
    const { count: projectsCount } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: 'only' })
      .eq('department_id', department.id)
      .in('status', ['planned', 'tendering', 'ongoing'])

    // Get pending tasks
    const { count: tasksCount } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .eq('assigned_department', department.id)
      .in('status', ['assigned', 'in_progress'])

    // Get open complaints
    const { count: complaintsCount } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .eq('assigned_department', department.id)
      .in('status', ['submitted', 'under_review'])

    // Get recent activities
    const { data: activities } = await supabaseAdmin
      .from('complaints')
      .select('id, title, status, updated_at')
      .eq('assigned_department', department.id)
      .order('updated_at', { ascending: false })
      .limit(4)

    res.json({
      success: true,
      data: {
        departmentStaff: staffCount || 0,
        activeProjects: projectsCount || 0,
        pendingTasks: tasksCount || 0,
        openComplaints: complaintsCount || 0,
        recentActivities: activities || []
      }
    })
  } catch (error) {
    console.error('Error fetching department head dashboard stats:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get Finance Dashboard Stats
export const getFinanceDashboardStats = async (req, res) => {
  try {
    // Get total revenue (from all business licenses and services)
    const { data: licenseData } = await supabaseAdmin
      .from('complaints')
      .select('*')
      .like('category', '%license%')

    // Get total expenses (sum of all project budgets)
    const { data: projectData } = await supabaseAdmin
      .from('projects')
      .select('budget, status')
      .not('budget', 'is', null)

    const totalExpenses = projectData?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0
    const totalRevenue = 450000000 // Placeholder, 450M KES

    // Get pending payments
    const { count: paymentCount } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .eq('status', 'assigned')

    // Get outstanding invoices
    const { count: invoiceCount } = await supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact', head: 'only' })
      .in('status', ['ongoing', 'planned'])

    // Get recent transactions
    const { data: transactions } = await supabaseAdmin
      .from('complaints')
      .select('id, title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(4)

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue,
        expenses: Math.round(totalExpenses),
        pendingPayments: paymentCount || 0,
        outstandingInvoices: invoiceCount || 0,
        recentTransactions: transactions || []
      }
    })
  } catch (error) {
    console.error('Error fetching finance dashboard stats:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get Licenses Dashboard Stats
export const getLicensesDashboardStats = async (req, res) => {
  try {
    // Get active licenses
    const { count: activeLicenses } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .like('category', '%license%')
      .eq('status', 'resolved')

    // Get pending applications
    const { count: pendingApps } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .like('category', '%license%')
      .in('status', ['submitted', 'under_review'])

    // Get approved today
    const today = new Date().toISOString().split('T')[0]
    const { count: approvedToday } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .like('category', '%license%')
      .eq('status', 'resolved')
      .gte('updated_at', today)

    // Get expiring soon
    const { count: expiringSoon } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .like('category', '%license%')
      .eq('status', 'assigned')

    // Get recent applications
    const { data: applications } = await supabaseAdmin
      .from('complaints')
      .select('id, title, status, created_at')
      .like('category', '%license%')
      .order('created_at', { ascending: false })
      .limit(4)

    res.json({
      success: true,
      data: {
        activeLicenses: activeLicenses || 0,
        pendingApplications: pendingApps || 0,
        approvedToday: approvedToday || 0,
        expiringSoon: expiringSoon || 0,
        recentApplications: applications || []
      }
    })
  } catch (error) {
    console.error('Error fetching licenses dashboard stats:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get Grievances Dashboard Stats
export const getGrievancesDashboardStats = async (req, res) => {
  try {
    // Get total complaints
    const { count: totalComplaints } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })

    // Get new complaints
    const { count: newComplaints } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .eq('status', 'submitted')

    // Get in progress
    const { count: inProgressCount } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .in('status', ['assigned', 'in_progress', 'under_review'])

    // Get resolved
    const { count: resolvedCount } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .eq('status', 'resolved')

    // Get recent complaints
    const { data: recentComplaints } = await supabaseAdmin
      .from('complaints')
      .select('id, title, status, priority, created_at')
      .order('created_at', { ascending: false })
      .limit(4)

    res.json({
      success: true,
      data: {
        totalComplaints: totalComplaints || 0,
        newComplaints: newComplaints || 0,
        inProgress: inProgressCount || 0,
        resolved: resolvedCount || 0,
        resolutionRate: resolvedCount ? Math.round((resolvedCount / (totalComplaints || 1)) * 100) : 0,
        recentComplaints: recentComplaints || []
      }
    })
  } catch (error) {
    console.error('Error fetching grievances dashboard stats:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get Media Dashboard Stats
export const getMediaDashboardStats = async (req, res) => {
  try {
    // Get total articles
    const { count: articlesCount } = await supabaseAdmin
      .from('news')
      .select('*', { count: 'exact', head: 'only' })

    // Get published news
    const { count: publishedCount } = await supabaseAdmin
      .from('news')
      .select('*', { count: 'exact', head: 'only' })
      .eq('published', true)

    // Get media files (gallery)
    const { count: mediaCount } = await supabaseAdmin
      .from('gallery')
      .select('*', { count: 'exact', head: 'only' })

    // Get upcoming events
    const { count: eventsCount } = await supabaseAdmin
      .from('events')
      .select('*', { count: 'exact', head: 'only' })
      .gte('event_date', new Date().toISOString())

    // Get recent articles
    const { data: articles } = await supabaseAdmin
      .from('news')
      .select('id, title, published, published_at, views')
      .order('published_at', { ascending: false })
      .limit(4)

    res.json({
      success: true,
      data: {
        totalArticles: articlesCount || 0,
        publishedNews: publishedCount || 0,
        mediaFiles: mediaCount || 0,
        upcomingEvents: eventsCount || 0,
        recentArticles: articles || []
      }
    })
  } catch (error) {
    console.error('Error fetching media dashboard stats:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get Citizen Service Dashboard Stats
export const getCitizenServiceDashboardStats = async (req, res) => {
  try {
    // Get citizens served today
    const today = new Date().toISOString().split('T')[0]
    const { count: servedToday } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .gte('created_at', today)

    // Get active inquiries
    const { count: inquiriesCount } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .in('status', ['submitted', 'under_review', 'assigned'])

    // Get today's appointments (check documents with today's date)
    const { count: appointmentsCount } = await supabaseAdmin
      .from('documents')
      .select('*', { count: 'exact', head: 'only' })
      .gte('created_at', today)

    // Get satisfaction (placeholder - 4.7/5)
    const satisfactionRate = 4.7

    // Get recent inquiries
    const { data: inquiries } = await supabaseAdmin
      .from('complaints')
      .select('id, title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(4)

    res.json({
      success: true,
      data: {
        citizensServed: servedToday || 0,
        activeInquiries: inquiriesCount || 0,
        todaysAppointments: appointmentsCount || 0,
        satisfactionRate: satisfactionRate,
        recentInquiries: inquiries || []
      }
    })
  } catch (error) {
    console.error('Error fetching citizen service dashboard stats:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

// Get ICT Dashboard Stats
export const getICTDashboardStats = async (req, res) => {
  try {
    // System status (placeholder - 99.8%)
    const systemStatus = 99.8

    // Active servers (placeholder - 8/8)
    const activeServers = 8
    const totalServers = 8

    // Get open support tickets
    const { count: openTickets } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: 'only' })
      .eq('status', 'assigned')

    // Network traffic (placeholder)
    const networkTraffic = 245

    // Get recent tickets
    const { data: tickets } = await supabaseAdmin
      .from('complaints')
      .select('id, title, status, priority, created_at')
      .order('created_at', { ascending: false })
      .limit(4)

    res.json({
      success: true,
      data: {
        systemStatus: systemStatus,
        activeServers: activeServers,
        totalServers: totalServers,
        openTickets: openTickets || 0,
        networkTraffic: networkTraffic,
        recentTickets: tickets || []
      }
    })
  } catch (error) {
    console.error('Error fetching ICT dashboard stats:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}
