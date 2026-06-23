import { supabaseAdmin } from '../config/supabase.js'
import ActivityLogger from '../utils/activityLogger.js'

/**
 * Get all system settings grouped by category
 */
export const getAllSettings = async (req, res) => {
  try {
    console.log('📋 Fetching all system settings...')

    const { data, error } = await supabaseAdmin
      .from('system_settings')
      .select('*')
      .order('category', { ascending: true })
      .order('setting_key', { ascending: true })

    if (error) {
      console.error('❌ Error fetching settings:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch settings'
      })
    }

    // Group settings by category
    const grouped = data.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      
      // Don't send encrypted passwords to frontend
      if (setting.is_encrypted && setting.setting_value) {
        setting.setting_value = '********'
      }
      
      acc[setting.category].push(setting)
      return acc
    }, {})

    console.log('✅ Fetched settings for', Object.keys(grouped).length, 'categories')

    res.json({
      success: true,
      data: grouped,
      categories: Object.keys(grouped)
    })
  } catch (error) {
    console.error('❌ Error in getAllSettings:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

/**
 * Get settings by category
 */
export const getSettingsByCategory = async (req, res) => {
  try {
    const { category } = req.params

    console.log('📋 Fetching settings for category:', category)

    const { data, error } = await supabaseAdmin
      .from('system_settings')
      .select('*')
      .eq('category', category)
      .order('setting_key', { ascending: true })

    if (error) {
      console.error('❌ Error fetching settings:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch settings'
      })
    }

    // Mask encrypted values
    data.forEach(setting => {
      if (setting.is_encrypted && setting.setting_value) {
        setting.setting_value = '********'
      }
    })

    console.log('✅ Fetched', data.length, 'settings')

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('❌ Error in getSettingsByCategory:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

/**
 * Get a single setting by key
 */
export const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params

    const { data, error } = await supabaseAdmin
      .from('system_settings')
      .select('*')
      .eq('setting_key', key)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Setting not found'
        })
      }
      
      console.error('❌ Error fetching setting:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch setting'
      })
    }

    // Mask encrypted value
    if (data.is_encrypted && data.setting_value) {
      data.setting_value = '********'
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('❌ Error in getSettingByKey:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

/**
 * Update a single setting
 */
export const updateSetting = async (req, res) => {
  try {
    const { key } = req.params
    const { value } = req.body

    console.log('📝 Updating setting:', key, 'to:', value)

    // Get current setting to check if it exists and for logging old value
    const { data: currentSetting, error: fetchError } = await supabaseAdmin
      .from('system_settings')
      .select('*')
      .eq('setting_key', key)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Setting not found'
        })
      }
      
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch setting'
      })
    }

    // Update the setting
    const { data, error } = await supabaseAdmin
      .from('system_settings')
      .update({
        setting_value: value,
        updated_by: req.user.id
      })
      .eq('setting_key', key)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating setting:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to update setting'
      })
    }

    // Log the activity
    await ActivityLogger.log({
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.full_name || req.user.email,
      action: 'update',
      entityType: 'settings',
      entityId: data.id,
      description: `Updated setting: ${key}`,
      ipAddress: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent'],
      metadata: {
        setting_key: key,
        old_value: currentSetting.is_encrypted ? '[ENCRYPTED]' : currentSetting.setting_value,
        new_value: data.is_encrypted ? '[ENCRYPTED]' : value,
        category: data.category
      }
    })

    // Mask encrypted value in response
    if (data.is_encrypted && data.setting_value) {
      data.setting_value = '********'
    }

    console.log('✅ Setting updated:', key)

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data
    })
  } catch (error) {
    console.error('❌ Error in updateSetting:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

/**
 * Update multiple settings at once
 */
export const updateMultipleSettings = async (req, res) => {
  try {
    const { settings } = req.body // Array of { key, value }

    if (!Array.isArray(settings) || settings.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Settings array is required'
      })
    }

    console.log('📝 Updating', settings.length, 'settings...')

    const updates = []
    const errors = []

    // Update each setting
    for (const { key, value } of settings) {
      try {
        // Get current value for logging
        const { data: currentSetting } = await supabaseAdmin
          .from('system_settings')
          .select('*')
          .eq('setting_key', key)
          .single()

        // Update the setting
        const { data, error } = await supabaseAdmin
          .from('system_settings')
          .update({
            setting_value: value,
            updated_by: req.user.id
          })
          .eq('setting_key', key)
          .select()
          .single()

        if (error) {
          errors.push({ key, error: error.message })
          continue
        }

        updates.push(data)

        // Log the activity
        await ActivityLogger.log({
          userId: req.user.id,
          userEmail: req.user.email,
          userName: req.user.full_name || req.user.email,
          action: 'update',
          entityType: 'settings',
          entityId: data.id,
          description: `Updated setting: ${key}`,
          ipAddress: req.ip || req.headers['x-forwarded-for'],
          userAgent: req.headers['user-agent'],
          metadata: {
            setting_key: key,
            old_value: currentSetting?.is_encrypted ? '[ENCRYPTED]' : currentSetting?.setting_value,
            new_value: data.is_encrypted ? '[ENCRYPTED]' : value,
            category: data.category
          }
        })
      } catch (err) {
        errors.push({ key, error: err.message })
      }
    }

    // Mask encrypted values
    updates.forEach(setting => {
      if (setting.is_encrypted && setting.setting_value) {
        setting.setting_value = '********'
      }
    })

    console.log('✅ Updated', updates.length, 'settings,', errors.length, 'errors')

    res.json({
      success: true,
      message: `Updated ${updates.length} settings`,
      data: updates,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    console.error('❌ Error in updateMultipleSettings:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

/**
 * Reset settings to default values
 */
export const resetSettings = async (req, res) => {
  try {
    const { category } = req.body

    console.log('🔄 Resetting settings for category:', category || 'all')

    // Log the activity
    await ActivityLogger.log({
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.full_name || req.user.email,
      action: 'update',
      entityType: 'settings',
      description: category 
        ? `Reset ${category} settings to default` 
        : 'Reset all settings to default',
      ipAddress: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent'],
      metadata: { category }
    })

    res.json({
      success: true,
      message: 'This feature requires re-running the default settings SQL script'
    })
  } catch (error) {
    console.error('❌ Error in resetSettings:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

/**
 * Test email configuration
 */
export const testEmailConfig = async (req, res) => {
  try {
    const { to } = req.body

    if (!to) {
      return res.status(400).json({
        success: false,
        error: 'Recipient email is required'
      })
    }

    console.log('📧 Testing email configuration...')

    // Import email service
    const { sendEmail } = await import('../services/gmailService.js')

    // Send test email
    const result = await sendEmail({
      to,
      subject: 'Test Email - Litein Municipal Board',
      html: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email to verify your email configuration is working correctly.</p>
        <p>If you received this email, your SMTP settings are configured properly.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Sent from Litein Municipal Board System<br>
          ${new Date().toLocaleString()}
        </p>
      `
    })

    // Log the activity
    await ActivityLogger.log({
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.full_name || req.user.email,
      action: 'view',
      entityType: 'settings',
      description: `Tested email configuration (sent to ${to})`,
      ipAddress: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent']
    })

    console.log('✅ Test email sent')

    res.json({
      success: true,
      message: 'Test email sent successfully'
    })
  } catch (error) {
    console.error('❌ Error testing email:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send test email'
    })
  }
}

/**
 * Get system info (version, uptime, etc.)
 */
export const getSystemInfo = async (req, res) => {
  try {
    const info = {
      version: '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    }

    res.json({
      success: true,
      data: info
    })
  } catch (error) {
    console.error('❌ Error in getSystemInfo:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}
