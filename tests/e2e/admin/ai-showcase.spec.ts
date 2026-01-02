import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin AI Showcase', () => {
	test.beforeEach(async ({ page }) => {
		if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
			test.skip();
		}
		await loginAsAdmin(page);
		await page.goto('/admin/content/ai-showcase');
		await page.waitForLoadState('networkidle');
	});

	test('should display AI showcase page', async ({ page }) => {
		const heading = page.locator('h1:has-text("AI Showcase")');
		await expect(heading).toBeVisible();
	});

	test('should display tabs for Tools and Stats', async ({ page }) => {
		const toolsTab = page.locator('button:has-text("AI Tools")');
		const statsTab = page.locator('button:has-text("Productivity Stats")');
		await expect(toolsTab).toBeVisible();
		await expect(statsTab).toBeVisible();
	});

	test('should have add tool button', async ({ page }) => {
		const addButton = page.locator('button:has-text("Add Tool")');
		await expect(addButton).toBeVisible();
	});

	test('should switch to Stats tab', async ({ page }) => {
		await page.click('button:has-text("Productivity Stats")');
		const addStatButton = page.locator('button:has-text("Add Stat")');
		await expect(addStatButton).toBeVisible();
	});
});
