import { redirect, type Handle } from '@sveltejs/kit';
import { createServerClient } from '$lib/server/supabase';
import type { Database } from '$lib/types/database';

export const handle: Handle = async ({ event, resolve }) => {
	// Create Supabase client
	const supabaseClient = createServerClient();

	event.locals.supabase = supabaseClient;
	event.locals.session = null;
	event.locals.user = null;

	// Protected routes check
	const isAdminRoute = event.url.pathname.startsWith('/admin');
	const isMaintenancePage = event.url.pathname === '/maintenance';

	// Note: Authentication is now handled client-side
	// Server-side auth was causing issues with session persistence

	// Maintenance mode check (only for public routes)
	if (!isAdminRoute && !isMaintenancePage) {
		try {
			const supabase = createServerClient();
			const { data: settings } = await supabase
				.from('site_settings')
				.select('maintenance_mode')
				.single();

			// Redirect to maintenance page if maintenance mode is enabled
			if (settings && 'maintenance_mode' in settings) {
				const typedSettings = settings as Database['public']['Tables']['site_settings']['Row'];
				if (typedSettings.maintenance_mode === true) {
					throw redirect(303, '/maintenance');
				}
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
