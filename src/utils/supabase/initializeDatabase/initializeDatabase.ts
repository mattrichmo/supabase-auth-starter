// imports all the tables, polocies and fucntions and executes them in order and console logs the success and status of each 

import { SupabaseClient } from '@supabase/supabase-js';
import { usersTableSql } from "../db/tables/users";
import { userRolesTableSql, insertDefaultRoles } from "../db/tables/user_roles";
import { usersPolicies, userRolesPolicies } from "../db/policies/table-policies";
import { createSyncAuthUsersFunction, createAuthUserTrigger } from '../db/functions/sync-auth-users';

type SqlExecResult = {
    success: boolean;
    error?: string;
}

type InitResult = {
    operation: string;
    status: 'success' | 'error';
    result: SqlExecResult;
    error?: string;
}

export async function initializeDatabase(supabase: SupabaseClient) {
    const results: InitResult[] = [];
    
    try {
        // Create tables
        const { data: userRolesResult, error: userRolesError } = await supabase.rpc('exec_sql', {
            query: userRolesTableSql
        });
        results.push({
            operation: 'Create user_roles table',
            status: userRolesError ? 'error' : 'success',
            result: userRolesResult as SqlExecResult,
            error: userRolesError?.message
        });

        const { data: usersResult, error: usersError } = await supabase.rpc('exec_sql', {
            query: usersTableSql
        });
        results.push({
            operation: 'Create users table',
            status: usersError ? 'error' : 'success',
            result: usersResult as SqlExecResult,
            error: usersError?.message
        });
        
        // Insert default roles
        const { data: rolesResult, error: rolesError } = await supabase.rpc('exec_sql', {
            query: insertDefaultRoles
        });
        results.push({
            operation: 'Insert default roles',
            status: rolesError ? 'error' : 'success',
            result: rolesResult as SqlExecResult,
            error: rolesError?.message
        });
        
        // Apply policies
        const { data: rolesPoliciesResult, error: rolesPoliciesError } = await supabase.rpc('exec_sql', {
            query: userRolesPolicies
        });
        results.push({
            operation: 'Apply user_roles policies',
            status: rolesPoliciesError ? 'error' : 'success',
            result: rolesPoliciesResult as SqlExecResult,
            error: rolesPoliciesError?.message
        });

        const { data: usersPoliciesResult, error: usersPoliciesError } = await supabase.rpc('exec_sql', {
            query: usersPolicies
        });
        results.push({
            operation: 'Apply users policies',
            status: usersPoliciesError ? 'error' : 'success',
            result: usersPoliciesResult as SqlExecResult,
            error: usersPoliciesError?.message
        });
        
        // Create trigger function and trigger
        const { data: triggerResult, error: triggerError } = await supabase.rpc('exec_sql', {
            query: createAuthUserTrigger
        });
        results.push({
            operation: 'Create auth user trigger',
            status: triggerError ? 'error' : 'success',
            result: triggerResult as SqlExecResult,
            error: triggerError?.message
        });

        // Create and execute sync function
        const { data: syncFunctionResult, error: syncFunctionError } = await supabase.rpc('exec_sql', {
            query: createSyncAuthUsersFunction
        });
        results.push({
            operation: 'Create sync auth users function',
            status: syncFunctionError ? 'error' : 'success',
            result: syncFunctionResult as SqlExecResult,
            error: syncFunctionError?.message
        });

        // Execute the sync function to import existing users
        const { data: syncResult, error: syncError } = await supabase.rpc('sync_auth_users');
        results.push({
            operation: 'Sync existing auth users',
            status: syncError ? 'error' : 'success',
            result: syncResult as SqlExecResult,
            error: syncError?.message
        });
        
        const hasErrors = results.some(r => r.status === 'error');
        
        return {
            data: results,
            error: hasErrors ? 'Some operations failed' : null
        };
    } catch (error: unknown) {
        console.error('Database initialization error:', error);
        return {
            data: results,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}


