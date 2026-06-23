/**
 * Role-Based Permission Matrix
 * Defines what each role can access and do
 */

export const PERMISSIONS = {
  super_admin: {
    complaints: 'FULL',
    licenses: 'FULL',
    finance: 'FULL',
    projects: 'FULL',
    reports: 'FULL',
    staff: 'FULL',
    system: 'FULL'
  },
  municipal_manager: {
    complaints: 'VIEW_ALL',
    licenses: 'VIEW_ALL',
    finance: 'VIEW_ALL',
    projects: 'VIEW_ALL',
    reports: 'FULL',
    staff: 'VIEW_ALL',
    system: 'VIEW'
  },
  finance_officer: {
    complaints: 'NO',
    licenses: 'VIEW',
    finance: 'FULL',
    projects: 'VIEW',
    reports: 'FINANCE_ONLY',
    staff: 'NO',
    system: 'NO'
  },
  license_officer: {
    complaints: 'NO',
    licenses: 'FULL',
    finance: 'PAYMENT_STATUS',
    projects: 'NO',
    reports: 'LICENSE_ONLY',
    staff: 'NO',
    system: 'NO'
  },
  grievance_officer: {
    complaints: 'FULL',
    licenses: 'NO',
    finance: 'NO',
    projects: 'NO',
    reports: 'COMPLAINTS_ONLY',
    staff: 'NO',
    system: 'NO'
  },
  ict_officer: {
    complaints: 'VIEW',
    licenses: 'VIEW',
    finance: 'VIEW',
    projects: 'VIEW',
    reports: 'SYSTEM_ONLY',
    staff: 'VIEW',
    system: 'FULL'
  },
  media_officer: {
    complaints: 'NO',
    licenses: 'NO',
    finance: 'NO',
    projects: 'VIEW',
    reports: 'MEDIA_ONLY',
    staff: 'NO',
    system: 'NO'
  },
  citizen_service_officer: {
    complaints: 'VIEW',
    licenses: 'VIEW',
    finance: 'PAYMENT_STATUS',
    projects: 'NO',
    reports: 'SERVICE_ONLY',
    staff: 'NO',
    system: 'NO'
  },
  department_head: {
    complaints: 'VIEW',
    licenses: 'NO',
    finance: 'BUDGET_VIEW',
    projects: 'FULL',
    reports: 'DEPARTMENT_ONLY',
    staff: 'VIEW_DEPARTMENT',
    system: 'NO'
  },
  municipal_staff: {
    complaints: 'VIEW_ASSIGNED',
    licenses: 'NO',
    finance: 'NO',
    projects: 'VIEW_ASSIGNED',
    reports: 'NO',
    staff: 'NO',
    system: 'NO'
  }
}

/**
 * Check if a user has permission for an action
 */
export const hasPermission = (userRole, module, action = 'VIEW') => {
  const rolePermissions = PERMISSIONS[userRole]
  if (!rolePermissions) return false

  const permission = rolePermissions[module]
  if (!permission || permission === 'NO') return false
  if (permission === 'FULL') return true

  return permission.includes(action)
}

/**
 * Get accessible modules for a role
 */
export const getAccessibleModules = (userRole) => {
  const rolePermissions = PERMISSIONS[userRole]
  return Object.entries(rolePermissions)
    .filter(([_, permission]) => permission !== 'NO')
    .map(([module, _]) => module)
}
