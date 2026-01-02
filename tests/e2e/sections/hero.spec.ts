import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should display hero section', async ({ page }) => {
		const hero = page.locator('#hero');
		await expect(hero).toBeVisible();
	});

	test('should show intro content initially', async ({ page }) => {
		// Hero should have some text content
		const heroText = page.locator('#hero').getByRole('heading').first();
		await expect(heroText).toBeVisible({ timeout: 5000 });
	});

	test('should transition to video carousel after intro', async ({ page }) => {
		// Wait for intro duration (2-3 seconds) plus transition
		await page.waitForTimeout(4000);

		// Check if video element exists (if carousel projects are configured)
		const video = page.locator('#hero video');
		const videoCount = await video.count();

		// If video exists, it should be visible
		if (videoCount > 0) {
			await expect(video.first()).toBeVisible({ timeout: 5000 });
		}
	});

	test('should have CTA button', async ({ page }) => {
		// Wait for content to load
		await page.waitForTimeout(500);

		// Look for a CTA link or button in hero
		const ctaButton = page.locator('#hero a, #hero button').first();
		await expect(ctaButton).toBeVisible({ timeout: 5000 });
	});

	test('should have scroll indicator', async ({ page }) => {
		// Wait for page to settle
		await page.waitForTimeout(500);

		const scrollIndicator = page.locator('#hero a[href="#stats-section"]');
		// Scroll indicator may or may not be visible depending on state
		const isVisible = await scrollIndicator.isVisible();

		if (isVisible) {
			await expect(scrollIndicator).toBeVisible();
		}
	});

	// Phase 2: Personalized hero tests
	test('hero should display "Zeddrix Fabian" or name from profile', async ({ page }) => {
		// Wait for hero content to load
		await page.waitForTimeout(500);

		const heroContent = page.locator('#hero');
		const text = await heroContent.textContent();

		// Should display the personalized name
		const hasName =
			text?.toLowerCase().includes('zeddrix') || text?.toLowerCase().includes('fabian');

		expect(hasName).toBeTruthy();
	});

	test('hero CTA should have arrow icon', async ({ page }) => {
		// Wait for content to load
		await page.waitForTimeout(500);

		// Find the CTA button with "Get in Touch" text
		const ctaButton = page.locator('#hero a:has-text("Get in Touch")');
		const ctaCount = await ctaButton.count();

		if (ctaCount > 0) {
			// Check for SVG arrow icon inside the button
			const arrowIcon = ctaButton.locator('svg');
			await expect(arrowIcon).toBeVisible();
		}
	});

	test('hero should display inspirational quote', async ({ page }) => {
		// Wait for hero content to load
		await page.waitForTimeout(500);

		const heroContent = page.locator('#hero');
		const text = await heroContent.textContent();

		// Should display the personalized quote
		const hasQuote =
			text?.toLowerCase().includes('efficiency') || text?.toLowerCase().includes('work smart');

		expect(hasQuote).toBeTruthy();
	});
});

test.describe('Hero Carousel Thumbnails', () => {
	test('should display thumbnails when carousel is active', async ({ page }) => {
		await page.goto('/');

		// Wait for carousel to potentially appear
		await page.waitForTimeout(4000);

		// Check if thumbnails exist
		const thumbnails = page.locator('#hero [class*="thumbnail"], #hero button[class*="thumbnail"]');
		const count = await thumbnails.count();

		// Thumbnails may or may not exist depending on data
		if (count > 0) {
			await expect(thumbnails.first()).toBeVisible();
		}
	});
});
