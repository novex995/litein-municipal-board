import { supabaseAdmin } from '../config/supabase.js'
import { sendEmail } from '../services/emailService.js'

// Generate unique reference number
const generateReferenceNumber = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `LMB-${year}-${random}`
}

// Create new complaint (Grievance)
export const createComplaint = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      ward,
      id_number,
      grievance_type,
      department,
      subject,
      description,
      date_occurred,
      attachments,
      // Legacy support for old complaint format
      category,
      title,
      location,
      latitude,
      longitude,
      contactName,
      contactPhone,
      contactEmail,
      images = []
    } = req.body

    const referenceNumber = generateReferenceNumber()
    const submittedDate = new Date().toISOString()

    // Build description with additional grievance details
    let fullDescription = description || ''
    
    // Append additional grievance information to description
    if (id_number) {
      fullDescription += `\n\nID/Passport Number: ${id_number}`
    }
    if (date_occurred) {
      fullDescription += `\nDate Occurred: ${date_occurred}`
    }
    if (ward) {
      fullDescription += `\nWard/Location: ${ward}`
    }
    if (attachments) {
      fullDescription += `\nAttachments: ${attachments}`
    }

    // Support both grievance format and legacy complaint format
    const complaintData = {
      reference_number: referenceNumber,
      user_id: req.user?.id || null,
      category: grievance_type || category || 'General',
      title: subject || title,
      description: fullDescription,
      location: ward || location || 'Not specified',
      latitude,
      longitude,
      contact_name: name || contactName,
      contact_phone: phone || contactPhone,
      contact_email: email || contactEmail,
      status: 'submitted',
      priority: 'medium'
    }

    // Insert complaint
    const { data: complaint, error } = await supabaseAdmin
      .from('complaints')
      .insert(complaintData)
      .select()
      .single()

    if (error) throw error

    // Insert images if provided
    if (images.length > 0) {
      const imageRecords = images.map(url => ({
        complaint_id: complaint.id,
        image_url: url
      }))

      await supabaseAdmin
        .from('complaint_images')
        .insert(imageRecords)
    }

    // Send confirmation email to the complainant
    try {
      await sendEmail({
        to: complaint.contact_email,
        subject: `Grievance Confirmation - Reference #${referenceNumber}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
              .info-box { background: #f0f9ff; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 4px; }
              .info-box strong { color: #16a34a; }
              .ref-number { font-size: 24px; font-weight: bold; color: #16a34a; text-align: center; padding: 15px; background: #f0fdf4; border-radius: 8px; margin: 20px 0; }
              .status-badge { display: inline-block; background: #fbbf24; color: #78350f; padding: 6px 16px; border-radius: 20px; font-weight: bold; font-size: 12px; }
              .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
              ul { padding-left: 20px; }
              ul li { margin: 8px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✓ Grievance Received</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.95;">Litein Municipal Board</p>
              </div>
              
              <div class="content">
                <p>Dear ${complaint.contact_name},</p>
                
                <p>Thank you for submitting your grievance to Litein Municipal Board. We have received your complaint and it is now being reviewed by our team.</p>
                
                <div class="ref-number">
                  Tracking Number: ${referenceNumber}
                </div>
                
                <div class="info-box">
                  <p><strong>Grievance Details:</strong></p>
                  <ul style="margin: 10px 0;">
                    <li><strong>Subject:</strong> ${complaint.title}</li>
                    <li><strong>Type:</strong> ${complaint.category}</li>
                    <li><strong>Department:</strong> ${department || 'To be assigned'}</li>
                    <li><strong>Submitted:</strong> ${new Date(submittedDate).toLocaleString('en-KE', { dateStyle: 'full', timeStyle: 'short' })}</li>
                    <li><strong>Status:</strong> <span class="status-badge">SUBMITTED</span></li>
                  </ul>
                </div>
                
                <p><strong>What happens next?</strong></p>
                <ol style="padding-left: 20px;">
                  <li>Your grievance will be reviewed and assigned to the appropriate department</li>
                  <li>An investigation will be conducted</li>
                  <li>You will receive updates on the progress</li>
                  <li>A resolution will be provided within 30 days (standard timeline)</li>
                </ol>
                
                <p><strong>Track Your Grievance:</strong></p>
                <p>You can track the status of your grievance at any time using your tracking number:</p>
                <div style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/grievance?track=${referenceNumber}" class="button">Track My Grievance</a>
                </div>
                
                <p style="margin-top: 30px;"><strong>Need Help?</strong></p>
                <p>If you have any questions about your grievance, please contact us:</p>
                <ul style="margin: 10px 0;">
                  <li>Email: <a href="mailto:grievances@liteinmunicipal.go.ke" style="color: #16a34a;">grievances@liteinmunicipal.go.ke</a></li>
                  <li>Phone: <a href="tel:+254712345678" style="color: #16a34a;">+254 712 345 678</a></li>
                  <li>Toll Free: <a href="tel:0800720464" style="color: #16a34a;">0800-720-464</a></li>
                </ul>
                
                <p style="margin-top: 30px;">Thank you for helping us improve our services.</p>
                
                <p style="margin-top: 20px;">Best regards,<br/><strong>Litein Municipal Board<br/>Grievance Redress Team</strong></p>
              </div>
              
              <div class="footer">
                <p style="margin: 0;">This is an automated confirmation email. Please do not reply to this email.</p>
                <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} Litein Municipal Board. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
GRIEVANCE CONFIRMATION - LITEIN MUNICIPAL BOARD

Dear ${complaint.contact_name},

Thank you for submitting your grievance. We have received your complaint and it is now being reviewed.

TRACKING NUMBER: ${referenceNumber}

GRIEVANCE DETAILS:
- Subject: ${complaint.title}
- Type: ${complaint.category}
- Department: ${department || 'To be assigned'}
- Submitted: ${new Date(submittedDate).toLocaleString('en-KE')}
- Status: SUBMITTED

WHAT HAPPENS NEXT:
1. Your grievance will be reviewed and assigned
2. An investigation will be conducted
3. You will receive updates on progress
4. Resolution within 30 days (standard timeline)

Track your grievance: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/grievance?track=${referenceNumber}

CONTACT US:
- Email: grievances@liteinmunicipal.go.ke
- Phone: +254 712 345 678
- Toll Free: 0800-720-464

Best regards,
Litein Municipal Board
Grievance Redress Team
        `
      })

      console.log('✓ Confirmation email sent to:', complaint.contact_email)
    } catch (emailError) {
      console.error('✗ Failed to send confirmation email:', emailError.message)
      // Don't fail the entire request if email fails
    }

    // Note: Staff notification email removed because info@liteinmunicipal.go.ke doesn't exist
    // Staff can view new grievances directly in the admin dashboard
    // To re-enable staff notifications, add a valid email address in system settings

    res.status(201).json({
      success: true,
      data: complaint,
      message: 'Grievance submitted successfully. A confirmation email has been sent to your email address.'
    })
  } catch (error) {
    console.error('Create complaint error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to submit grievance. Please try again.'
    })
  }
}

// Get all complaints (with filters)
export const getComplaints = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('complaints')
      .select('*, complaint_images(*)', { count: 'exact' })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (category) {
      query = query.eq('category', category)
    }

    // For citizens, only show their complaints
    if (req.user?.role === 'citizen') {
      query = query.eq('user_id', req.user.id)
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
    console.error('Get complaints error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch complaints'
    })
  }
}

// Get single complaint by reference number
export const getComplaintByReference = async (req, res) => {
  try {
    const { referenceNumber } = req.params

    const { data, error } = await supabaseAdmin
      .from('complaints')
      .select('*, complaint_images(*), complaint_comments(*)')
      .eq('reference_number', referenceNumber)
      .single()

    if (error) throw error

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found'
      })
    }

    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Get complaint error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch complaint'
    })
  }
}

// Update complaint status (staff/admin only)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, resolutionNotes, assignedTo, assignedDepartment } = req.body

    const updateData = { status }

    if (resolutionNotes) {
      updateData.resolution_notes = resolutionNotes
    }
    if (assignedTo) {
      updateData.assigned_to = assignedTo
    }
    if (assignedDepartment) {
      updateData.assigned_department = assignedDepartment
    }
    if (status === 'resolved' || status === 'closed') {
      updateData.resolved_at = new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('complaints')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      data,
      message: 'Complaint updated successfully'
    })
  } catch (error) {
    console.error('Update complaint error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update complaint'
    })
  }
}

// Add comment to complaint
export const addComplaintComment = async (req, res) => {
  try {
    const { id } = req.params
    const { comment, isInternal = false } = req.body

    const { data, error } = await supabaseAdmin
      .from('complaint_comments')
      .insert({
        complaint_id: id,
        user_id: req.user.id,
        comment,
        is_internal: isInternal
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      data,
      message: 'Comment added successfully'
    })
  } catch (error) {
    console.error('Add comment error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to add comment'
    })
  }
}

// Get complaint statistics
export const getComplaintStats = async (req, res) => {
  try {
    const { count: total } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: true })

    const { count: submitted } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'submitted')

    const { count: inProgress } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'in_progress')

    const { count: resolved } = await supabaseAdmin
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'resolved')

    res.json({
      success: true,
      data: {
        total: total || 0,
        submitted: submitted || 0,
        inProgress: inProgress || 0,
        resolved: resolved || 0
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    })
  }
}
