export const initializeUserManagementFunctions = () => {
    return `
    -- Function to sync existing auth users to public.users
    CREATE OR REPLACE FUNCTION sync_existing_auth_users()
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        INSERT INTO public.users (
            id,
            email,
            role_id
        )
        SELECT 
            au.id,
            au.email,
            (SELECT id FROM public.user_roles WHERE name = 'user') -- default role
        FROM auth.users au
        WHERE NOT EXISTS (
            SELECT 1 FROM public.users pu WHERE pu.id = au.id
        );
    END;
    $$;

    -- Trigger function for new auth users
    CREATE OR REPLACE FUNCTION handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        INSERT INTO public.users (
            id,
            email,
            role_id
        )
        VALUES (
            NEW.id,
            NEW.email,
            (SELECT id FROM public.user_roles WHERE name = 'user')
        );
        RETURN NEW;
    END;
    $$;

    -- Create trigger if it doesn't exist
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_trigger
            WHERE tgname = 'on_auth_user_created'
        ) THEN
            CREATE TRIGGER on_auth_user_created
                AFTER INSERT ON auth.users
                FOR EACH ROW
                EXECUTE FUNCTION handle_new_user();
        END IF;
    END
    $$;
    `
} 