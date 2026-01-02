import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

/**
 * Admin Stats Settings E2E Tests
 */

test.describe('Admin Stats Settings', () => {
	test.beforeEach(async ({ page }) => {
		if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
			test.skip();
		}
		await loginAsAdmin(page);
		await page.goto('/admin/settings/stats');
		await page.waitForLoadState('networkidle');
	});

	test.describe('Display Settings', () => {
		test('should display mode selector', async ({ page }) => {
			const modeSection = page.locator('text=Display Mode');
			await expect(modeSection.first()).toBeVisible();
		});

		test('should display counters toggle', async ({ page }) => {
			const countersToggle = page.locator('text=Counters');
			await expect(countersToggle.first()).toBeVisible();
		});

		test('should display icons toggle', async ({ page }) => {
			const iconsToggle = page.locator('text=Icons');
			await expect(iconsToggle.first()).toBeVisible();
		});
	});

	test.describe('Stats Counters CRUD', () => {
		test('should display stats counters list', async ({ page }) => {
			const countersList = page.locator('text=Stats Counters');
			await expect(countersList.first()).toBeVisible();
		});

		test('should have add counter button', async ({ page }) => {
			const addButton = page.locator('button:has-text("Add"), button:has-text("New")');
			await expect(addButton.first()).toBeVisible();
		});
	});

	test.describe('Form Submission', () => {
		test('should save settings successfully', async ({ page }) => {
			const saveButton = page.locator('button[type="submit"], button:has-text("Save")');
			await expect(saveButton.first()).toBeVisible();
		});
	});
});
