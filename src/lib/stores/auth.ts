import { writable } from 'svelte/store';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '$lib/supabase';

interface AuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
}

const createAuthStore = () => {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		session: null,
		loading: true
	});

	return {
		subscribe,
		setSession: (session: Session | null) => {
			update((state) => ({
				...state,
				session,
				user: session?.user ?? null,
				loading: false
			}));
		},
		setLoading: (loading: boolean) => {
			update((state) => ({ ...state, loading }));
		},
		initialize: async () => {
			try {
				const {
					data: { session }
				} = await supabase.auth.getSession();
				set({
					user: session?.user ?? null,
					session,
					loading: false
				});

				// Listen for auth state changes
				supabase.auth.onAuthStateChange((_event, session) => {
					set({
						user: session?.user ?? null,
						session,
						loading: false
					});
				});
			} catch (error) {
				console.error('Error initializing auth:', error);
				set({
					user: null,
					session: null,
					loading: false
				});
			}
		},
		signOut: async () => {
			try {
				await supabase.auth.signOut();
				set({
					user: null,
					session: null,
					loading: false
				});
			} catch (error) {
				console.error('Error signing out:', error);
			}
		}
	};
};

export const auth = createAuthStore();
