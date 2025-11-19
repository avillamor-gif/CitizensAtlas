/**
 * Permission Debug Component
 * 
 * Add this to your admin dashboard to see live permission status
 * Import and use: <PermissionDebugPanel currentUser={currentUser} />
 */

import React from 'react';
import { hasPermission } from '@/hooks/useRolePermissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role?: 'super-admin' | 'admin' | 'contributor';
  name?: string;
}

interface PermissionDebugPanelProps {
  currentUser?: User;
}

const ALL_FEATURES = [
  'View/Edit Projects',
  'View/Edit News',
  'View/Edit Publications',
  'View/Edit Videos',
  'View Analytics',
  'Manage Categories/Types',
  'Batch Upload',
  'Pending Approvals',
  'Chart Visibility Toggle',
  'Team Management',
  'Role Management',
] as const;

export function PermissionDebugPanel({ currentUser }: PermissionDebugPanelProps) {
  const [hasCustomPerms, setHasCustomPerms] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    const savedPerms = localStorage.getItem('role_permissions');
    setHasCustomPerms(!!savedPerms);
  }, [refreshKey]);

  const clearCustomPermissions = () => {
    if (confirm('This will reset permissions to defaults. Continue?')) {
      localStorage.removeItem('role_permissions');
      window.dispatchEvent(new Event('role-permissions-updated'));
      setRefreshKey(prev => prev + 1);
      window.location.reload();
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'super-admin': return 'bg-purple-500 hover:bg-purple-600';
      case 'admin': return 'bg-blue-500 hover:bg-blue-600';
      case 'contributor': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card className="border-yellow-500 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          Permission Debug Panel
        </CardTitle>
        <CardDescription>
          Live permission status for troubleshooting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current User Info */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            Current User
          </h4>
          <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-mono">{currentUser?.email || 'Not logged in'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <Badge className={getRoleBadgeColor(currentUser?.role)}>
                {currentUser?.role || 'none'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono text-xs">{currentUser?.id || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Permission Source */}
        <div className="space-y-2">
          <h4 className="font-semibold">Permission Source</h4>
          <div className="bg-muted p-3 rounded-lg">
            {hasCustomPerms ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Using Custom Permissions</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Permissions were modified via Role Management page
                </p>
                <Button
                  onClick={clearCustomPermissions}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Using Default Permissions</span>
              </div>
            )}
          </div>
        </div>

        {/* Feature Access List */}
        <div className="space-y-2">
          <h4 className="font-semibold">Feature Access ({currentUser?.role})</h4>
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            {ALL_FEATURES.map((feature) => {
              const access = hasPermission(currentUser?.role, feature);
              return (
                <div
                  key={feature}
                  className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm"
                >
                  <span>{feature}</span>
                  {access ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Fixes */}
        <div className="space-y-2 pt-2 border-t">
          <h4 className="font-semibold text-sm">Quick Fixes</h4>
          <div className="text-xs space-y-2 text-muted-foreground">
            <div>
              <strong>Issue: Wrong role in database</strong>
              <br />
              Run in Supabase SQL: <code className="bg-muted px-1 rounded">UPDATE profiles SET role = 'super-admin' WHERE email = 'your@email.com';</code>
            </div>
            <div>
              <strong>Issue: Custom permissions restricting access</strong>
              <br />
              Click "Reset to Defaults" button above
            </div>
            <div>
              <strong>Issue: Role not loading</strong>
              <br />
              Check browser console for errors, verify profiles table exists
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
