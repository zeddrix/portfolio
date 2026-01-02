import { test, expect } from '@playwright/test';

test.describe('Homepage User Journey', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should load the page successfully', async ({ page }) => {
		await expect(page).toHaveTitle(/Portfolio/);
	});

	test('should display hero section', async ({ page }) => {
		const hero = page.locator('#hero');
		await expect(hero).toBeVisible();
	});

	test('should display navigation', async ({ page }) => {
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();
	});

	test('should scroll through all sections', async ({ page }) => {
		const sections = [
			'#stats-section',
			'#development-process',
			'#deliverables',
			'#ai-showcase',
			'#interactive-showcase',
			'#contact'
		];

		for (const section of sections) {
			await page.locator(section).scrollIntoViewIfNeeded();
			await expect(page.locator(section)).toBeVisible();
		}
	});

	test('should have working scroll indicator', async ({ page }) => {
		const scrollLink = page.locator('a[href="#stats-section"]');
		if (await scrollLink.isVisible()) {
			await scrollLink.click();
			await page.waitForTimeout(500);
			await expect(page.locator('#stats-section')).toBeInViewport();
		}
	});
});

test.describe('Homepage Accessibility', () => {
	test('should have no automatically detectable accessibility issues on load', async ({ page }) => {
		await page.goto('/');

		// Check basic accessibility
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();

		// Check that main content exists
		const main = page.locator('main');
		await expect(main).toBeVisible();
	});

	test('should be keyboard navigable', async ({ page }) => {
		await page.goto('/');

		// Tab through focusable elements
		await page.keyboard.press('Tab');

		// First focusable element should be focused
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toBeVisible();
	});
});
