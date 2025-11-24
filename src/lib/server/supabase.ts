import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

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
