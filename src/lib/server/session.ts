import type { RequestEvent } from '@sveltejs/kit';
import type { Session } from '@supabase/supabase-js';

/**
 * Gets the session from cookies and validates it
 */
export const getSession = async (event: RequestEvent): Promise<Session | null> => {
	const {
		data: { session }
	} = await event.locals.supabase.auth.getSession();
	return session;
};

/**
 * Checks if the user is authenticated
 */
export const isAuthenticated = (session: Session | null): boolean => {
	return session !== null && session.user !== null;
};

/**
 * Checks if the user has admin role
 * This should be enhanced later to check against admin_users table
 */
export const isAdmin = async (session: Session | null): Promise<boolean> => {
	if (!session?.user) return false;

	// TODO: Later, check against admin_users table in database
	// For now, just verify they have a valid session
	return true;
};

/**
 * Validates session and throws error if invalid
 */
export const requireAuth = (session: Session | null): Session => {
	if (!session) {
		throw new Error('Authentication required');
	}
	return session;
};

/**
 * Validates admin access and throws error if unauthorized
 */
export const requireAdmin = async (session: Session | null): Promise<Session> => {
	const validSession = requireAuth(session);
	const hasAdminAccess = await isAdmin(validSession);

	if (!hasAdminAccess) {
		throw new Error('Admin access required');
	}

	return validSession;
};
