import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Color Palettes', () => {
	test.beforeEach(async ({ page }) => {
		if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
			test.skip();
		}
		await loginAsAdmin(page);
		await page.goto('/admin/settings/palettes');
		await page.waitForLoadState('networkidle');
	});

	test('should display palettes list page', async ({ page }) => {
		const heading = page.locator('h1:has-text("Color Palettes")');
		await expect(heading).toBeVisible();
	});

	test('should display system palettes', async ({ page }) => {
		// Should show at least some palettes
		const paletteCards = page.locator('[data-testid="palette-card"]');
		await expect(paletteCards.first()).toBeVisible();
	});

	test('should indicate active palette', async ({ page }) => {
		const activeBadge = page.locator('text=Active').or(page.locator('[data-active="true"]'));
		await expect(activeBadge.first()).toBeVisible();
	});

	test('should have create custom palette button', async ({ page }) => {
		const createButton = page.locator('button:has-text("Create Palette")');
		await expect(createButton).toBeVisible();
	});

	test('should open create palette modal', async ({ page }) => {
		await page.click('button:has-text("Create Palette")');
		const modal = page.locator('text=New Palette');
		await expect(modal).toBeVisible();
	});

	test('should navigate to palette detail page', async ({ page }) => {
		const paletteCard = page.locator('[data-testid="palette-card"]').first();
		await paletteCard.click();
		await page.waitForURL(/\/admin\/settings\/palettes\/.+/);
		const heading = page.locator('h1');
		await expect(heading).toBeVisible();
	});
});

test.describe('Admin Color Palette Detail', () => {
	test.beforeEach(async ({ page }) => {
		if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
			test.skip();
		}
		await loginAsAdmin(page);
		await page.goto('/admin/settings/palettes');
		await page.waitForLoadState('networkidle');
	});

	test('should display color combinations', async ({ page }) => {
		// Navigate to first palette
		const paletteCard = page.locator('[data-testid="palette-card"]').first();
		await paletteCard.click();
		await page.waitForURL(/\/admin\/settings\/palettes\/.+/);

		// Should show combinations section
		const combinationsSection = page.locator('text=Color Combinations');
		await expect(combinationsSection).toBeVisible();
	});

	test('should have add combination button', async ({ page }) => {
		const paletteCard = page.locator('[data-testid="palette-card"]').first();
		await paletteCard.click();
		await page.waitForURL(/\/admin\/settings\/palettes\/.+/);

		const addButton = page.locator('button:has-text("Add Combination")');
		await expect(addButton).toBeVisible();
	});

	test('should show live preview', async ({ page }) => {
		const paletteCard = page.locator('[data-testid="palette-card"]').first();
		await paletteCard.click();
		await page.waitForURL(/\/admin\/settings\/palettes\/.+/);

		const preview = page.locator('[data-testid="palette-preview"]');
		await expect(preview).toBeVisible();
	});

	test('should toggle dark/light in preview', async ({ page }) => {
		const paletteCard = page.locator('[data-testid="palette-card"]').first();
		await paletteCard.click();
		await page.waitForURL(/\/admin\/settings\/palettes\/.+/);

		const themeToggle = page
			.locator('button:has-text("Dark")')
			.or(page.locator('button:has-text("Light")'));
		await expect(themeToggle.first()).toBeVisible();
	});
});
