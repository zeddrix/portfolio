import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Button Text Settings', () => {
	test.beforeEach(async ({ page }) => {
		if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
			test.skip();
		}
		await loginAsAdmin(page);
		await page.goto('/admin/settings/button-text');
		await page.waitForLoadState('networkidle');
	});

	test('should display presets section', async ({ page }) => {
		const presetsSection = page.locator('text=Button Text Presets');
		await expect(presetsSection.first()).toBeVisible();
	});

	test('should display categories section', async ({ page }) => {
		const categoriesSection = page.locator('text=Project Categories');
		await expect(categoriesSection.first()).toBeVisible();
	});

	test('should have add preset button', async ({ page }) => {
		const addButton = page.locator('button:has-text("Add Preset")');
		await expect(addButton.first()).toBeVisible();
	});

	test('should have add category button', async ({ page }) => {
		const addButton = page.locator('button:has-text("Add Category")');
		await expect(addButton.first()).toBeVisible();
	});
});
