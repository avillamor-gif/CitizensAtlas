import { useState, useEffect } from 'react'

interface Permission {
  feature: string
  description: string
  contributor: boolean
  admin: boolean
  superAdmin: boolean
}

interface RolePermissions {
  'View/Edit Projects': boolean
  'View/Edit News': boolean
  'View/Edit Publications': boolean
  'View/Edit Videos': boolean
  'View Analytics': boolean
  'Manage Categories/Types': boolean
  'Batch Upload': boolean
  'Pending Approvals': boolean
  'Chart Visibility Toggle': boolean
  'Team Management': boolean
  'Role Management': boolean
}

const DEFAULT_PERMISSIONS: Permission[] = [
  {
    feature: 'View/Edit Projects',
    description: 'Access to view, create, and edit project entries',
    contributor: true,
    admin: true,
    superAdmin: true,
  },
  {
    feature: 'View/Edit News',
    description: 'Manage news updates and articles',
    contributor: true,
    admin: true,
    superAdmin: true,
  },
  {
    feature: 'View/Edit Publications',
    description: 'Manage publication documents and resources',
    contributor: true,
    admin: true,
    superAdmin: true,
  },
  {
    feature: 'View/Edit Videos',
    description: 'Manage video content and categories',
    contributor: true,
    admin: true,
    superAdmin: true,
  },
  {
    feature: 'View Analytics',
    description: 'Access to analytics dashboard and insights',
    contributor: true,
    admin: true,
    superAdmin: true,
  },
  {
    feature: 'Manage Categories/Types',
    description: 'Create and manage categories for news, publications, and videos',
    contributor: true,
    admin: true,
    superAdmin: true,
  },
  {
    feature: 'Batch Upload',
    description: 'Upload multiple projects via CSV file',
    contributor: false,
    admin: true,
    superAdmin: true,
  },
  {
    feature: 'Pending Approvals',
    description: 'Review and approve draft submissions',
    contributor: false,
    admin: true,
    superAdmin: true,
  },
  {
    feature: 'Chart Visibility Toggle',
    description: 'Control which analytics charts appear on the public dashboard',
    contributor: false,
    admin: true,
    superAdmin: true,
  },
  {
    feature: 'Team Management',
    description: 'Manage user accounts and assign roles',
    contributor: false,
    admin: false,
    superAdmin: true,
  },
  {
    feature: 'Role Management',
    description: 'View and understand role permission structure',
    contributor: false,
    admin: false,
    superAdmin: true,
  },
]

export function useRolePermissions(userRole?: 'super-admin' | 'admin' | 'contributor'): RolePermissions {
  const [permissions, setPermissions] = useState<RolePermissions>({
    'View/Edit Projects': false,
    'View/Edit News': false,
    'View/Edit Publications': false,
    'View/Edit Videos': false,
    'View Analytics': false,
    'Manage Categories/Types': false,
    'Batch Upload': false,
    'Pending Approvals': false,
    'Chart Visibility Toggle': false,
    'Team Management': false,
    'Role Management': false,
  })

  useEffect(() => {
    if (!userRole) {
      return
    }

    // Check for custom permissions in localStorage
    const customPermsStr = typeof window !== 'undefined' ? localStorage.getItem('custom_permissions') : null
    let permissionsSource = DEFAULT_PERMISSIONS
    
    if (customPermsStr) {
      try {
        const customPerms = JSON.parse(customPermsStr)
        // Convert custom format to DEFAULT_PERMISSIONS format
        permissionsSource = DEFAULT_PERMISSIONS.map(perm => ({
          ...perm,
          contributor: customPerms.contributor?.includes(perm.feature) ?? perm.contributor,
          admin: customPerms.admin?.includes(perm.feature) ?? perm.admin,
          superAdmin: customPerms.superAdmin?.includes(perm.feature) ?? perm.superAdmin,
        }))
        console.log('📝 Using custom permissions from localStorage')
      } catch (e) {
        console.error('Failed to parse custom permissions, using defaults', e)
      }
    }

    const roleKey = userRole === 'super-admin' ? 'superAdmin' : userRole
    const userPermissions: RolePermissions = {} as RolePermissions

    permissionsSource.forEach((permission) => {
      userPermissions[permission.feature as keyof RolePermissions] = permission[roleKey as keyof Permission] as boolean
    })

    setPermissions(userPermissions)
  }, [userRole])

  return permissions
}

export function hasPermission(
  userRole: 'super-admin' | 'admin' | 'contributor' | undefined,
  feature: keyof RolePermissions
): boolean {
  if (!userRole) {
    console.log('[hasPermission] No user role provided for feature:', feature);
    return false;
  }

  // Check for custom permissions in localStorage
  const customPermsStr = typeof window !== 'undefined' ? localStorage.getItem('custom_permissions') : null
  let permissionsSource = DEFAULT_PERMISSIONS
  
  if (customPermsStr) {
    try {
      const customPerms = JSON.parse(customPermsStr)
      // Convert custom format to DEFAULT_PERMISSIONS format
      permissionsSource = DEFAULT_PERMISSIONS.map(perm => ({
        ...perm,
        contributor: customPerms.contributor?.includes(perm.feature) ?? perm.contributor,
        admin: customPerms.admin?.includes(perm.feature) ?? perm.admin,
        superAdmin: customPerms.superAdmin?.includes(perm.feature) ?? perm.superAdmin,
      }))
    } catch (e) {
      console.error('Failed to parse custom permissions, using defaults', e)
    }
  }

  const permission = permissionsSource.find(p => p.feature === feature)
  if (!permission) {
    console.warn('[hasPermission] Permission not found for feature:', feature);
    return false;
  }

  // Map role to permission key
  const roleKey = userRole === 'super-admin' ? 'superAdmin' : userRole
  const hasAccess = permission[roleKey as keyof Permission] as boolean
  
  console.log(`[hasPermission] ${feature} for ${userRole} (${roleKey}):`, hasAccess);
  
  return hasAccess;
}
