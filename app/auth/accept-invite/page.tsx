'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();

  // Handle session from URL hash - store tokens immediately
  useEffect(() => {
    const initializeSession = async () => {
      if (typeof window === 'undefined') return;
      
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      
      // Check for errors first
      const hashError = hashParams.get('error');
      const errorCode = hashParams.get('error_code');
      const errorDescription = hashParams.get('error_description');
      
      if (hashError) {
        if (errorCode === 'otp_expired') {
          setError('This invitation link has expired. Please request a new invitation.');
        } else {
          setError(errorDescription || 'Invalid invitation link');
        }
        setTokenError(true);
        setSessionReady(true);
        return;
      }

      if (accessToken && refreshToken) {
        console.log('🔑 Storing tokens and setting session...');
        
        // Parse user ID from JWT token (it's in the "sub" claim)
        try {
          const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
          const extractedUserId = tokenPayload.sub;
          const extractedEmail = tokenPayload.email;
          console.log('📦 Extracted from token - User ID:', extractedUserId);
          console.log('📦 Extracted from token - Email:', extractedEmail);
          setUserId(extractedUserId);
          setUserEmail(extractedEmail);
        } catch (e) {
          console.error('❌ Failed to parse token:', e);
        }
        
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        if (error) {
          console.error('❌ Error setting session:', error);
        } else {
          console.log('✅ Session set successfully');
          console.log('� Session data:', data);
        }
      }
      setSessionReady(true);
    };

    initializeSession();
  }, [supabase]);

  useEffect(() => {
    // Check if we have a valid token
    const checkToken = async () => {
      // Supabase can send either 'token_hash' or 'token' parameter
      // Or it might be in the URL fragment (hash) after #
      let tokenHash = searchParams.get('token_hash');
      let token = searchParams.get('token');
      let type = searchParams.get('type');
      let errorMessage = null;

      // If not in search params, check URL hash fragment
      if (!tokenHash && !token && typeof window !== 'undefined') {
        const hash = window.location.hash.substring(1); // Remove the #
        const hashParams = new URLSearchParams(hash);
        const allHashParams = Object.fromEntries(hashParams.entries());
        
        console.log('Full URL:', window.location.href);
        console.log('Hash params:', allHashParams);
        
        // Check for error in hash
        const hashError = hashParams.get('error');
        const errorCode = hashParams.get('error_code');
        const errorDescription = hashParams.get('error_description');
        
        if (hashError) {
          if (errorCode === 'otp_expired') {
            errorMessage = 'This invitation link has expired. Please request a new invitation.';
          } else {
            errorMessage = errorDescription || 'Invalid invitation link';
          }
        }
        
        tokenHash = hashParams.get('token_hash') || hashParams.get('access_token');
        token = hashParams.get('token');
        type = hashParams.get('type') || 'invite';
      }

      // Need either token_hash, token, or access_token
      if (!tokenHash && !token || errorMessage) {
        setTokenError(true);
        if (errorMessage) {
          setError(errorMessage);
        }
      }
    };

    checkToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Starting password update process...');
      
      // Check if we have user info from the session initialization
      if (!userId) {
        console.error('❌ No user ID available');
        throw new Error('Session not properly initialized. Please try clicking the invitation link again.');
      }
      
      console.log('✅ Using stored user info:', userEmail);
      console.log('🔐 Calling set-password API...');
      console.log('📦 Request payload:', { userId, passwordLength: password.length });
      const startTime = Date.now();
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      try {
        const response = await fetch('/api/auth/set-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            password,
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        const duration = Date.now() - startTime;
        console.log(`⏱️ Password update took ${duration}ms`);
        console.log('📡 Response status:', response.status);
        
        const result = await response.json();
        console.log('📦 Response data:', result);
        
        if (!response.ok) {
          console.error('❌ Password update error:', result.error);
          throw new Error(result.error || 'Failed to set password');
        }

        console.log('✅ Password updated successfully');
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.error('❌ API request timed out after 15 seconds');
          throw new Error('Password update timed out. Please try again.');
        }
        throw fetchError;
      }
      
      // Wait for password to be saved and auth state to propagate
      console.log('⏳ Waiting for auth state to propagate...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🔄 Redirecting to dashboard...');
      
      // Redirect to admin dashboard
      router.push('/?admin=true');
    } catch (err: any) {
      console.error('Accept invite error:', err);
      setError(err.message || 'Failed to accept invitation');
    } finally {
      setLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Invalid Invitation</CardTitle>
            <CardDescription className="text-center">
              {error || 'This invitation link is invalid or has expired.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {error?.includes('expired') && (
              <p className="text-sm text-gray-600 text-center">
                Please contact your administrator to send you a new invitation.
              </p>
            )}
            <Button
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Welcome to the Team!</CardTitle>
          <CardDescription className="text-center">
            Set your password to complete your account setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
              />
              <p className="text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
