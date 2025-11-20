'use client'

import React, { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Camera, Loader2, User, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { createClient } from '@/lib/supabase/client'
import * as DataService from '@/lib/services/data-service'

const supabase = createClient()

interface AccountProfileProps {
  currentUser?: {
    id: string
    email: string
    role: string
    name?: string
    full_name?: string
    avatar_url?: string
  }
}

export default function AccountProfile({ currentUser }: AccountProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: currentUser?.full_name || currentUser?.name || '',
    email: currentUser?.email || '',
    avatar_url: currentUser?.avatar_url || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [previewUrl, setPreviewUrl] = useState(formData.avatar_url)

  // Update formData when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      console.log('[AccountProfile] Updating from currentUser:', {
        avatar_url: currentUser.avatar_url,
        full_name: currentUser.full_name,
      })
      
      setFormData({
        full_name: currentUser.full_name || currentUser.name || '',
        email: currentUser.email || '',
        avatar_url: currentUser.avatar_url || '',
      })
      setPreviewUrl(currentUser.avatar_url || '')
    }
  }, [currentUser])

  // Force refresh profile from database on mount to get latest avatar
  React.useEffect(() => {
    const refreshProfile = async () => {
      if (!currentUser?.id) return
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
        
        if (profile && !error) {
          console.log('[AccountProfile] Fresh profile from DB:', profile)
          // Update form data with fresh profile
          setFormData({
            full_name: (profile as any).full_name || '',
            email: (profile as any).email || '',
            avatar_url: (profile as any).avatar_url || '',
          })
          setPreviewUrl((profile as any).avatar_url || '')
        }
      } catch (error) {
        console.error('[AccountProfile] Error fetching fresh profile:', error)
      }
    }
    
    refreshProfile()
  }, []) // Only run once on mount

  const getInitials = () => {
    const name = formData.full_name || formData.email
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Invalid file type. Please upload an image file.')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File too large. Please upload an image smaller than 2MB.')
      return
    }

    try {
      setIsUploading(true)

      // Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${currentUser?.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath)

      setPreviewUrl(publicUrl)
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))

      alert('Avatar uploaded successfully! Click Save Changes to update your profile.')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser?.id) return

    try {
      setIsSaving(true)

      // Update profile using data service
      await DataService.updateUserProfile(currentUser.id, {
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
      })

      alert('Profile updated successfully!')
      
      // Reload the page to refresh the auth context and update all avatars
      window.location.reload()
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields.')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirmation do not match.')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long.')
      return
    }
    
    if (passwordData.newPassword === passwordData.currentPassword) {
      alert('New password must be different from current password.')
      return
    }

    try {
      setIsChangingPassword(true)

      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      alert('Password changed successfully!')
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      
      // Close the password section
      setShowPasswordSection(false)
    } catch (error: any) {
      console.error('Error changing password:', error)
      alert(error.message || 'Failed to change password. Please try again.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Profile</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your account settings and profile information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="h-32 w-32">
                  <AvatarImage 
                    src={previewUrl || undefined} 
                    alt={formData.full_name}
                    onError={(e) => {
                      console.error('[AccountProfile] Avatar failed to load:', previewUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('[AccountProfile] Avatar loaded successfully:', previewUrl);
                    }}
                  />
                  <AvatarFallback className="text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  ) : (
                    <Camera className="h-8 w-8 text-white" />
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Click on the avatar to upload a new photo
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or GIF (max. 2MB)
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={currentUser?.role || 'contributor'}
                  disabled
                  className="bg-muted capitalize"
                />
                <p className="text-xs text-muted-foreground">
                  Contact an administrator to change your role
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    full_name: currentUser?.full_name || currentUser?.name || '',
                    email: currentUser?.email || '',
                    avatar_url: currentUser?.avatar_url || '',
                  })
                  setPreviewUrl(currentUser?.avatar_url || '')
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Settings Card with Password Change */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your password and account security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Collapsible open={showPasswordSection} onOpenChange={setShowPasswordSection}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your password to keep your account secure
                  </p>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${showPasswordSection ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <form onSubmit={handlePasswordChange} className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password (min. 6 characters)"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Re-enter new password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      })
                      setShowPasswordSection(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </div>
              </form>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  )
}
