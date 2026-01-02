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

		// Check that counter values exist using stats-number class
		const counters = page.locator('#stats-section .stats-number span');
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

	// Phase 1: MASSIVE numbers test - Squarespace style
	test('stats numbers should have large font size >= 80px on desktop', async ({ page }) => {
		// Set desktop viewport
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/');
		await page.locator('#stats-section').scrollIntoViewIfNeeded();

		// Wait for section to be visible
		await page.waitForTimeout(500);

		const statsNumbers = page.locator('#stats-section .stats-number span');
		const count = await statsNumbers.count();

		if (count > 0) {
			for (let i = 0; i < count; i++) {
				const fontSize = await statsNumbers.nth(i).evaluate((el) => {
					return parseFloat(window.getComputedStyle(el).fontSize);
				});

				// MASSIVE numbers should be at least 80px (font-size in clamp starts at 7rem = 112px)
				expect(fontSize).toBeGreaterThanOrEqual(80);
			}
		}
	});

	// Phase 1: Personalized labels - Years Experience
	test('stats should display "Years Experience" or similar experience label', async ({ page }) => {
		const statsSection = page.locator('#stats-section');
		const text = await statsSection.textContent();

		// Check for experience-related label (case insensitive)
		const hasExperienceLabel =
			text?.toLowerCase().includes('experience') || text?.toLowerCase().includes('years');

		expect(hasExperienceLabel).toBeTruthy();
	});

	// Phase 1: Personalized labels - Projects Completed
	test('stats should display "Projects" label', async ({ page }) => {
		const statsSection = page.locator('#stats-section');
		const text = await statsSection.textContent();

		// Check for projects-related label (case insensitive)
		const hasProjectsLabel = text?.toLowerCase().includes('project');

		expect(hasProjectsLabel).toBeTruthy();
	});

	// Phase 1: Personalized labels - Technologies
	test('stats should display "Technologies" or skills label', async ({ page }) => {
		const statsSection = page.locator('#stats-section');
		const text = await statsSection.textContent();

		// Check for technologies-related label (case insensitive)
		const hasTechLabel =
			text?.toLowerCase().includes('technolog') ||
			text?.toLowerCase().includes('skill') ||
			text?.toLowerCase().includes('mastered');

		expect(hasTechLabel).toBeTruthy();
	});
});
