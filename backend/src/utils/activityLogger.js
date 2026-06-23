import { supabaseAdmin } from '../config/supabase.js'

/**
 * Utility class for logging activities throughout the application
 */
class ActivityLogger {
  /**
   * Log an activity
   * @param {Object} params - Activity parameters
   * @param {string} params.userId - User ID (UUID)
   * @param {string} params.userEmail - User email
   * @param {string} params.userName - User full name
   * @param {string} params.action - Action type: login, logout, create, update, delete, view
   * @param {string} params.entityType - Entity type: auth, user, complaint, project, news, settings
   * @param {string} params.entityId - Entity ID (optional)
   * @param {string} params.description - Human-readable description
   * @param {string} params.ipAddress - IP address (optional)
   * @param {string} params.userAgent - User agent string (optional)
   * @param {Object} params.metadata - Additional JSON data (optional)
   */
  static async log({
    userId,
    userEmail,
    userName,
    action,
    entityType,
    entityId = null,
    description,
    ipAddress = null,
    userAgent = null,
    metadata = null
  }) {
    try {
      const { data, error } = await supabaseAdmin
        .from('activity_logs')
        .insert({
          user_id: userId,
          user_email: userEmail,
          user_name: userName,
          action,
          entity_type: entityType,
          entity_id: entityId,
          description,
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Failed to log activity:', error)
        return null
      }

      console.log('📝 Activity logged:', action, entityType, description)
      return data
    } catch (error) {
      console.error('❌ Error in ActivityLogger:', error)
      return null
    }
  }

  /**
   * Log from Express request object
   * @param {Object} req - Express request object
   * @param {string} action - Action type
   * @param {string} entityType - Entity type
   * @param {Object} options - Additional options
   */
  static async logFromRequest(req, action, entityType, options = {}) {
    const { user } = req
    const { entityId, description, metadata } = options

    if (!user) {
      console.warn('⚠️ Cannot log activity: No user in request')
      return null
    }

    return this.log({
      userId: user.id,
      userEmail: user.email,
      userName: user.full_name || user.email,
      action,
      entityType,
      entityId,
      description,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      metadata
    })
  }

  /**
   * Log login activity
   */
  static async logLogin(req, userEmail, userName = null) {
    return this.log({
      userId: req.user?.id || null,
      userEmail,
      userName: userName || userEmail.split('@')[0],
      action: 'login',
      entityType: 'auth',
      description: `User logged in: ${userEmail}`,
      ipAddress: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent']
    })
  }

  /**
   * Log logout activity
   */
  static async logLogout(req) {
    return this.logFromRequest(req, 'logout', 'auth', {
      description: `User logged out: ${req.user.email}`
    })
  }

  /**
   * Log user creation
   */
  static async logUserCreate(req, newUser) {
    return this.logFromRequest(req, 'create', 'user', {
      entityId: newUser.id,
      description: `Created new user: ${newUser.email} (${newUser.role})`,
      metadata: {
        created_user_email: newUser.email,
        created_user_role: newUser.role,
        created_user_department: newUser.department
      }
    })
  }

  /**
   * Log user update
   */
  static async logUserUpdate(req, userId, changes) {
    return this.logFromRequest(req, 'update', 'user', {
      entityId: userId,
      description: `Updated user information`,
      metadata: { changes }
    })
  }

  /**
   * Log user deletion
   */
  static async logUserDelete(req, deletedUser) {
    return this.logFromRequest(req, 'delete', 'user', {
      entityId: deletedUser.id,
      description: `Deleted user: ${deletedUser.email}`,
      metadata: {
        deleted_user_email: deletedUser.email,
        deleted_user_role: deletedUser.role
      }
    })
  }

  /**
   * Log complaint creation
   */
  static async logComplaintCreate(req, complaint) {
    return this.logFromRequest(req, 'create', 'complaint', {
      entityId: complaint.id,
      description: `Created complaint: ${complaint.reference_number}`,
      metadata: {
        complaint_category: complaint.category,
        complaint_status: complaint.status
      }
    })
  }

  /**
   * Log complaint update
   */
  static async logComplaintUpdate(req, complaintId, changes) {
    return this.logFromRequest(req, 'update', 'complaint', {
      entityId: complaintId,
      description: `Updated complaint status or details`,
      metadata: { changes }
    })
  }

  /**
   * Log project creation
   */
  static async logProjectCreate(req, project) {
    return this.logFromRequest(req, 'create', 'project', {
      entityId: project.id,
      description: `Created project: ${project.name}`,
      metadata: {
        project_status: project.status,
        project_budget: project.budget
      }
    })
  }

  /**
   * Log project update
   */
  static async logProjectUpdate(req, projectId, changes) {
    return this.logFromRequest(req, 'update', 'project', {
      entityId: projectId,
      description: `Updated project information`,
      metadata: { changes }
    })
  }

  /**
   * Log news creation
   */
  static async logNewsCreate(req, news) {
    return this.logFromRequest(req, 'create', 'news', {
      entityId: news.id,
      description: `Created news article: ${news.title}`,
      metadata: {
        news_category: news.category,
        news_published: news.published
      }
    })
  }

  /**
   * Log news update
   */
  static async logNewsUpdate(req, newsId, changes) {
    return this.logFromRequest(req, 'update', 'news', {
      entityId: newsId,
      description: `Updated news article`,
      metadata: { changes }
    })
  }

  /**
   * Log news deletion
   */
  static async logNewsDelete(req, news) {
    return this.logFromRequest(req, 'delete', 'news', {
      entityId: news.id,
      description: `Deleted news article: ${news.title}`
    })
  }

  /**
   * Log settings change
   */
  static async logSettingsChange(req, settingName, oldValue, newValue) {
    return this.logFromRequest(req, 'update', 'settings', {
      description: `Changed setting: ${settingName}`,
      metadata: {
        setting_name: settingName,
        old_value: oldValue,
        new_value: newValue
      }
    })
  }

  /**
   * Log report generation
   */
  static async logReportGenerate(req, reportType) {
    return this.logFromRequest(req, 'view', 'report', {
      description: `Generated ${reportType} report`
    })
  }

  /**
   * Log data export
   */
  static async logDataExport(req, entityType, count) {
    return this.logFromRequest(req, 'view', entityType, {
      description: `Exported ${count} ${entityType} records`,
      metadata: { export_count: count }
    })
  }
}

export default ActivityLogger
