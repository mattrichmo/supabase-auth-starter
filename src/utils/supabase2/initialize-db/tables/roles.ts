import { readFileSync } from 'fs';
import { join } from 'path';

export function getRolesTableSQL(): string {
    return readFileSync(
        join(process.cwd(), 'src/utils/supabase/initialize-db/tables/roles.sql'),
        'utf-8'
    );
} 