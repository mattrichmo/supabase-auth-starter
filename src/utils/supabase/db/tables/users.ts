export const usersTableSql = `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email TEXT NOT NULL,
        firstName TEXT,
        lastName TEXT,
        role INTEGER NOT NULL REFERENCES user_roles(id),
        isActive BOOLEAN NOT NULL DEFAULT true,
        isEmailVerified BOOLEAN NOT NULL DEFAULT false,
        pic_url TEXT DEFAULT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`