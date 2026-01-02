import { test, expect, devices } from '@playwright/test';

test.describe('Visual Regression - Desktop', () => {
	test.use({ viewport: { width: 1440, height: 900 } });

	test('homepage full page', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1000); // Wait for animations

		await expect(page).toHaveScreenshot('homepage-desktop.png', {
			fullPage: true,
			animations: 'disabled'
		});
	});

	test('hero section', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const hero = page.locator('#hero');
		await expect(hero).toHaveScreenshot('hero-desktop.png', {
			animations: 'disabled'
		});
	});

	test('stats section', async ({ page }) => {
		await page.goto('/');
		await page.locator('#stats-section').scrollIntoViewIfNeeded();
		await page.waitForTimeout(500);

		const stats = page.locator('#stats-section');
		await expect(stats).toHaveScreenshot('stats-desktop.png', {
			animations: 'disabled'
		});
	});

	test('development process section', async ({ page }) => {
		await page.goto('/');
		await page.locator('#development-process').scrollIntoViewIfNeeded();
		await page.waitForTimeout(500);

		const process = page.locator('#development-process');
		await expect(process).toHaveScreenshot('process-desktop.png', {
			animations: 'disabled'
		});
	});

	test('footer section', async ({ page }) => {
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
	test.use({ ...devices['iPhone 13'] });

	test('homepage full page mobile', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1000);

		await expect(page).toHaveScreenshot('homepage-mobile.png', {
			fullPage: true,
			animations: 'disabled'
		});
	});

	test('hero section mobile', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const hero = page.locator('#hero');
		await expect(hero).toHaveScreenshot('hero-mobile.png', {
			animations: 'disabled'
		});
	});

	test('mobile navigation open', async ({ page }) => {
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
	test.use({ ...devices['iPad Pro 11'] });

	test('homepage full page tablet', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1000);

		await expect(page).toHaveScreenshot('homepage-tablet.png', {
			fullPage: true,
			animations: 'disabled'
		});
	});
});

test.describe('Visual Regression - Dark Theme', () => {
	test.use({ colorScheme: 'dark' });

	test('homepage dark theme', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1000);

		// Toggle dark theme if available
		const themeToggle = page.locator('nav button svg').first();
		if (await themeToggle.isVisible()) {
			await themeToggle.click();
			await page.waitForTimeout(300);
		}

		await expect(page).toHaveScreenshot('homepage-dark.png', {
			fullPage: true,
			animations: 'disabled'
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
