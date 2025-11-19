'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Handle the auth tokens from URL and check session
  useEffect(() => {
    const handleAuthTokens = async () => {
      try {
        // Extract tokens from URL hash if present
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const tokenType = hashParams.get('type');
        
        console.log('URL hash params:', {
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          tokenType,
          fullHash: window.location.hash
        });
        
        if (accessToken && tokenType === 'recovery') {
          console.log('Setting session from recovery tokens...');
          // For recovery tokens, we need to set the session differently
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '', // refresh_token might be empty for recovery
          });
          
          if (error) {
            console.error('Error setting session:', error);
            setError('Invalid or expired password reset link. Please request a new one.');
            return;
          }
          
          if (data.session) {
            console.log('Recovery session established successfully');
            setSessionReady(true);
            // Clear the hash from URL for security
            window.history.replaceState(null, '', window.location.pathname);
          } else {
            console.error('No session returned from setSession');
            setError('Failed to establish recovery session. Please request a new link.');
          }
        } else if (accessToken) {
          console.log('Found access token but not recovery type, attempting session setup...');
          // Try with just access token for other token types
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (error) {
            console.error('Error setting session with access token:', error);
            setError('Invalid or expired password reset link. Please request a new one.');
            return;
          }
          
          if (data.session) {
            console.log('Session established with access token');
            setSessionReady(true);
            window.history.replaceState(null, '', window.location.pathname);
          }
        } else {
          console.log('No access token found, checking for existing session...');
          // Check if we already have a valid session
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('Existing session found');
            setSessionReady(true);
          } else {
            console.log('No tokens or session found');
            setError('Invalid or expired password reset link. Please request a new one.');
          }
        }
      } catch (err) {
        console.error('Error handling auth tokens:', err);
        setError('An error occurred while processing the reset link. Please try again.');
      }
    };

    handleAuthTokens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Password Reset Successful</CardTitle>
          <CardDescription>
            Your password has been updated successfully. Redirecting to login...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!sessionReady) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Processing Reset Link</CardTitle>
          <CardDescription>
            Please wait while we verify your password reset link...
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          ) : (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Verifying...</p>
            </div>
          )}
        </CardContent>
        {error && (
          <CardFooter>
            <a href="/auth/forgot-password" className="text-sm text-[#0d234f] hover:underline mx-auto">
              Request a new reset link
            </a>
          </CardFooter>
        )}
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Set New Password</CardTitle>
        <CardDescription>
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
          <a href="/auth/login" className="text-sm text-[#0d234f] hover:underline">
            Back to sign in
          </a>
        </CardFooter>
      </form>
    </Card>
  );
}
