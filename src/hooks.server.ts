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

	// Add caching headers based on route type
	const path = event.url.pathname;

	// Static assets: Long cache with immutable
	if (path.startsWith('/_app/') || path.startsWith('/assets/')) {
		response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	}
	// Admin routes: No cache
	else if (isAdminRoute) {
		response.headers.set(
			'Cache-Control',
			'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
		);
		response.headers.set('Pragma', 'no-cache');
		response.headers.set('Expires', '0');
	}
	// API routes: Short cache with revalidation
	else if (path.startsWith('/api/')) {
		response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
	}
	// Public pages: Moderate cache with stale-while-revalidate
	else if (!isMaintenancePage) {
		response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
	}
	// Maintenance page: No cache
	else {
		response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
	}

	// Security headers
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	return response;
};
