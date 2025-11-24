import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database';

/**
 * Creates a Supabase client for client-side use.
 * This client handles session persistence and auto-refresh using cookies.
 */
export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
	auth: {
		flowType: 'pkce',
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
		storage: {
			getItem: (key: string) => {
				if (typeof window !== 'undefined') {
					return window.localStorage.getItem(key);
				}
				return null;
			},
			setItem: (key: string, value: string) => {
				if (typeof window !== 'undefined') {
					window.localStorage.setItem(key, value);
				}
			},
			removeItem: (key: string) => {
				if (typeof window !== 'undefined') {
					window.localStorage.removeItem(key);
				}
			}
		}
	}
});
