import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { initializeDatabase} from '@/utils/supabase/initializeDatabase/initializeDatabase'

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await initializeDatabase(supabase)
    
    // Check if any operation failed
    const hasFailedOperations = data?.some(op => op.status === 'error') || false
    const isOverallSuccess = !error && !hasFailedOperations

    const summary = {
      status: isOverallSuccess ? 'success' : 'error',
      message: isOverallSuccess 
        ? 'Database initialized successfully' 
        : 'Database initialization failed: Some operations were not successful',
      timestamp: new Date().toISOString(),
      operations: data?.map(op => ({
        task: op.operation,
        status: op.status,
        ...(op.error && { error: op.error })
      }))
    }

    return NextResponse.json(summary, { 
      status: isOverallSuccess ? 200 : 500 
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to initialize database',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    })
  }
}
