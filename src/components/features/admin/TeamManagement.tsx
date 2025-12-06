'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { InviteMemberDialog } from '@/components/auth/InviteMemberDialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  last_sign_in_at: string | null;
}

interface PendingInvite {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    role?: string;
  };
  invited_at: string;
}

const TeamManagement: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const supabase = createClient();
  const { user: currentUser } = useAuth();
  
  // Check if current user is super-admin
  const isSuperAdmin = currentUser?.role === 'super-admin';

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching team data from /api/admin/users...');

      // Fetch users and pending invites from admin API
      const response = await fetch('/api/admin/users');
      
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response not OK:', errorText);
        throw new Error(`Failed to load team data: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      
      console.log('📦 Response data:', data);

      // Map confirmed users to TeamMember format
      console.log('🔄 Mapping confirmed users...');
      const confirmedMembers = await Promise.all(
        (data.confirmedUsers || []).map(async (user: any) => {
          console.log('👤 Processing user:', user.email);
          // Try to get profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.warn('⚠️ Profile fetch error for', user.email, ':', profileError);
          }

          return {
            id: user.id,
            email: user.email,
            full_name: (profile as any)?.full_name || user.user_metadata?.full_name || '',
            role: (profile as any)?.role || user.user_metadata?.role || 'contributor',
            avatar_url: (profile as any)?.avatar_url || '',
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
          };
        })
      );

      console.log('✅ Team data loaded:', {
        confirmedMembers: confirmedMembers.length,
        pendingInvites: data.pendingInvites?.length || 0,
        pendingInvitesData: data.pendingInvites,
      });

      setMembers(confirmedMembers);
      setPendingInvites(data.pendingInvites || []);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('❌ Error loading team:', err);
      setError(err.message || 'Failed to load team members');
      // Don't leave in perpetual loading state
      setMembers([]);
      setPendingInvites([]);
    } finally {
      console.log('✅ Loading complete, setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const handleInviteSuccess = () => {
    // Refresh the team members list
    loadTeamMembers();
  };

  const handleDeleteMember = async (memberId: string, isPending: boolean = false) => {
    const confirmMessage = isPending
      ? 'Are you sure you want to cancel this invitation?'
      : 'Are you sure you want to remove this team member?';

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      console.log('🗑️ Deleting user:', memberId);
      
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: memberId }),
      });

      const data = await response.json();
      
      console.log('Delete response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      console.log('✅ User deleted, refreshing list...');
      
      // Refresh the list
      await loadTeamMembers();
      
      console.log('✅ List refreshed');
    } catch (err: any) {
      console.error('❌ Delete error:', err);
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const handleResendInvite = async (userId: string, email: string) => {
    try {
      const response = await fetch('/api/admin/resend-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If user already registered, suggest deleting and re-inviting
        if (data.error?.includes('already been registered')) {
          if (confirm('This user has already been registered. Would you like to delete and re-invite them?')) {
            await handleDeleteMember(userId, true);
            // Don't auto-invite, let admin do it manually
            alert('User deleted. You can now send a fresh invitation.');
          }
          return;
        }
        throw new Error(data.error || 'Failed to resend invitation');
      }

      alert('Invitation resent successfully!');
      loadTeamMembers(); // Refresh the list
    } catch (err: any) {
      alert(`Failed to resend: ${err.message}`);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string, memberEmail: string) => {
    if (!isSuperAdmin) {
      alert('Only super admins can change user roles');
      return;
    }

    if (userId === currentUser?.id) {
      alert('You cannot change your own role');
      return;
    }

    if (!confirm(`Are you sure you want to change ${memberEmail}'s role to ${newRole}?`)) {
      return;
    }

    try {
      setChangingRole(userId);

      // Update role in profiles table
      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase typing issue with profiles table
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      alert(`Role updated successfully to ${newRole}`);
      
      // Refresh the list to show updated role
      await loadTeamMembers();
    } catch (err: any) {
      console.error('❌ Role change error:', err);
      alert(`Failed to change role: ${err.message}`);
    } finally {
      setChangingRole(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contributor':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Invite and manage team members ({members.length} active, {pendingInvites.length} pending)
          </p>
        </div>
        <InviteMemberDialog onSuccess={handleInviteSuccess} />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d234f]"></div>
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
          <p className="text-sm text-gray-600 mb-6">
            Get started by inviting your first team member
          </p>
          <InviteMemberDialog
            trigger={<Button>Invite Your First Member</Button>}
            onSuccess={handleInviteSuccess}
          />
        </div>
      ) : (
        <>
          {/* Pending Invitations Section */}
          {pendingInvites.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Pending Invitations ({pendingInvites.length})
              </h2>
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 overflow-hidden">
                <table className="min-w-full divide-y divide-yellow-200">
                  <thead className="bg-yellow-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Invited
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-yellow-50 divide-y divide-yellow-200">
                    {pendingInvites.map((invite) => (
                      <tr key={invite.id} className="hover:bg-yellow-100">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-yellow-200 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {invite.user_metadata?.full_name || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-600">{invite.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                              invite.user_metadata?.role || 'contributor'
                            )}`}
                          >
                            {invite.user_metadata?.role || 'contributor'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(invite.invited_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                            Waiting for confirmation
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <button
                            onClick={() => handleDeleteMember(invite.id, true)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete this pending invitation"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Active Members Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Active Members ({members.length})
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Sign In
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar_url} alt={member.full_name} />
                            <AvatarFallback className="bg-[#0d234f] text-white font-medium text-sm">
                              {(member.full_name || member.email || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.full_name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isSuperAdmin && member.id !== currentUser?.id ? (
                          <Select
                            value={member.role}
                            onValueChange={(value) => handleRoleChange(member.id, value, member.email)}
                            disabled={changingRole === member.id}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="contributor">contributor</SelectItem>
                              <SelectItem value="admin">admin</SelectItem>
                              <SelectItem value="super-admin">super-admin</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                              member.role
                            )}`}
                          >
                            {member.role || 'contributor'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(member.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(member.last_sign_in_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {member.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeamManagement;
