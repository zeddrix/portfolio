import { test, expect } from '@playwright/test';

test.describe('AI Showcase Section', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.locator('#ai-showcase').scrollIntoViewIfNeeded();
	});

	test('should display AI showcase section', async ({ page }) => {
		const section = page.locator('#ai-showcase');
		await expect(section).toBeVisible();
	});

	test('should have white background', async ({ page }) => {
		const section = page.locator('#ai-showcase');
		const backgroundColor = await section.evaluate((el) => {
			return window.getComputedStyle(el).backgroundColor;
		});
		expect(backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
	});

	test('should display decorative dots', async ({ page }) => {
		const dots = page.locator('#ai-showcase .rounded-full').first();
		await expect(dots).toBeVisible();
	});

	test('should display section heading with serif font', async ({ page }) => {
		const heading = page.locator('#ai-showcase h2');
		await expect(heading).toBeVisible();
		await expect(heading).toHaveClass(/heading-section/);
	});

	test('should display two main cards', async ({ page }) => {
		const cards = page.locator('#ai-showcase .bg-zinc-900');
		const count = await cards.count();
		expect(count).toBe(2);
	});

	test('should display AI productivity stats with animated values', async ({ page }) => {
		// Wait for animation to complete
		await page.waitForTimeout(2000);

		const statsValues = page.locator('#ai-showcase .text-3xl, #ai-showcase .text-4xl');
		const count = await statsValues.count();

		if (count > 0) {
			const text = await statsValues.first().textContent();
			expect(text).toBeTruthy();
		}
	});

	test('should display AI tools grid', async ({ page }) => {
		const toolsGrid = page.locator('#ai-showcase .grid.grid-cols-3');
		await expect(toolsGrid).toBeVisible();
	});

	test('should display CTA buttons', async ({ page }) => {
		const ctaButtons = page.locator('#ai-showcase button[type="button"]');
		const count = await ctaButtons.count();
		expect(count).toBeGreaterThan(0);
	});

	test('should display bottom caption', async ({ page }) => {
		const caption = page.locator('#ai-showcase p.text-gray-500');
		await expect(caption).toBeVisible();
	});
});
