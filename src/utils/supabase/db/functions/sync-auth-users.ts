export const createSyncAuthUsersFunction = `
    CREATE OR REPLACE FUNCTION sync_auth_users()
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        INSERT INTO users (
            id,
            email,
            firstName,
            lastName,
            role,
            isActive,
            isEmailVerified,
            pic_url
        )
        SELECT
            au.id,
            au.email,
            NULLIF(COALESCE(au.raw_user_meta_data->>'first_name', ''), ''),
            NULLIF(COALESCE(au.raw_user_meta_data->>'last_name', ''), ''),
            3, -- Default role is 'user' (id=3)
            au.confirmed_at IS NOT NULL,
            (au.raw_user_meta_data->>'email_verified')::boolean,
            NULLIF(COALESCE(au.raw_user_meta_data->>'profile_image_url', ''), '')
        FROM auth.users au
        WHERE NOT EXISTS (
            SELECT 1 FROM users u WHERE u.id = au.id
        );
    END;
    $$;
`

export const createAuthUserTrigger = `
    -- First create the function that the trigger will use
    CREATE OR REPLACE FUNCTION handle_auth_user_insert()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        INSERT INTO users (
            id,
            email,
            firstName,
            lastName,
            role,
            isActive,
            isEmailVerified,
            pic_url
        ) VALUES (
            NEW.id,
            NEW.email,
            NULLIF(COALESCE(NEW.raw_user_meta_data->>'first_name', ''), ''),
            NULLIF(COALESCE(NEW.raw_user_meta_data->>'last_name', ''), ''),
            3, -- Default role is 'user' (id=3)
            NEW.confirmed_at IS NOT NULL,
            (NEW.raw_user_meta_data->>'email_verified')::boolean,
            NULLIF(COALESCE(NEW.raw_user_meta_data->>'profile_image_url', ''), '')
        );
        RETURN NEW;
    END;
    $$;

    -- Then create the trigger
    DROP TRIGGER IF EXISTS on_auth_user_insert ON auth.users;
    CREATE TRIGGER on_auth_user_insert
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION handle_auth_user_insert();
` 