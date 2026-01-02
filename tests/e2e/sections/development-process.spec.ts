import { test, expect } from '@playwright/test';

test.describe('Development Process Section', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.locator('#development-process').scrollIntoViewIfNeeded();
	});

	test('should display development process section', async ({ page }) => {
		const section = page.locator('#development-process');
		await expect(section).toBeVisible();
	});

	test('should have white background', async ({ page }) => {
		const section = page.locator('#development-process');
		const backgroundColor = await section.evaluate((el) => {
			return window.getComputedStyle(el).backgroundColor;
		});
		expect(backgroundColor).toMatch(/rgb\(255, 255, 255\)/);
	});

	test('should display section heading', async ({ page }) => {
		const heading = page.locator('#development-process h2');
		await expect(heading).toBeVisible();
		await expect(heading).toContainText('Development Process');
	});

	test('should display tab navigation buttons', async ({ page }) => {
		const tabButtons = page.locator('#development-process button[role="tab"]');
		const count = await tabButtons.count();
		expect(count).toBeGreaterThan(0);
	});

	test('should switch tabs when clicked', async ({ page }) => {
		const tabButtons = page.locator('#development-process button[role="tab"]');
		const count = await tabButtons.count();

		if (count > 1) {
			// Click second tab
			await tabButtons.nth(1).click();

			// Verify second tab is now selected
			const isSelected = await tabButtons.nth(1).getAttribute('aria-selected');
			expect(isSelected).toBe('true');
		}
	});

	test('should display featured card with content', async ({ page }) => {
		const card = page.locator('#development-process [role="tabpanel"]');
		await expect(card).toBeVisible();

		// Check for step number badge
		const badge = card.locator('span').first();
		await expect(badge).toBeVisible();
	});

	test('should show CTA button', async ({ page }) => {
		const ctaButton = page.locator('#development-process .btn-white');
		await expect(ctaButton).toBeVisible();
		await expect(ctaButton).toContainText('Get Started');
	});

	test('should have fade transition between tabs', async ({ page }) => {
		const tabButtons = page.locator('#development-process button[role="tab"]');
		const count = await tabButtons.count();

		if (count > 1) {
			// Get initial content
			const card = page.locator('#development-process [role="tabpanel"]');
			const initialText = await card.locator('h3').textContent();

			// Click second tab
			await tabButtons.nth(1).click();
			await page.waitForTimeout(400); // Wait for fade transition

			// Check content changed
			const newText = await card.locator('h3').textContent();
			expect(newText).not.toBe(initialText);
		}
	});
});
