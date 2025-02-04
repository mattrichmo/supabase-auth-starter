export const initializeExecSqlFunction = () => {
    return `
        CREATE OR REPLACE FUNCTION public.exec_sql(query text)
        RETURNS json
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public
        AS $$
        BEGIN
            EXECUTE query;
            RETURN json_build_object('success', true);
        EXCEPTION WHEN OTHERS THEN
            RETURN json_build_object(
                'success', false,
                'error', SQLERRM,
                'detail', SQLSTATE
            );
        END;
        $$;

        -- Grant execute permission to authenticated users
        GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO authenticated;
        GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
    `;
} 