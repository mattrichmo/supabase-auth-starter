import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  // If there's an error, redirect to login with error message
  if (error) {
    return NextResponse.redirect(
      new URL(
        `/auth/login?error=${encodeURIComponent(error_description || error)}`,
        requestUrl.origin
      )
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/login?error=No code provided', requestUrl.origin)
    );
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  } catch (err) {
    console.error('Error exchanging code for session:', err);
    return NextResponse.redirect(
      new URL('/auth/login?error=Authentication failed', requestUrl.origin)
    );
  }
} 