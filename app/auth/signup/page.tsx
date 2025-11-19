import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Invitation Only</CardTitle>
          <CardDescription className="text-center">
            This application uses an invitation-based system
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="py-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              To access this application, you need to receive an invitation from an administrator.
            </p>
            <p className="text-sm text-gray-600">
              If you've already received an invitation, please check your email and click the invitation link.
            </p>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-3">
              Already have an account?
            </p>
            <Link href="/auth/login">
              <Button className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
