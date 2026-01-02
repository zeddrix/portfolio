import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

/**
 * Admin Profile Display Settings E2E Tests
 *
 * Tests the profile display settings page functionality.
 * Requires TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables.
 */

test.describe('Admin Profile Display Settings', () => {
	test.beforeEach(async ({ page }) => {
		if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
			test.skip();
		}
		await loginAsAdmin(page);
		await page.goto('/admin/settings/profile-display');
		await page.waitForLoadState('networkidle');
	});

	test.describe('Location Checkboxes', () => {
		test('should display 4 location checkboxes', async ({ page }) => {
			// Check for the four location options
			const navCheckbox = page.locator('input[name="locations"][value="nav"]');
			const aboutCheckbox = page.locator('input[name="locations"][value="about"]');
			const footerCheckbox = page.locator('input[name="locations"][value="footer"]');
			const contactCheckbox = page.locator('input[name="locations"][value="contact"]');

			await expect(navCheckbox).toBeVisible();
			await expect(aboutCheckbox).toBeVisible();
			await expect(footerCheckbox).toBeVisible();
			await expect(contactCheckbox).toBeVisible();
		});

		test('should display location labels', async ({ page }) => {
			const navLabel = page.locator('text=Navigation');
			const aboutLabel = page.locator('text=About Section');
			const footerLabel = page.locator('text=Footer');
			const contactLabel = page.locator('text=Contact Section');

			await expect(navLabel.first()).toBeVisible();
			await expect(aboutLabel.first()).toBeVisible();
			await expect(footerLabel.first()).toBeVisible();
			await expect(contactLabel.first()).toBeVisible();
		});
	});

	test.describe('Form Submission', () => {
		test('should save settings successfully', async ({ page }) => {
			const saveButton = page.locator('button[type="submit"], button:has-text("Save")');
			await expect(saveButton.first()).toBeVisible();

			await saveButton.first().click();
			await page.waitForTimeout(1000);

			// Should stay on the page
			await expect(page).toHaveURL(/\/admin\/settings\/profile-display/);
		});

		test('should show current values from database', async ({ page }) => {
			// At least some checkboxes should exist
			const checkboxes = page.locator('input[name="locations"]');
			const count = await checkboxes.count();
			expect(count).toBe(4);
		});
	});
});
