# Grievance Email Notification Fix

## Problem Identified
When a grievance was submitted, the system attempted to send **two emails**:
1. ✅ **Confirmation email to the user** (working perfectly)
2. ❌ **Notification email to staff at `info@liteinmunicipal.go.ke`** (failing with "Address not found" error)

The domain `liteinmunicipal.go.ke` doesn't exist, causing the second email to bounce and show error messages to users.

## Solution Applied
- **Removed the staff notification email** (lines 189-218 in `complaintsController.js`)
- Users will now only see the successful confirmation message
- Staff can still view all new grievances in the **Admin Dashboard** in real-time

## How It Works Now
When a citizen submits a grievance:
1. ✅ Grievance is saved to database with tracking number
2. ✅ Confirmation email is sent to the user with tracking details
3. ✅ Success message shown to user
4. ✅ Staff can see the new grievance immediately in the admin dashboard

**Result:** No more error messages! Clean, professional user experience.

---

## How to Re-Enable Staff Notifications (Future)

If you want staff to receive email notifications when new grievances are submitted, follow these steps:

### Option 1: Use a Valid Gmail Account (Recommended)
1. Create or use an existing Gmail account (e.g., `liteinboard@gmail.com`)
2. Set up the Gmail API credentials in `.env` file (already configured for other emails)
3. Add the code back to `complaintsController.js`:

```javascript
// Send notification to municipal staff
try {
  await sendEmail({
    to: 'liteinboard@gmail.com', // <-- Replace with your valid email
    subject: `New Grievance Submitted - ${referenceNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #16a34a;">New Grievance Submitted</h2>
        <p><strong>Reference:</strong> ${referenceNumber}</p>
        <p><strong>From:</strong> ${complaint.contact_name} (${complaint.contact_email})</p>
        <p><strong>Phone:</strong> ${complaint.contact_phone}</p>
        <p><strong>Subject:</strong> ${complaint.title}</p>
        <p><strong>Type:</strong> ${complaint.category}</p>
        <p><strong>Department:</strong> ${department || 'Unassigned'}</p>
        <p><strong>Location:</strong> ${complaint.location}</p>
        <p><strong>Submitted:</strong> ${new Date(submittedDate).toLocaleString('en-KE')}</p>
        <hr/>
        <p><strong>Description:</strong></p>
        <p>${complaint.description.replace(/\n/g, '<br/>')}</p>
        <hr/>
        <p>Please log in to the dashboard to review and assign this grievance.</p>
      </div>
    `
  })
  console.log('✓ Notification sent to municipal staff')
} catch (emailError) {
  console.error('✗ Failed to send staff notification:', emailError.message)
  // Don't fail the entire request if email fails
}
```

### Option 2: Use System Settings (Most Professional)
1. Go to **System Settings** in admin dashboard
2. Navigate to **Email Configuration** tab
3. Add a setting for "Staff Notification Email"
4. Retrieve this email from settings in the controller:

```javascript
// Get staff email from system settings
const { data: staffEmailSetting } = await supabaseAdmin
  .from('system_settings')
  .select('value')
  .eq('key', 'email_staff_grievance_notification')
  .single()

const staffEmail = staffEmailSetting?.value

// Only send if staff email is configured
if (staffEmail) {
  await sendEmail({
    to: staffEmail,
    subject: `New Grievance Submitted - ${referenceNumber}`,
    // ... rest of email content
  })
}
```

### Option 3: Use Multiple Recipients
Send notifications to multiple staff members:

```javascript
const staffEmails = [
  'admin1@gmail.com',
  'admin2@gmail.com',
  'manager@gmail.com'
]

for (const email of staffEmails) {
  try {
    await sendEmail({
      to: email,
      subject: `New Grievance Submitted - ${referenceNumber}`,
      // ... email content
    })
  } catch (err) {
    console.error(`Failed to notify ${email}:`, err.message)
  }
}
```

---

## Testing the Fix

### Test 1: Submit a Grievance
1. Go to the Grievance page: `http://localhost:5173/grievance`
2. Fill in the form with your details
3. Submit the grievance
4. **Expected Result:** 
   - ✅ Success message shown
   - ✅ Tracking number displayed
   - ✅ Confirmation email received (check your inbox)
   - ❌ NO error messages about failed emails

### Test 2: Verify User Email
1. Check your email inbox (the email you used in the form)
2. You should receive a professional confirmation email with:
   - ✅ Tracking number (e.g., LMB-2026-1234)
   - ✅ Grievance details
   - ✅ Next steps information
   - ✅ Link to track your grievance

### Test 3: Check Admin Dashboard
1. Log in to admin dashboard
2. Go to Complaints/Grievances section
3. **Expected Result:**
   - ✅ New grievance appears in the list
   - ✅ Status shows "Submitted"
   - ✅ All details are captured correctly

---

## Files Modified
- ✅ `backend/src/controllers/complaintsController.js` - Removed failing staff notification email

## Files NOT Modified (No Changes Needed)
- `backend/src/services/emailService.js` - Email service is working fine
- `frontend/src/pages/Grievance.jsx` - Frontend is working correctly
- `backend/.env` - Email configuration is correct

---

## Summary
✅ **Problem Fixed:** Removed the failing staff notification email  
✅ **User Experience:** Clean, professional, no error messages  
✅ **Staff Access:** Can still see all grievances in admin dashboard  
✅ **Future Ready:** Easy to re-enable with valid email address  

The grievance system now works perfectly without any email errors! 🎉
