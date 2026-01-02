import { test, expect } from '@playwright/test';

test.describe('Footer', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Scroll to bottom of page
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);
	});

	test('should display footer', async ({ page }) => {
		const footer = page.locator('footer');
		await expect(footer).toBeVisible();
	});

	test('should have dark background', async ({ page }) => {
		const footer = page.locator('footer');

		// Wait for Tailwind styles to load
		await page.waitForTimeout(500);

		const backgroundColor = await footer.evaluate((el) => {
			return window.getComputedStyle(el).backgroundColor;
		});
		// zinc-950 is very dark, close to rgb(9, 9, 11) or similar dark colors
		// Accept any dark color (RGB values < 50 each) or check for the Tailwind class
		const hasClass = await footer.evaluate((el) => el.classList.contains('bg-zinc-950'));
		const isDark =
			backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/) &&
			parseInt(RegExp.$1) < 50 &&
			parseInt(RegExp.$2) < 50 &&
			parseInt(RegExp.$3) < 50;

		expect(hasClass || isDark).toBeTruthy();
	});

	test('should display name/logo', async ({ page }) => {
		const name = page.locator('footer h2');
		await expect(name).toBeVisible();
	});

	test('should display CTA button in top bar', async ({ page }) => {
		const ctaButton = page.locator('footer .btn-white');
		await expect(ctaButton).toBeVisible();
		await expect(ctaButton).toContainText('Start a Project');
	});

	test('should display multi-column navigation', async ({ page }) => {
		const columns = page.locator('footer .grid > div');
		const count = await columns.count();
		expect(count).toBeGreaterThanOrEqual(3);
	});

	test('should display column headings', async ({ page }) => {
		const headings = page.locator('footer h3');
		const count = await headings.count();
		expect(count).toBeGreaterThanOrEqual(3);

		const headingTexts = await headings.allTextContents();
		expect(headingTexts).toContain('Services');
		expect(headingTexts).toContain('Company');
	});

	test('should have working navigation links', async ({ page }) => {
		const links = page.locator('footer a[href^="/#"]');
		const count = await links.count();
		expect(count).toBeGreaterThan(0);
	});

	test('should display social links if available', async ({ page }) => {
		const socialLinks = page.locator('footer a[target="_blank"]');
		const count = await socialLinks.count();
		// Social links are optional, so just ensure they work if present
		if (count > 0) {
			const firstLink = socialLinks.first();
			await expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer');
		}
	});

	test('should display copyright notice', async ({ page }) => {
		const copyright = page.locator('footer').getByText(/\d{4}/);
		await expect(copyright).toBeVisible();
	});

	test('should display tech stack credits', async ({ page }) => {
		const svelteText = page.locator('footer').getByText('SvelteKit');
		await expect(svelteText).toBeVisible();
	});
});
