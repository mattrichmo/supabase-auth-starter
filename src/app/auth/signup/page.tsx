'use client';

import { useState } from 'react';
import { Input } from '@/components/auth/Input';
import { Button } from '@/components/auth/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create the user in Supabase Auth - the trigger will handle users table insert
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signupError) {
        console.error('Signup error:', signupError);
        throw signupError;
      }

      if (!data?.user) {
        throw new Error('No user data returned after signup');
      }

      // Redirect to confirmation page
      router.push('/auth/check-email');

    } catch (err) {
      console.error('Signup process error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setLoading(false);
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
              Create new account<span className="text-primary">.</span>
            </h1>
            <p className="text-sm text-white secondary-font">
              Already A Member?{" "}
              <Link href="/auth/login" className="text-primary hover:underline text-white">
                Log In
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-6 ">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="First name"
                placeholder="Canna"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <Input 
                label="Last name"
                placeholder="Banana"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>

            <Input 
              label="Email"
              type="email"
              placeholder="canna.banana@Dabbale.co"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input 
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}

            <Button 
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 