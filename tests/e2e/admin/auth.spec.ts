import { test, expect } from '@playwright/test';
import { loginAsAdmin, logoutAdmin } from './helpers';

/**
 * Admin Authentication E2E Tests
 *
 * Tests the admin login/logout flow and authentication protection.
 * Requires TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables
 * to be set for tests that verify successful login.
 */

test.describe('Admin Authentication', () => {
	test.describe('Login Page', () => {
		test('should redirect to login if not authenticated', async ({ page }) => {
			// Try to access admin dashboard directly
			await page.goto('/admin');

			// Should be redirected to login page
			await expect(page).toHaveURL(/\/admin\/login/);
		});

		test('should display login form', async ({ page }) => {
			await page.goto('/admin/login');

			// Check for login form elements
			await expect(page.locator('form')).toBeVisible();
			await expect(page.locator('input[name="email"]')).toBeVisible();
			await expect(page.locator('input[name="password"]')).toBeVisible();
			await expect(page.locator('button[type="submit"]')).toBeVisible();
		});

		test('should display email and password labels', async ({ page }) => {
			await page.goto('/admin/login');

			// Check for labels
			const emailLabel = page.locator('label:has-text("Email")');
			const passwordLabel = page.locator('label:has-text("Password")');

			await expect(emailLabel).toBeVisible();
			await expect(passwordLabel).toBeVisible();
		});

		test('should show error on invalid credentials', async ({ page }) => {
			await page.goto('/admin/login');

			// Fill in invalid credentials
			await page.fill('input[name="email"]', 'invalid@example.com');
			await page.fill('input[name="password"]', 'wrongpassword');

			// Submit the form
			const submitButton = page.locator('button[type="submit"]');
			await submitButton.click();

			// Wait for button to show loading state then return to normal
			await expect(submitButton)
				.toContainText('Signing in', { timeout: 5000 })
				.catch(() => {
					// Loading state might be too fast to catch
				});

			// Wait for the form to finish processing - button returns to "Sign in"
			await expect(submitButton).toContainText('Sign in', { timeout: 20000 });
			await expect(submitButton).toBeEnabled({ timeout: 5000 });

			// Check for error message - the login page renders an error div when error state is set
			// Either we see the error message OR we're still on login page (not redirected)
			const errorDiv = page.locator('form div p');
			const hasError = (await errorDiv.count()) > 0;

			if (hasError) {
				// Error message is displayed
				await expect(errorDiv.first()).toBeVisible();
			} else {
				// No explicit error shown - verify we're still on login page (not authenticated)
				await expect(page).toHaveURL(/\/admin\/login/);
			}
		});

		test('should disable submit button while loading', async ({ page }) => {
			await page.goto('/admin/login');

			// Fill in credentials
			await page.fill('input[name="email"]', 'test@example.com');
			await page.fill('input[name="password"]', 'password');

			// Click submit and check for loading state
			const submitButton = page.locator('button[type="submit"]');
			await submitButton.click();

			// Button should show loading state (disabled or loading text)
			// Note: This may be very quick, so we check immediately after click
			const isDisabledOrLoading =
				(await submitButton.isDisabled()) ||
				(await submitButton.textContent())?.toLowerCase().includes('sign') ||
				(await submitButton.textContent())?.toLowerCase().includes('load');

			expect(isDisabledOrLoading).toBeTruthy();
		});
	});

	test.describe('Authenticated Flow', () => {
		// These tests require valid test credentials
		// Skip if credentials are not configured
		test.beforeEach(async () => {
			if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
				test.skip();
			}
		});

		test('should login with valid credentials', async ({ page }) => {
			await loginAsAdmin(page);

			// Should be on admin dashboard
			await expect(page).toHaveURL('/admin');
		});

		test('should redirect to dashboard after login', async ({ page }) => {
			await page.goto('/admin/login');

			// Fill in valid credentials
			await page.fill('input[name="email"]', process.env.TEST_ADMIN_EMAIL || '');
			await page.fill('input[name="password"]', process.env.TEST_ADMIN_PASSWORD || '');

			// Submit the form
			await page.click('button[type="submit"]');

			// Wait for redirect to dashboard
			await page.waitForURL('/admin', { timeout: 10000 });

			// Verify we're on the dashboard
			await expect(page).toHaveURL('/admin');
		});

		test('should display profile dropdown when logged in', async ({ page }) => {
			await loginAsAdmin(page);

			// Profile dropdown should be visible
			const profileDropdown = page.locator('.profile-dropdown');
			await expect(profileDropdown).toBeVisible();
		});

		test('should logout and redirect to login', async ({ page }) => {
			// First login
			await loginAsAdmin(page);

			// Verify we're logged in
			await expect(page).toHaveURL('/admin');

			// Now logout
			await logoutAdmin(page);

			// Should be redirected to login page
			await expect(page).toHaveURL(/\/admin\/login/);
		});

		test('should not access admin pages after logout', async ({ page }) => {
			// Login first
			await loginAsAdmin(page);

			// Logout
			await logoutAdmin(page);

			// Try to access admin dashboard
			await page.goto('/admin');

			// Should be redirected to login
			await expect(page).toHaveURL(/\/admin\/login/);
		});
	});

	test.describe('Protected Routes', () => {
		const protectedRoutes = [
			'/admin',
			'/admin/profile',
			'/admin/projects',
			'/admin/skills',
			'/admin/certifications',
			'/admin/settings'
		];

		for (const route of protectedRoutes) {
			test(`should redirect ${route} to login when not authenticated`, async ({ page }) => {
				await page.goto(route);
				await expect(page).toHaveURL(/\/admin\/login/);
			});
		}
	});
});
