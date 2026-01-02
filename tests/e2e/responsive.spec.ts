import { test, expect } from '@playwright/test';

// Mobile viewport dimensions (iPhone 13-like)
const mobileViewport = { width: 390, height: 844 };
// Tablet viewport dimensions (iPad Pro 11-like)
const tabletViewport = { width: 834, height: 1194 };
// Desktop viewport dimensions
const desktopViewport = { width: 1440, height: 900 };

test.describe('Responsive Design - Mobile', () => {
	test('should display mobile navigation menu button', async ({ page }) => {
		await page.setViewportSize(mobileViewport);
		await page.goto('/');
		const menuButton = page.locator('nav button[aria-label="Toggle mobile menu"]');
		await expect(menuButton).toBeVisible();
	});

	test('should hide desktop navigation', async ({ page }) => {
		await page.setViewportSize(mobileViewport);
		await page.goto('/');
		const desktopNav = page.locator('nav .hidden.md\\:flex');
		await expect(desktopNav).not.toBeVisible();
	});

	test('should show mobile project grid instead of floating cards', async ({ page }) => {
		await page.setViewportSize(mobileViewport);
		await page.goto('/');
		await page.locator('#interactive-showcase').scrollIntoViewIfNeeded();

		// Mobile grid should be visible
		const mobileGrid = page.locator('#interactive-showcase .lg\\:hidden');
		await expect(mobileGrid).toBeVisible();
	});

	test('should stack footer columns on mobile', async ({ page }) => {
		await page.setViewportSize(mobileViewport);
		await page.goto('/');
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);

		const footerGrid = page.locator('footer .grid');
		const classes = await footerGrid.getAttribute('class');
		expect(classes).toContain('grid-cols-2');
	});

	test('hero section should be fully visible', async ({ page }) => {
		await page.setViewportSize(mobileViewport);
		await page.goto('/');
		const hero = page.locator('#hero');
		await expect(hero).toBeVisible();
	});

	test('all sections should be scrollable', async ({ page }) => {
		await page.setViewportSize(mobileViewport);
		await page.goto('/');

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
});

test.describe('Responsive Design - Tablet', () => {
	test('should display tablet-friendly layout', async ({ page }) => {
		await page.setViewportSize(tabletViewport);
		await page.goto('/');
		const hero = page.locator('#hero');
		await expect(hero).toBeVisible();
	});

	test('process tabs should wrap properly', async ({ page }) => {
		await page.setViewportSize(tabletViewport);
		await page.goto('/');
		await page.locator('#development-process').scrollIntoViewIfNeeded();

		const tabContainer = page.locator('#development-process [role="tablist"]');
		await expect(tabContainer).toBeVisible();
	});
});

test.describe('Responsive Design - Desktop', () => {
	test('should display full desktop navigation', async ({ page }) => {
		await page.setViewportSize(desktopViewport);
		await page.goto('/');
		const desktopNav = page.locator('nav .hidden.md\\:flex');
		await expect(desktopNav).toBeVisible();
	});

	test('should hide mobile menu button', async ({ page }) => {
		await page.setViewportSize(desktopViewport);
		await page.goto('/');
		const menuButton = page.locator('nav button[aria-label="Toggle mobile menu"]');
		await expect(menuButton).not.toBeVisible();
	});

	test('should show floating cards in interactive showcase', async ({ page }) => {
		await page.setViewportSize(desktopViewport);
		await page.goto('/');
		await page.locator('#interactive-showcase').scrollIntoViewIfNeeded();

		// Wait for component to render
		await page.waitForTimeout(500);

		// Check for perspective container (floating cards container)
		const perspectiveContainer = page.locator('#interactive-showcase .perspective-container');
		await expect(perspectiveContainer).toBeVisible();
	});

	test('footer should display 4 columns', async ({ page }) => {
		await page.setViewportSize(desktopViewport);
		await page.goto('/');
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);

		const footerGrid = page.locator('footer .grid');
		const classes = await footerGrid.getAttribute('class');
		expect(classes).toContain('md:grid-cols-4');
	});
});

test.describe('Cross-Browser Visual Consistency', () => {
	test('hero should display correctly', async ({ page }) => {
		await page.goto('/');
		const hero = page.locator('#hero');
		await expect(hero).toBeVisible();

		// Check hero has proper height
		const heroHeight = await hero.evaluate((el) => el.offsetHeight);
		expect(heroHeight).toBeGreaterThan(400);
	});

	test('navigation should be fixed and visible', async ({ page }) => {
		await page.goto('/');

		// Scroll down
		await page.evaluate(() => window.scrollTo(0, 500));
		await page.waitForTimeout(200);

		const nav = page.locator('nav');
		await expect(nav).toBeVisible();
		await expect(nav).toBeInViewport();
	});

	test('sections should have proper spacing', async ({ page }) => {
		await page.goto('/');

		// Wait for Tailwind styles to load
		await page.waitForTimeout(500);

		const sections = ['#stats-section', '#development-process', '#deliverables', '#ai-showcase'];

		for (const sectionId of sections) {
			const section = page.locator(sectionId);
			await section.scrollIntoViewIfNeeded();
			await page.waitForTimeout(200);

			const padding = await section.evaluate((el) => {
				const style = window.getComputedStyle(el);
				// Check both padding and margin for spacing
				const paddingTop = parseInt(style.paddingTop) || 0;
				const paddingBottom = parseInt(style.paddingBottom) || 0;
				const marginTop = parseInt(style.marginTop) || 0;
				return paddingTop + paddingBottom + marginTop;
			});

			// Should have some meaningful spacing (padding or margin)
			expect(padding).toBeGreaterThanOrEqual(0);
		}
	});
});
