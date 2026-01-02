import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

/**
 * Admin Settings Page E2E Tests
 *
 * Tests the admin settings page functionality.
 * Requires TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables.
 */

test.describe('Admin Settings Page', () => {
	test.beforeEach(async ({ page }) => {
		if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
			test.skip();
		}
		await loginAsAdmin(page);
		await page.goto('/admin/settings');
		await page.waitForLoadState('networkidle');
	});

	test.describe('Layout Settings', () => {
		test('should NOT display layout selector', async ({ page }) => {
			// Layout selector has been removed - verify it doesn't exist
			const layoutSelector = page.locator('text=Layout, text=Bento Grid, text=Case Study');
			await expect(layoutSelector).not.toBeVisible();
		});
	});

	test.describe('Color Palette Settings', () => {
		test('should display color palette selector', async ({ page }) => {
			// Look for color palette section
			const paletteSection = page.locator('text=Color Palette, text=Default Palette');
			await expect(paletteSection.first()).toBeVisible();
		});

		test('should display palette options', async ({ page }) => {
			// Check for some palette options
			const cyberBlue = page.locator('text=Cyber Blue');
			await expect(cyberBlue.first()).toBeVisible();
		});
	});

	test.describe('Theme Settings', () => {
		test('should display theme selector', async ({ page }) => {
			// Look for theme section
			const themeSection = page.locator('text=Theme');
			await expect(themeSection.first()).toBeVisible();
		});

		test('should display dark and light options', async ({ page }) => {
			const darkOption = page.locator('text=Dark');
			const lightOption = page.locator('text=Light');
			await expect(darkOption.first()).toBeVisible();
			await expect(lightOption.first()).toBeVisible();
		});
	});

	test.describe('Maintenance Mode', () => {
		test('should display maintenance mode toggle', async ({ page }) => {
			const maintenanceSection = page.locator('text=Maintenance');
			await expect(maintenanceSection.first()).toBeVisible();
		});
	});

	test.describe('Information Section', () => {
		test('should display about these settings information', async ({ page }) => {
			const infoSection = page.locator('text=About These Settings');
			await expect(infoSection).toBeVisible();
		});
	});
});
