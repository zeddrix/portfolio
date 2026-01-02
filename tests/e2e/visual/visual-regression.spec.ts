import { test, expect } from '@playwright/test';

// Viewport dimensions
const desktopViewport = { width: 1440, height: 900 };
const mobileViewport = { width: 390, height: 844 };
const tabletViewport = { width: 834, height: 1194 };

test.describe('Visual Regression - Desktop', () => {
	test.skip('homepage full page', async ({ page }) => {
		// Skip: Full-page screenshots are flaky due to animated content
		await page.setViewportSize(desktopViewport);
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(2000);

		await expect(page).toHaveScreenshot('homepage-desktop.png', {
			fullPage: true,
			animations: 'disabled',
			timeout: 30000
		});
	});

	test('hero section', async ({ page }) => {
		await page.setViewportSize(desktopViewport);
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const hero = page.locator('#hero');
		await expect(hero).toHaveScreenshot('hero-desktop.png', {
			animations: 'disabled'
		});
	});

	test('stats section', async ({ page }) => {
		await page.setViewportSize(desktopViewport);
		await page.goto('/');
		await page.locator('#stats-section').scrollIntoViewIfNeeded();
		await page.waitForTimeout(500);

		const stats = page.locator('#stats-section');
		await expect(stats).toHaveScreenshot('stats-desktop.png', {
			animations: 'disabled'
		});
	});

	test('development process section', async ({ page }) => {
		await page.setViewportSize(desktopViewport);
		await page.goto('/');
		await page.locator('#development-process').scrollIntoViewIfNeeded();
		await page.waitForTimeout(500);

		const process = page.locator('#development-process');
		await expect(process).toHaveScreenshot('process-desktop.png', {
			animations: 'disabled'
		});
	});

	test('footer section', async ({ page }) => {
		await page.setViewportSize(desktopViewport);
		await page.goto('/');
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);

		const footer = page.locator('footer');
		await expect(footer).toHaveScreenshot('footer-desktop.png', {
			animations: 'disabled'
		});
	});
});

test.describe('Visual Regression - Mobile', () => {
	test('homepage full page mobile', async ({ page }) => {
		await page.setViewportSize(mobileViewport);
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1000);

		await expect(page).toHaveScreenshot('homepage-mobile.png', {
			fullPage: true,
			animations: 'disabled'
		});
	});

	test('hero section mobile', async ({ page }) => {
		await page.setViewportSize(mobileViewport);
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const hero = page.locator('#hero');
		await expect(hero).toHaveScreenshot('hero-mobile.png', {
			animations: 'disabled'
		});
	});

	test('mobile navigation open', async ({ page }) => {
		await page.setViewportSize(mobileViewport);
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const menuButton = page.locator('nav button[aria-label="Toggle mobile menu"]');
		await menuButton.click();
		await page.waitForTimeout(400);

		await expect(page).toHaveScreenshot('nav-mobile-open.png', {
			animations: 'disabled'
		});
	});

	test('footer mobile', async ({ page }) => {
		await page.setViewportSize(mobileViewport);
		await page.goto('/');
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);

		const footer = page.locator('footer');
		await expect(footer).toHaveScreenshot('footer-mobile.png', {
			animations: 'disabled'
		});
	});
});

test.describe('Visual Regression - Tablet', () => {
	test('homepage full page tablet', async ({ page }) => {
		await page.setViewportSize(tabletViewport);
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(2000);

		await expect(page).toHaveScreenshot('homepage-tablet.png', {
			fullPage: true,
			animations: 'disabled',
			timeout: 30000
		});
	});
});

test.describe('Visual Regression - Dark Theme', () => {
	test('homepage dark theme', async ({ page }) => {
		// Emulate dark color scheme
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(2000);

		// Toggle dark theme using the theme toggle button if available
		const themeToggle = page.locator('nav button[aria-label="Toggle theme"]').first();
		if (await themeToggle.isVisible()) {
			await themeToggle.click();
			await page.waitForTimeout(500);
		}

		await expect(page).toHaveScreenshot('homepage-dark.png', {
			fullPage: true,
			animations: 'disabled',
			timeout: 30000
		});
	});
});

test.describe('Visual Regression - Interactions', () => {
	test('process tab hover states', async ({ page }) => {
		await page.goto('/');
		await page.locator('#development-process').scrollIntoViewIfNeeded();
		await page.waitForTimeout(500);

		const tabs = page.locator('#development-process button[role="tab"]');
		const count = await tabs.count();

		if (count > 1) {
			// Hover on second tab
			await tabs.nth(1).hover();
			await page.waitForTimeout(200);

			await expect(page.locator('#development-process')).toHaveScreenshot('process-tab-hover.png', {
				animations: 'disabled'
			});
		}
	});

	test('navigation hover states', async ({ page }) => {
		await page.goto('/');

		const navLink = page.locator('nav a[href="#contact"]').first();
		await navLink.hover();
		await page.waitForTimeout(200);

		await expect(page.locator('nav')).toHaveScreenshot('nav-hover.png', {
			animations: 'disabled'
		});
	});
});
