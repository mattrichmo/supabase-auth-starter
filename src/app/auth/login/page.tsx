'use client';

import { useState } from 'react';
import { Input } from '@/components/auth/Input';
import { Button } from '@/components/auth/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Add logging to debug session
      if (data?.session) {
        console.log('Session established:', data.session.user.id);
        // Optionally redirect after successful login
        window.location.href = '/dashboard'; // or wherever you want users to go after login
      } else {
        console.error('No session data received');
        setError('Login successful but no session was created. Please try again.');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
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
              Welcome back<span className="text-primary">.</span>
            </h1>
            <p className="text-sm text-white secondary-font">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline text-white">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <Input 
              label="Email"
              type="email"
              placeholder="canna.banana@Dabbale.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input 
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email?
          </p>
        </div>
      </div>
    </div>
  );
}