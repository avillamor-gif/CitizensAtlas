'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Check, X, Info, Save, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Permission {
  feature: string
  description: string
  contributor: boolean
  admin: boolean
  superAdmin: boolean
}

const RoleManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)

  // Initialize from constants
  useEffect(() => {
    // Default permissions structure
    const defaultPermissions = {
      contributor: ['View/Edit Projects', 'View/Edit News', 'View/Edit Publications', 'View/Edit Videos', 'View Analytics', 'Manage Categories/Types'],
      admin: ['View/Edit Projects', 'View/Edit News', 'View/Edit Publications', 'View/Edit Videos', 'View Analytics', 'Manage Categories/Types', 'Batch Upload', 'Pending Approvals', 'Chart Visibility Toggle'],
      superAdmin: ['View/Edit Projects', 'View/Edit News', 'View/Edit Publications', 'View/Edit Videos', 'View Analytics', 'Manage Categories/Types', 'Batch Upload', 'Pending Approvals', 'Chart Visibility Toggle', 'Team Management', 'Role Management'],
    }
    
    // Load custom permissions from localStorage if they exist
    const customPermsStr = localStorage.getItem('custom_permissions')
    const permsToUse = customPermsStr ? JSON.parse(customPermsStr) : defaultPermissions

    const initialPermissions: Permission[] = [
      { feature: 'View/Edit Projects', description: 'Access to view, create, and edit project entries', contributor: permsToUse.contributor.includes('View/Edit Projects'), admin: permsToUse.admin.includes('View/Edit Projects'), superAdmin: permsToUse.superAdmin.includes('View/Edit Projects') },
      { feature: 'View/Edit News', description: 'Manage news updates and articles', contributor: permsToUse.contributor.includes('View/Edit News'), admin: permsToUse.admin.includes('View/Edit News'), superAdmin: permsToUse.superAdmin.includes('View/Edit News') },
      { feature: 'View/Edit Publications', description: 'Manage publication documents and resources', contributor: permsToUse.contributor.includes('View/Edit Publications'), admin: permsToUse.admin.includes('View/Edit Publications'), superAdmin: permsToUse.superAdmin.includes('View/Edit Publications') },
      { feature: 'View/Edit Videos', description: 'Manage video content and categories', contributor: permsToUse.contributor.includes('View/Edit Videos'), admin: permsToUse.admin.includes('View/Edit Videos'), superAdmin: permsToUse.superAdmin.includes('View/Edit Videos') },
      { feature: 'View Analytics', description: 'Access to analytics dashboard and insights', contributor: permsToUse.contributor.includes('View Analytics'), admin: permsToUse.admin.includes('View Analytics'), superAdmin: permsToUse.superAdmin.includes('View Analytics') },
      { feature: 'Manage Categories/Types', description: 'Create and manage categories for news, publications, and videos', contributor: permsToUse.contributor.includes('Manage Categories/Types'), admin: permsToUse.admin.includes('Manage Categories/Types'), superAdmin: permsToUse.superAdmin.includes('Manage Categories/Types') },
      { feature: 'Batch Upload', description: 'Upload multiple projects via CSV file', contributor: permsToUse.contributor.includes('Batch Upload'), admin: permsToUse.admin.includes('Batch Upload'), superAdmin: permsToUse.superAdmin.includes('Batch Upload') },
      { feature: 'Pending Approvals', description: 'Review and approve draft submissions', contributor: permsToUse.contributor.includes('Pending Approvals'), admin: permsToUse.admin.includes('Pending Approvals'), superAdmin: permsToUse.superAdmin.includes('Pending Approvals') },
      { feature: 'Chart Visibility Toggle', description: 'Control which analytics charts appear on the public dashboard', contributor: permsToUse.contributor.includes('Chart Visibility Toggle'), admin: permsToUse.admin.includes('Chart Visibility Toggle'), superAdmin: permsToUse.superAdmin.includes('Chart Visibility Toggle') },
      { feature: 'Team Management', description: 'Manage user accounts and assign roles', contributor: permsToUse.contributor.includes('Team Management'), admin: permsToUse.admin.includes('Team Management'), superAdmin: permsToUse.superAdmin.includes('Team Management') },
      { feature: 'Role Management', description: 'View and edit role permission structure', contributor: permsToUse.contributor.includes('Role Management'), admin: permsToUse.admin.includes('Role Management'), superAdmin: permsToUse.superAdmin.includes('Role Management') },
    ]
    setPermissions(initialPermissions)
  }, [])

  const togglePermission = (index: number, role: 'contributor' | 'admin' | 'superAdmin') => {
    const updated = [...permissions]
    updated[index] = { ...updated[index], [role]: !updated[index][role] }
    setPermissions(updated)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Convert permissions array back to the format expected by constants
      const updatedPermissions = {
        contributor: permissions.filter(p => p.contributor).map(p => p.feature),
        admin: permissions.filter(p => p.admin).map(p => p.feature),
        superAdmin: permissions.filter(p => p.superAdmin).map(p => p.feature),
      }

      // Save to localStorage for now (you can replace this with API call)
      localStorage.setItem('custom_permissions', JSON.stringify(updatedPermissions))
      
      console.log('✅ Permissions saved:', updatedPermissions)
      alert('✅ Permissions saved successfully! Refresh the page to apply changes.')
      setHasChanges(false)
    } catch (error) {
      console.error('Error saving permissions:', error)
      alert('❌ Failed to save permissions')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('Reset all permissions to defaults?')) {
      localStorage.removeItem('custom_permissions')
      window.location.reload()
    }
  }

  const PermissionToggle: React.FC<{ hasPermission: boolean; onClick: () => void; disabled?: boolean }> = ({ hasPermission, onClick, disabled }) => (
    <div 
      className={`flex items-center justify-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        hasPermission ? 'bg-green-600' : 'bg-gray-300'
      } ${disabled ? 'opacity-50' : 'hover:opacity-80'}`}>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            hasPermission ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark-blue flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Role Management
          </h1>
          <p className="text-gray-600 mt-2">Edit the permission structure for different user roles</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              hasChanges
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {hasChanges && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900">Unsaved Changes</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  You have unsaved permission changes. Click "Save Changes" to apply them.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900">How to Edit Permissions</h3>
              <p className="text-sm text-blue-800 mt-1">
                Click on the toggle switches to enable/disable permissions for each role.
                Super Admin always has all permissions enabled.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions Matrix</CardTitle>
          <CardDescription>Toggle switches to enable/disable features for each role</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Feature</TableHead>
                <TableHead className="text-center">Contributor</TableHead>
                <TableHead className="text-center">Admin</TableHead>
                <TableHead className="text-center">Super Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((perm, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{perm.feature}</div>
                      <div className="text-xs text-gray-500">{perm.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PermissionToggle 
                      hasPermission={perm.contributor} 
                      onClick={() => togglePermission(idx, 'contributor')}
                    />
                  </TableCell>
                  <TableCell>
                    <PermissionToggle 
                      hasPermission={perm.admin} 
                      onClick={() => togglePermission(idx, 'admin')}
                    />
                  </TableCell>
                  <TableCell>
                    <PermissionToggle 
                      hasPermission={true} 
                      onClick={() => {}}
                      disabled={true}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default RoleManagement
