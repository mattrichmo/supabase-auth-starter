CREATE OR REPLACE FUNCTION public.sync_existing_auth_users()
RETURNS void AS $$
BEGIN
    INSERT INTO public.users (auth_user_id, email)
    SELECT id, email
    FROM auth.users
    WHERE id NOT IN (SELECT auth_user_id FROM public.users WHERE auth_user_id IS NOT NULL)
    ON CONFLICT (auth_user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 