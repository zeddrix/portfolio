import { test, expect } from '@playwright/test';

test.describe('Stats Section', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.locator('#stats-section').scrollIntoViewIfNeeded();
	});

	test('should display stats section', async ({ page }) => {
		const statsSection = page.locator('#stats-section');
		await expect(statsSection).toBeVisible();
	});

	test('should have light/white background', async ({ page }) => {
		const statsContainer = page.locator('#stats-section > div').first();
		const backgroundColor = await statsContainer.evaluate((el) => {
			return window.getComputedStyle(el).backgroundColor;
		});

		// Should be white or very light color
		// white = rgb(255, 255, 255) or similar light values
		expect(backgroundColor).toMatch(/rgb\(2[45]\d, 2[45]\d, 2[45]\d\)|rgb\(255, 255, 255\)/);
	});

	test('should animate counters when scrolled into view', async ({ page }) => {
		// Wait for animation to complete (2 seconds + buffer)
		await page.waitForTimeout(2500);

		// Check that counter values exist
		const counters = page.locator(
			'#stats-section .text-7xl, #stats-section .text-8xl, #stats-section .text-9xl'
		);
		const count = await counters.count();

		if (count > 0) {
			for (let i = 0; i < count; i++) {
				const text = await counters.nth(i).textContent();
				expect(text).toBeTruthy();
				expect(text).not.toBe('0');
			}
		}
	});

	test('should display counter labels', async ({ page }) => {
		const labels = page.locator('#stats-section .uppercase');
		const count = await labels.count();

		// Should have labels for each counter
		expect(count).toBeGreaterThan(0);
	});
});
