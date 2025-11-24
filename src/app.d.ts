// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

// Declare private environment variables
declare module '$env/static/private' {
	export const SUPABASE_SERVICE_ROLE_KEY: string;
	export const SUPABASE_DB_PASSWORD: string;
	export const POSTGRES_URL: string;
	export const CLOUDINARY_API_SECRET: string;
	export const CLOUDINARY_URL: string;
}

export {};
