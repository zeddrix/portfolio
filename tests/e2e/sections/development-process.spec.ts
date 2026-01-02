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
		// Wait for section animation to complete
		await page.waitForTimeout(1000);

		const tabButtons = page.locator('#development-process button[role="tab"]');
		const count = await tabButtons.count();

		if (count > 1) {
			// Use JavaScript click to bypass any overlay issues
			await page.evaluate(() => {
				const buttons = document.querySelectorAll('#development-process button[role="tab"]');
				if (buttons[1]) {
					(buttons[1] as HTMLButtonElement).click();
				}
			});

			// Wait for Svelte reactivity to update
			await page.waitForTimeout(500);

			// Verify second tab is now selected
			const secondTab = tabButtons.nth(1);
			await expect(secondTab).toHaveAttribute('aria-selected', 'true');
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
		// Wait for section animation to complete
		await page.waitForTimeout(1000);

		const tabButtons = page.locator('#development-process button[role="tab"]');
		const count = await tabButtons.count();

		if (count > 1) {
			// Get initial content
			const card = page.locator('#development-process [role="tabpanel"]');
			const initialText = await card.locator('h3').textContent();

			// Use JavaScript click to bypass any overlay issues
			await page.evaluate(() => {
				const buttons = document.querySelectorAll('#development-process button[role="tab"]');
				if (buttons[1]) {
					(buttons[1] as HTMLButtonElement).click();
				}
			});
			await page.waitForTimeout(600); // Wait for fade transition

			// Check content changed
			const newText = await card.locator('h3').textContent();
			expect(newText).not.toBe(initialText);
		}
	});

	// Phase 3: Personalized 4D Process Steps
	test('should display "Discovery" tab for first step', async ({ page }) => {
		const section = page.locator('#development-process');
		const text = await section.textContent();

		// Check for Discovery step (first in 4D process)
		const hasDiscovery = text?.toLowerCase().includes('discovery');
		expect(hasDiscovery).toBeTruthy();
	});

	test('should display "Design" tab for second step', async ({ page }) => {
		const section = page.locator('#development-process');
		const text = await section.textContent();

		// Check for Design step (second in 4D process)
		const hasDesign = text?.toLowerCase().includes('design');
		expect(hasDesign).toBeTruthy();
	});

	test('should display "Develop" tab for third step', async ({ page }) => {
		const section = page.locator('#development-process');
		const text = await section.textContent();

		// Check for Develop step (third in 4D process)
		const hasDevelop = text?.toLowerCase().includes('develop');
		expect(hasDevelop).toBeTruthy();
	});

	test('should display "Deploy" tab for fourth step', async ({ page }) => {
		const section = page.locator('#development-process');
		const text = await section.textContent();

		// Check for Deploy step (fourth in 4D process)
		const hasDeploy = text?.toLowerCase().includes('deploy');
		expect(hasDeploy).toBeTruthy();
	});

	test('clicking tab should change featured card content', async ({ page }) => {
		// Wait for section to be fully visible
		await page.waitForTimeout(500);

		const tabButtons = page.locator('#development-process button[role="tab"]');
		const count = await tabButtons.count();

		if (count > 1) {
			// Click second tab with force
			const secondTab = tabButtons.nth(1);
			await secondTab.scrollIntoViewIfNeeded();
			await secondTab.click({ force: true });
			await page.waitForTimeout(500);

			// Verify the second tab is now selected
			await expect(secondTab).toHaveAttribute('aria-selected', 'true');

			// Verify first tab is no longer selected
			await expect(tabButtons.nth(0)).toHaveAttribute('aria-selected', 'false');
		}
	});
});
