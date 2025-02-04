// import { createClient } from '@supabase/supabase-js'
import { SupabaseClient, PostgrestError } from '@supabase/supabase-js'
import { getUsersTableSQL } from './tables/users'
import { getRolesTableSQL } from './tables/roles'
import { initializeExecSqlFunction } from './functions/exec-sql'



// Define types for the SQL execution results
// Removed unused SqlExecResult type


// handles the initialization of the database in supa base 
// all SQL states should be IF NOT EXISTS and then if they exist, then we need to go through each table and add the columns that are missing

export async function initializeDB(supabase: SupabaseClient) {
  try {
    // First, ensure the exec_sql function exists
    const { data: execSqlData, error: execSqlError } = await supabase.rpc('exec_sql', {
      query: initializeExecSqlFunction()
    });

    if (execSqlError) {
      console.error('Error creating exec_sql function:', execSqlError);
      return { data: null, error: execSqlError };
    }

    console.log('Exec SQL function creation result:', execSqlData);

    // Then execute the table creation SQL in correct order
    const fullSQL = [
      getRolesTableSQL(),  // Create roles table first
      getUsersTableSQL(),  // Then create users table that references roles
      // Add other table SQL here...
    ].join('\n\n');

    console.log('Executing SQL:', fullSQL);

    // Execute the combined SQL using exec_sql
    const { data, error } = await supabase.rpc('exec_sql', {
      query: fullSQL
    });

    if (error) {
      console.error('Error initializing database:', error);
      return { data: null, error };
    }

    console.log('Database initialization result:', data);
    return { data, error: null };

  } catch (error) {
    console.error('Unexpected error during database initialization:', error);
    return { data: null, error: error as PostgrestError };
  }
}
