import { type Page } from '@playwright/test';

/**
 * Admin E2E Test Helpers
 *
 * Shared utilities for admin panel E2E tests.
 * Uses environment variables for test credentials.
 */

// Test credentials from environment or fallback for local testing
const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'test@example.com';
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'testpassword123';

/**
 * Log in as admin user
 * @param page - Playwright page instance
 * @param email - Optional email override
 * @param password - Optional password override
 */
export async function loginAsAdmin(
	page: Page,
	email: string = TEST_ADMIN_EMAIL,
	password: string = TEST_ADMIN_PASSWORD
): Promise<void> {
	// Navigate to login page
	await page.goto('/admin/login');

	// Wait for the login form to be visible
	await page.waitForSelector('form');

	// Fill in credentials
	await page.fill('input[name="email"]', email);
	await page.fill('input[name="password"]', password);

	// Submit the form
	await page.click('button[type="submit"]');

	// Wait for redirect to admin dashboard
	await page.waitForURL('/admin', { timeout: 10000 });
}

/**
 * Log out from admin panel
 * @param page - Playwright page instance
 */
export async function logoutAdmin(page: Page): Promise<void> {
	// Open profile dropdown
	const profileButton = page.locator('.profile-dropdown button').first();
	await profileButton.click();

	// Click sign out button
	await page.click('button:has-text("Sign out")');

	// Wait for redirect to login page
	await page.waitForURL('/admin/login', { timeout: 10000 });
}

/**
 * Navigate to an admin page with authentication
 * @param page - Playwright page instance
 * @param path - Path to navigate to (e.g., '/admin/settings')
 */
export async function navigateToAdminPage(page: Page, path: string): Promise<void> {
	// First ensure we're logged in
	const currentUrl = page.url();

	if (!currentUrl.includes('/admin') || currentUrl.includes('/admin/login')) {
		await loginAsAdmin(page);
	}

	// Navigate to the target page
	await page.goto(path);

	// Wait for the page to load
	await page.waitForLoadState('networkidle');
}

/**
 * Check if user is authenticated (on admin dashboard)
 * @param page - Playwright page instance
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
	try {
		// Check if we're on an admin page (not login) and have the profile dropdown
		const profileDropdown = page.locator('.profile-dropdown');
		return (await profileDropdown.isVisible()) && !page.url().includes('/admin/login');
	} catch {
		return false;
	}
}

/**
 * Wait for success message to appear
 * @param page - Playwright page instance
 * @param timeout - Optional timeout in milliseconds
 */
export async function waitForSuccessMessage(page: Page, timeout: number = 5000): Promise<void> {
	await page.waitForSelector('.bg-green-50, .bg-success, [role="alert"]:has-text("success")', {
		timeout
	});
}

/**
 * Wait for error message to appear
 * @param page - Playwright page instance
 * @param timeout - Optional timeout in milliseconds
 */
export async function waitForErrorMessage(page: Page, timeout: number = 5000): Promise<void> {
	await page.waitForSelector('.bg-red-50, .bg-error, [role="alert"]:has-text("error")', {
		timeout
	});
}

/**
 * Open a modal form by clicking add button
 * @param page - Playwright page instance
 * @param buttonText - Text of the button to click
 */
export async function openAddModal(page: Page, buttonText: string = 'Add'): Promise<void> {
	await page.click(`button:has-text("${buttonText}")`);
	await page.waitForSelector('[role="dialog"], .fixed.inset-0', { timeout: 5000 });
}

/**
 * Close a modal form
 * @param page - Playwright page instance
 */
export async function closeModal(page: Page): Promise<void> {
	// Try clicking cancel button or close button
	const cancelButton = page.locator('button:has-text("Cancel"), button[aria-label="Close"]');
	if (await cancelButton.isVisible()) {
		await cancelButton.click();
	} else {
		// Press Escape as fallback
		await page.keyboard.press('Escape');
	}
	await page.waitForSelector('[role="dialog"], .fixed.inset-0', { state: 'hidden', timeout: 5000 });
}

/**
 * Confirm a delete action in the confirmation modal
 * @param page - Playwright page instance
 */
export async function confirmDelete(page: Page): Promise<void> {
	await page.click('button:has-text("Delete"), button:has-text("Confirm")');
	await page.waitForTimeout(500); // Wait for action to complete
}

/**
 * Cancel a delete action in the confirmation modal
 * @param page - Playwright page instance
 */
export async function cancelDelete(page: Page): Promise<void> {
	await page.click('button:has-text("Cancel"), button:has-text("No")');
	await page.waitForSelector('[role="dialog"], .fixed.inset-0', { state: 'hidden', timeout: 5000 });
}
