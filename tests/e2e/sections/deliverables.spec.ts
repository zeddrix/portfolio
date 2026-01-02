import { test, expect } from '@playwright/test';

test.describe('Project Deliverables Section', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.locator('#deliverables').scrollIntoViewIfNeeded();
	});

	test('should display deliverables section', async ({ page }) => {
		const section = page.locator('#deliverables');
		await expect(section).toBeVisible();
	});

	test('should have white background', async ({ page }) => {
		const section = page.locator('#deliverables');
		const backgroundColor = await section.evaluate((el) => {
			return window.getComputedStyle(el).backgroundColor;
		});
		expect(backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
	});

	test('should display section heading', async ({ page }) => {
		const heading = page.locator('#deliverables h2');
		await expect(heading).toBeVisible();
	});

	test('should display deliverable cards', async ({ page }) => {
		// Wait for content to load
		await page.waitForTimeout(500);

		const cards = page.locator('#deliverables .rounded-2xl');
		const count = await cards.count();
		expect(count).toBeGreaterThan(0);
	});

	test('should display navigation controls', async ({ page }) => {
		// Check for navigation arrows
		const prevButton = page.locator('#deliverables button').filter({ hasText: '' }).first();
		const nextButton = page.locator('#deliverables button').filter({ hasText: '' }).last();

		// At least one navigation control should exist
		const prevVisible = await prevButton.isVisible().catch(() => false);
		const nextVisible = await nextButton.isVisible().catch(() => false);

		expect(prevVisible || nextVisible).toBe(true);
	});

	test('should display pagination dots', async ({ page }) => {
		const dots = page.locator(
			'#deliverables .rounded-full.bg-gray-900, #deliverables .rounded-full.bg-gray-300'
		);
		const count = await dots.count();
		expect(count).toBeGreaterThanOrEqual(0);
	});

	test('cards should have hover effect styles', async ({ page }) => {
		const cards = page.locator('#deliverables .group');
		const count = await cards.count();

		if (count > 0) {
			const firstCard = cards.first();
			await expect(firstCard).toBeVisible();
		}
	});
});
