export const usersPolicies = `
    -- Enable RLS
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;

    -- Allow users to read their own data
    CREATE POLICY "Users can view own data" ON users
        FOR SELECT USING (auth.uid()::uuid = id);

    -- Allow users to update their own data
    CREATE POLICY "Users can update own data" ON users
        FOR UPDATE USING (auth.uid()::uuid = id);

    -- Allow admins to view all users
    CREATE POLICY "Admins can view all users" ON users
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM users
                WHERE id = auth.uid()::uuid AND role IN (1, 2)  -- 1=root, 2=admin
            )
        );
`;

export const userRolesPolicies = `
    -- Enable RLS
    ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

    -- Allow all authenticated users to read roles
    CREATE POLICY "Authenticated users can view roles" ON user_roles
        FOR SELECT USING (auth.role() = 'authenticated');

    -- Only root can modify roles
    CREATE POLICY "Only root can modify roles" ON user_roles
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM users
                WHERE id = auth.uid()::uuid AND role = 1  -- 1=root
            )
        );
`; 