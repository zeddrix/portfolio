import { redirect, type Handle } from '@sveltejs/kit';
import { createServerClient } from '$lib/server/supabase';
import { getSession } from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
	// Create Supabase client for this request
	event.locals.supabase = createServerClient();

	// Get session from Supabase
	const session = await getSession(event);
	event.locals.session = session;
	event.locals.user = session?.user ?? null;

	// Protected routes check
	const isAdminRoute = event.url.pathname.startsWith('/admin');
	const isLoginRoute = event.url.pathname === '/admin/login';

	// Redirect to login if accessing admin routes without authentication
	if (isAdminRoute && !isLoginRoute && !session) {
		throw redirect(303, '/admin/login');
	}

	// Redirect to admin dashboard if already logged in and trying to access login
	if (isLoginRoute && session) {
		throw redirect(303, '/admin');
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});

	return response;
};
