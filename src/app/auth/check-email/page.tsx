'use client';

import { Button } from '@/components/auth/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSearchParams } from 'next/navigation';

export default function CheckEmail() {
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const supabase = createClientComponentClient();

  const handleResendEmail = async () => {
    if (!email) {
      alert('No email address found. Please try signing up again.');
      return;
    }

    try {
      setIsResending(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
      
      alert('Verification email resent successfully!');
    } catch (error) {
      console.error('Error resending verification email:', error);
      alert('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background with image and gradient overlay */}
      <div className="absolute inset-0">
        <Image 
          src="/assets/bg/canna.jpg" 
          alt="" 
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 via-primary/40 to-primary/20" />
      </div>

      {/* Main content */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto w-full max-w-md space-y-8 rounded-lg bg-white/80 p-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-32 h-32">
              <Image 
                src="/assets/logo/dabble-logo.jpg" 
                alt="Dabble Logo" 
                width={128}
                height={128}
                className="h-32 w-auto rounded-md"
              />
            </div>
          </div>

          {/* Header section */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight primary-font text-primary">
              Check your email<span className="text-primary">.</span>
            </h1>
            <p className="text-sm text-white secondary-font">
              We&apos;ve sent you an email with a link to verify your account.
              Please check your inbox and follow the instructions.
            </p>
          </div>

          <div className="space-y-6">
            <Link href="/auth/login">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Go to login
              </Button>
            </Link>
            
            <p className="text-center text-sm text-white secondary-font">
              Didn&apos;t receive the email?{' '}
              <button 
                onClick={handleResendEmail}
                disabled={isResending}
                className="text-primary hover:underline disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend verification email'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 