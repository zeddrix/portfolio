import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { env } from '$env/dynamic/private';
import type { Database } from '$lib/types/database';

/**
 * Creates a Supabase client for server-side use with the anon key.
 * This client respects Row Level Security (RLS) policies.
 *
 * @param accessToken - Optional access token for authenticated requests
 */
export const createServerClient = (accessToken?: string): SupabaseClient<Database> => {
	const client = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
			detectSessionInUrl: false
		},
		global: {
			headers: accessToken
				? {
						Authorization: `Bearer ${accessToken}`
					}
				: {}
		},
		db: {
			schema: 'public'
		}
	});

	return client;
};

/**
 * Get Supabase admin client with service role key.
 * Bypasses Row Level Security (RLS) policies.
 * Use with caution - only in server-side code.
 *
 * Note: This is a function to allow lazy initialization with dynamic env variables.
 */
let _supabaseAdmin: SupabaseClient<Database> | null = null;

export const getSupabaseAdmin = (): SupabaseClient<Database> => {
	if (!_supabaseAdmin) {
		const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
		if (!serviceKey) {
			throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
		}
		_supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, serviceKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			},
			db: {
				schema: 'public'
			}
		});
	}
	return _supabaseAdmin;
};

/**
 * Legacy export for backwards compatibility.
 * @deprecated Use getSupabaseAdmin() instead
 */
export const supabaseAdmin = {
	get from() {
		return getSupabaseAdmin().from;
	},
	get auth() {
		return getSupabaseAdmin().auth;
	},
	get storage() {
		return getSupabaseAdmin().storage;
	},
	get rpc() {
		return getSupabaseAdmin().rpc;
	}
};
