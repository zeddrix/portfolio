import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { env } from '$env/dynamic/private';

/**
 * Creates a Supabase client for server-side use with the anon key.
 * This client respects Row Level Security (RLS) policies.
 *
 * @param accessToken - Optional access token for authenticated requests
 */
export const createServerClient = (accessToken?: string) => {
	const client = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
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
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

export const getSupabaseAdmin = () => {
	if (!_supabaseAdmin) {
		const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
		if (!serviceKey) {
			throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
		}
		_supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, serviceKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
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
