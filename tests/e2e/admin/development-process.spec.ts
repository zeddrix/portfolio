import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Development Process', () => {
	test.beforeEach(async ({ page }) => {
		if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
			test.skip();
		}
		await loginAsAdmin(page);
		await page.goto('/admin/content/process');
		await page.waitForLoadState('networkidle');
	});

	test('should display development process page', async ({ page }) => {
		const heading = page.locator('h1:has-text("Development Process")');
		await expect(heading).toBeVisible();
	});

	test('should display process steps list', async ({ page }) => {
		const stepsSection = page.locator('text=Process Steps');
		await expect(stepsSection.first()).toBeVisible();
	});

	test('should have add step button', async ({ page }) => {
		const addButton = page.locator('button:has-text("Add Step")');
		await expect(addButton).toBeVisible();
	});

	test('should open add step modal', async ({ page }) => {
		await page.click('button:has-text("Add Step")');
		const modal = page.locator('h3:has-text("Add Step")');
		await expect(modal).toBeVisible();
	});
});
