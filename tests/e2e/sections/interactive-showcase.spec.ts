import { test, expect } from '@playwright/test';

test.describe('Interactive Showcase Section', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.locator('#interactive-showcase').scrollIntoViewIfNeeded();
	});

	test('should display interactive showcase section', async ({ page }) => {
		const section = page.locator('#interactive-showcase');
		await expect(section).toBeVisible();
	});

	test('should have dark/black background', async ({ page }) => {
		const section = page.locator('#interactive-showcase');
		const backgroundColor = await section.evaluate((el) => {
			return window.getComputedStyle(el).backgroundColor;
		});
		// black = rgb(0, 0, 0)
		expect(backgroundColor).toMatch(/rgb\(0, 0, 0\)/);
	});

	test('should display "Trusted by clients worldwide" text', async ({ page }) => {
		const trustText = page
			.locator('#interactive-showcase')
			.getByText('Trusted by clients worldwide');
		await expect(trustText).toBeVisible();
	});

	test('should display "Made with Zeddrix" center overlay', async ({ page }) => {
		const madeWithText = page.locator('#interactive-showcase').getByText('Made with');
		await expect(madeWithText).toBeVisible();

		const zeddrixText = page.locator('#interactive-showcase').getByText('Zeddrix', { exact: true });
		await expect(zeddrixText).toBeVisible();
	});

	test('should display floating project cards on desktop', async ({ page, viewport }) => {
		// Only test on desktop viewport
		if (viewport && viewport.width >= 1024) {
			const floatingCards = page.locator('#interactive-showcase .floating-card');
			const count = await floatingCards.count();
			expect(count).toBeGreaterThan(0);
		}
	});

	test('should display mobile grid fallback on mobile', async ({ page, viewport }) => {
		// Only test on mobile viewport
		if (viewport && viewport.width < 1024) {
			const mobileGrid = page.locator('#interactive-showcase .lg\\:hidden');
			await expect(mobileGrid).toBeVisible();
		}
	});

	test('should display CTA button', async ({ page }) => {
		const ctaButton = page.locator('#interactive-showcase .btn-white');
		await expect(ctaButton).toBeVisible();
		await expect(ctaButton).toContainText('Start Your Project');
	});

	test('floating cards should have parallax effect container', async ({ page, viewport }) => {
		// Only test on desktop
		if (viewport && viewport.width >= 1024) {
			const perspectiveContainer = page.locator('#interactive-showcase .perspective-container');
			await expect(perspectiveContainer).toBeVisible();
		}
	});

	test('project cards should be clickable links', async ({ page }) => {
		const cards = page.locator('#interactive-showcase a[href^="/projects/"]');
		const count = await cards.count();
		expect(count).toBeGreaterThan(0);
	});

	// Phase 6: Simplified parallax tests
	test('should display "Made with Zeddrix" centered text', async ({ page }) => {
		const madeWithDiv = page.locator('#interactive-showcase .pointer-events-none.z-30');
		await expect(madeWithDiv).toBeVisible();

		const madeWithText = await madeWithDiv.textContent();
		expect(madeWithText?.toLowerCase()).toContain('made with');
		expect(madeWithText).toContain('Zeddrix');
	});

	test('project cards should link to project pages', async ({ page }) => {
		const projectLinks = page.locator('#interactive-showcase a[href^="/projects/"]');
		const count = await projectLinks.count();

		if (count > 0) {
			const href = await projectLinks.first().getAttribute('href');
			expect(href).toMatch(/^\/projects\//);
		}
	});

	test('mobile should show simple grid layout', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');
		await page.locator('#interactive-showcase').scrollIntoViewIfNeeded();

		// Check for mobile grid
		const mobileGrid = page.locator('#interactive-showcase .lg\\:hidden');
		await expect(mobileGrid).toBeVisible();

		// Check that grid contains project links
		const mobileLinks = mobileGrid.locator('a');
		const count = await mobileLinks.count();
		expect(count).toBeGreaterThan(0);
	});
});
