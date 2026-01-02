import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Deliverables', () => {
	test.beforeEach(async ({ page }) => {
		if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
			test.skip();
		}
		await loginAsAdmin(page);
		await page.goto('/admin/content/deliverables');
		await page.waitForLoadState('networkidle');
	});

	test('should display deliverables page', async ({ page }) => {
		const heading = page.locator('h1:has-text("Deliverables")');
		await expect(heading).toBeVisible();
	});

	test('should display deliverables list', async ({ page }) => {
		const section = page.locator('text=Project Deliverables');
		await expect(section.first()).toBeVisible();
	});

	test('should have add deliverable button', async ({ page }) => {
		const addButton = page.locator('button:has-text("Add Deliverable")');
		await expect(addButton).toBeVisible();
	});

	test('should open add deliverable modal', async ({ page }) => {
		await page.click('button:has-text("Add Deliverable")');
		const modal = page.locator('h3:has-text("Add Deliverable")');
		await expect(modal).toBeVisible();
	});
});
