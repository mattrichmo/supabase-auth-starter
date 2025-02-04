

// creates 3 roles root, admin and user 

export const userRolesTableSql = `
    CREATE TABLE IF NOT EXISTS user_roles (
        id INTEGER PRIMARY KEY,
        role TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`

export const insertDefaultRoles = `
    INSERT INTO user_roles (id, role, description)
    VALUES 
        (1, 'root', 'Super admin with full access'),
        (2, 'admin', 'Administrator with elevated privileges'),
        (3, 'user', 'Standard user')
    ON CONFLICT (id) DO NOTHING;
`