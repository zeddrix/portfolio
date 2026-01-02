import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design - Mobile', () => {
	test.use({ ...devices['iPhone 13'] });

	test('should display mobile navigation menu button', async ({ page }) => {
		await page.goto('/');
		const menuButton = page.locator('nav button[aria-label="Toggle mobile menu"]');
		await expect(menuButton).toBeVisible();
	});

	test('should hide desktop navigation', async ({ page }) => {
		await page.goto('/');
		const desktopNav = page.locator('nav .hidden.md\\:flex');
		await expect(desktopNav).not.toBeVisible();
	});

	test('should show mobile project grid instead of floating cards', async ({ page }) => {
		await page.goto('/');
		await page.locator('#interactive-showcase').scrollIntoViewIfNeeded();

		// Floating cards should be hidden
		const floatingCards = page.locator('.perspective-1000');
		await expect(floatingCards).not.toBeVisible();

		// Mobile grid should be visible
		const mobileGrid = page.locator('#interactive-showcase .lg\\:hidden');
		await expect(mobileGrid).toBeVisible();
	});

	test('should stack footer columns on mobile', async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);

		const footerGrid = page.locator('footer .grid');
		const classes = await footerGrid.getAttribute('class');
		expect(classes).toContain('grid-cols-2');
	});

	test('hero section should be fully visible', async ({ page }) => {
		await page.goto('/');
		const hero = page.locator('#hero');
		await expect(hero).toBeVisible();
	});

	test('all sections should be scrollable', async ({ page }) => {
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
	test.use({ ...devices['iPad Pro 11'] });

	test('should display tablet-friendly layout', async ({ page }) => {
		await page.goto('/');
		const hero = page.locator('#hero');
		await expect(hero).toBeVisible();
	});

	test('process tabs should wrap properly', async ({ page }) => {
		await page.goto('/');
		await page.locator('#development-process').scrollIntoViewIfNeeded();

		const tabContainer = page.locator('#development-process [role="tablist"]');
		await expect(tabContainer).toBeVisible();
	});
});

test.describe('Responsive Design - Desktop', () => {
	test.use({ viewport: { width: 1440, height: 900 } });

	test('should display full desktop navigation', async ({ page }) => {
		await page.goto('/');
		const desktopNav = page.locator('nav .hidden.md\\:flex');
		await expect(desktopNav).toBeVisible();
	});

	test('should hide mobile menu button', async ({ page }) => {
		await page.goto('/');
		const menuButton = page.locator('nav button[aria-label="Toggle mobile menu"]');
		await expect(menuButton).not.toBeVisible();
	});

	test('should show floating cards in interactive showcase', async ({ page }) => {
		await page.goto('/');
		await page.locator('#interactive-showcase').scrollIntoViewIfNeeded();

		const floatingCards = page.locator('.perspective-1000');
		await expect(floatingCards).toBeVisible();
	});

	test('footer should display 4 columns', async ({ page }) => {
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

		const sections = ['#stats-section', '#development-process', '#deliverables', '#ai-showcase'];

		for (const sectionId of sections) {
			const section = page.locator(sectionId);
			await section.scrollIntoViewIfNeeded();

			const padding = await section.evaluate((el) => {
				return window.getComputedStyle(el).paddingTop;
			});

			// Should have meaningful padding (at least 48px = 3rem)
			const paddingValue = parseInt(padding);
			expect(paddingValue).toBeGreaterThanOrEqual(48);
		}
	});
});
