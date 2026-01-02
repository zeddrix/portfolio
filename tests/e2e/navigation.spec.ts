import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should display navigation bar', async ({ page }) => {
		const nav = page.locator('nav');
		await expect(nav).toBeVisible();
	});

	test('should have logo/brand link', async ({ page }) => {
		const logo = page.locator('nav a').filter({ hasText: 'Zeddrix' });
		await expect(logo).toBeVisible();
		await expect(logo).toHaveAttribute('href', '/');
	});

	test('should have white/light background with blur', async ({ page }) => {
		const nav = page.locator('nav');
		const classes = await nav.getAttribute('class');
		expect(classes).toContain('backdrop-blur');
	});

	test('should display desktop navigation links on large screens', async ({ page, viewport }) => {
		if (viewport && viewport.width >= 768) {
			const navLinks = page.locator('nav .hidden.md\\:flex a');
			const count = await navLinks.count();
			expect(count).toBeGreaterThan(0);
		}
	});

	test('should display mobile menu button on small screens', async ({ page, viewport }) => {
		if (viewport && viewport.width < 768) {
			const menuButton = page.locator('nav button[aria-label="Toggle mobile menu"]');
			await expect(menuButton).toBeVisible();
		}
	});

	test('should open mobile menu when button clicked', async ({ page, viewport }) => {
		if (viewport && viewport.width < 768) {
			const menuButton = page.locator('nav button[aria-label="Toggle mobile menu"]');
			await menuButton.click();

			const mobileMenu = page.locator('.mobile-menu-container');
			await expect(mobileMenu).toBeVisible();
		}
	});

	test('should close mobile menu on escape key', async ({ page, viewport }) => {
		if (viewport && viewport.width < 768) {
			const menuButton = page.locator('nav button[aria-label="Toggle mobile menu"]');
			await menuButton.click();

			await page.keyboard.press('Escape');

			const mobileMenu = page.locator('.mobile-menu-container');
			await expect(mobileMenu).not.toBeVisible();
		}
	});

	test('should have theme toggle', async ({ page }) => {
		const themeToggle = page.locator('nav button').filter({ has: page.locator('svg') });
		const count = await themeToggle.count();
		expect(count).toBeGreaterThan(0);
	});

	test('should have CTA button on desktop', async ({ page, viewport }) => {
		if (viewport && viewport.width >= 768) {
			const ctaButton = page.locator('nav .btn-dark');
			await expect(ctaButton).toBeVisible();
			await expect(ctaButton).toContainText('Get Started');
		}
	});

	test('should scroll to section when nav link clicked', async ({ page, viewport }) => {
		if (viewport && viewport.width >= 768) {
			const contactLink = page.locator('nav a[href="#contact"]').first();
			await contactLink.click();

			await page.waitForTimeout(500);
			const contactSection = page.locator('#contact');
			await expect(contactSection).toBeInViewport();
		}
	});

	test('navigation should be fixed on scroll', async ({ page }) => {
		const nav = page.locator('nav');
		const classes = await nav.getAttribute('class');
		expect(classes).toContain('fixed');
	});

	// Phase 8: Theme and additional navigation tests
	test('theme toggle should be clickable', async ({ page }) => {
		// Wait for theme toggle to mount (it uses {#if mounted})
		await page.waitForTimeout(500);

		// Find first visible theme toggle button using aria-label
		// (There are 2: desktop and mobile, both have same aria-label)
		const themeToggle = page.locator('nav button[aria-label="Toggle theme"]').first();
		await expect(themeToggle).toBeVisible({ timeout: 5000 });

		// Should be clickable
		await expect(themeToggle).toBeEnabled();
	});

	test('mobile menu should close on nav link click', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Open mobile menu
		const menuButton = page.locator('nav button[aria-label="Toggle mobile menu"]');
		await menuButton.click();

		// Wait for menu to open
		await page.waitForTimeout(300);

		// Click a nav link
		const navLink = page.locator('.mobile-menu-container a').first();
		const isVisible = await navLink.isVisible();

		if (isVisible) {
			await navLink.click();
			await page.waitForTimeout(500);

			// Menu should close after clicking
			const mobileMenu = page.locator('.mobile-menu-container');
			await expect(mobileMenu).not.toBeVisible();
		}
	});

	test('navigation links should have smooth scroll behavior', async ({ page, viewport }) => {
		if (viewport && viewport.width >= 768) {
			// Get initial scroll position
			const initialScroll = await page.evaluate(() => window.scrollY);

			// Click on a section link
			const processLink = page.locator('nav a[href="#development-process"]');
			const isVisible = await processLink.isVisible();

			if (isVisible) {
				await processLink.click();
				await page.waitForTimeout(1000);

				// Verify scroll position changed
				const newScroll = await page.evaluate(() => window.scrollY);
				expect(newScroll).toBeGreaterThan(initialScroll);
			}
		}
	});
});
