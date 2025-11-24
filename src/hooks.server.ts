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
	const isMaintenancePage = event.url.pathname === '/maintenance';

	// Redirect to login if accessing admin routes without authentication
	if (isAdminRoute && !isLoginRoute && !session) {
		throw redirect(303, '/admin/login');
	}

	// Redirect to admin dashboard if already logged in and trying to access login
	if (isLoginRoute && session) {
		throw redirect(303, '/admin');
	}

	// Maintenance mode check (only for public routes)
	if (!isAdminRoute && !isMaintenancePage) {
		try {
			const supabase = createServerClient();
			const { data: settings } = await supabase
				.from('site_settings')
				.select('maintenance_mode')
				.single();

			// Redirect to maintenance page if maintenance mode is enabled
			if (settings?.maintenance_mode === true) {
				throw redirect(303, '/maintenance');
			}
		} catch (error) {
			// If error is not a redirect, log it and continue
			// This prevents the site from breaking if database is unreachable
			if (!(error instanceof Response)) {
				console.error('Error checking maintenance mode:', error);
			} else {
				// Re-throw redirect
				throw error;
			}
		}
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});

	return response;
};
