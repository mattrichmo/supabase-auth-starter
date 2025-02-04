import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { CookieOptions } from '@supabase/ssr'

export async function createClient(serviceRole = false) {
    const cookieStore = cookies()

    // Remove quotes if they exist in the environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/"/g, '') || ''
    const supabaseKey = serviceRole 
        ? (process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/"/g, '') || '')
        : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.replace(/"/g, '') || '')

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables')
    }

    return createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                async get(name: string) {
                    const cookieStore = await cookies()
                    const cookie = cookieStore.get(name)
                    return cookie?.value
                },
                async set(name: string, value: string, options: CookieOptions) {
                    try {
                        const cookieStore = await cookies()
                        cookieStore.set(name, value, options)
                    } catch (error: unknown) {
                        // Cookie setting errors can be ignored for server-side operations
                        console.debug('Cookie set error:', error)
                    }
                },
                async remove(name: string, options: CookieOptions) {
                    try {
                        const cookieStore = await cookies()
                        cookieStore.set(name, '', options)
                    } catch (error: unknown) {
                        // Cookie removal errors can be ignored for server-side operations
                        console.debug('Cookie remove error:', error)
                    }
                },
            },
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false
            }
        }
    )
} 