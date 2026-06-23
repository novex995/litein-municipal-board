# Board Member vs Staff Member - Category Selection Update

## What Changed

Added a clear category selection at the top of the "Add New Staff Member" form that separates Board Members from regular Staff Members.

## How It Works Now

### Step 1: Select Category
When adding a new person, the admin must first choose:

**🏛️ Board Member**
- Will appear on the public Board Leadership page
- Department is automatically set to "Board Leadership"
- Cannot be changed

**👥 Staff Member**  
- Regular municipal staff
- Can select from all available departments
- Will NOT appear on public Board Leadership page

### Step 2: Department Field Behavior

#### If "Board Member" is selected:
- Department dropdown is **disabled** (grayed out)
- Automatically shows "Board Leadership"
- Info message: "Board members are automatically assigned to 'Board Leadership'"

#### If "Staff Member" is selected:
- Department dropdown is **enabled**
- Shows all regular departments:
  - Agriculture, Livestock and Fisheries
  - Health Services
  - Water, Environment, Energy
  - ICT & E-Governance
  - Public Works, Roads and Transport
  - Public Service Management
  - Trade & Industrialization
  - Finance and Economic Planning
  - Education & Social Services
  - Lands & Housing

#### If no category selected yet:
- Department dropdown is **disabled**
- Shows message: "First select category above"

## Visual Design

The category selection uses attractive button cards:

```
┌─────────────────────┬─────────────────────┐
│   🏛️                │   👥                │
│   Board Member      │   Staff Member      │
│   Will appear on... │   Regular staff...  │
└─────────────────────┴─────────────────────┘
```

Selected button gets:
- Blue border and background (Board Member)
- Green border and background (Staff Member)  
- Drop shadow for emphasis

## Where People Appear

### Board Members (`department: "Board Leadership"`)
✅ Appear on: **Board Leadership page** (`/board-members`)
- Public-facing page
- Shows photo, name, and position
- Professional display for leadership

❌ Do NOT appear on: Staff directory or internal staff lists

### Staff Members (any other department)
✅ Appear on: **Staff Management** (admin only)
- Internal staff directory
- Admin dashboard management
- Department listings

❌ Do NOT appear on: Public Board Leadership page

## Benefits of This Update

1. **Clear Distinction**: No confusion between board members and staff
2. **Prevents Errors**: Can't accidentally add board member to wrong department
3. **User-Friendly**: Visual buttons make selection obvious
4. **Automatic Setup**: Board members auto-assigned to correct department
5. **Professional**: Public board page shows only intended leadership

## Technical Details

### Database Field
- Added `category` field to track selection ("board_member" or "staff_member")
- `department` field remains the same (stores "Board Leadership" or department name)

### Files Modified
- `frontend/src/components/admin/StaffManagement.jsx`
  - Added category selection UI
  - Added conditional department dropdown logic
  - Updated state management

### How Public Page Filters
The Board Leadership page (`BoardMembers.jsx`) filters users by:
```javascript
user.department === 'Board Leadership' && user.is_active !== false
```

So anyone with department "Board Leadership" appears on the public page.

## Usage Example

### Adding a Board Member:
1. Click "Add New Staff"
2. Click "🏛️ Board Member" button
3. Fill in: Name, Email, Phone, Position (e.g., "Chairperson")
4. Department is automatically "Board Leadership" (disabled)
5. Set System Role
6. Click "Add Staff Member"
7. ✅ Person appears on public Board Leadership page

### Adding Regular Staff:
1. Click "Add New Staff"
2. Click "👥 Staff Member" button
3. Fill in: Name, Email, Phone, Employee ID
4. Select Department from dropdown (e.g., "Health Services")
5. Enter Position (e.g., "Senior Health Officer")
6. Set System Role
7. Click "Add Staff Member"
8. ✅ Person appears in Staff Management only

## Summary

This update makes it crystal clear whether someone is a board member (public-facing) or staff member (internal). The UI guides the admin through the correct process, preventing mistakes and ensuring board members appear on the right page.

**Result:** Professional board leadership page + organized staff management! 🎉
