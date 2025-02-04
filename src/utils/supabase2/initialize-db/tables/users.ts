import { SupabaseClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function createUsersTable(supabase: SupabaseClient) {
  const { error } = await supabase.rpc('create_users_table', {
    sql: getUsersTableSQL()
  });

  if (error) {
    console.error('Error creating users table:', error.message);
  }

  return { error };
}

export function getUsersTableSQL(): string {
  return readFileSync(
    join(process.cwd(), 'src/utils/supabase/initialize-db/tables/users.sql'),
    'utf-8'
  );
} 