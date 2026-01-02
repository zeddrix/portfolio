import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

/**
 * Admin Hero Settings E2E Tests
 *
 * Tests the hero settings page functionality.
 * Requires TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables.
 */

test.describe('Admin Hero Settings', () => {
	test.beforeEach(async ({ page }) => {
		if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
			test.skip();
		}
		await loginAsAdmin(page);
		await page.goto('/admin/settings/hero');
		await page.waitForLoadState('networkidle');
	});

	test.describe('Animation Type', () => {
		test('should display animation type selector with 3 options', async ({ page }) => {
			// Check for animation type section
			const animationSection = page.locator('text=Animation Type');
			await expect(animationSection.first()).toBeVisible();

			// Check for the three options
			const fadeUp = page.locator('text=Fade Up');
			const typewriter = page.locator('text=Typewriter');
			const slideIn = page.locator('text=Slide In');

			await expect(fadeUp.first()).toBeVisible();
			await expect(typewriter.first()).toBeVisible();
			await expect(slideIn.first()).toBeVisible();
		});

		test('should have one animation type selected', async ({ page }) => {
			// Check that one radio button is selected
			const selectedRadio = page.locator('input[name="hero_animation_type"]:checked');
			await expect(selectedRadio).toBeVisible();
		});
	});

	test.describe('Intro Duration', () => {
		test('should display intro duration slider', async ({ page }) => {
			const introDurationLabel = page.locator('text=Intro Duration');
			await expect(introDurationLabel.first()).toBeVisible();

			// Check for range input or slider
			const slider = page.locator('input[name="hero_intro_duration"]');
			await expect(slider).toBeVisible();
		});

		test('should display current duration value', async ({ page }) => {
			// Check for a value display (in seconds)
			const durationValue = page.locator('text=/\\d+s/').first();
			await expect(durationValue).toBeVisible();
		});
	});

	test.describe('Video Duration', () => {
		test('should display video duration slider', async ({ page }) => {
			const videoDurationLabel = page.locator('text=Video Duration');
			await expect(videoDurationLabel.first()).toBeVisible();

			// Check for range input or slider
			const slider = page.locator('input[name="hero_video_duration"]');
			await expect(slider).toBeVisible();
		});
	});

	test.describe('Form Submission', () => {
		test('should save settings successfully', async ({ page }) => {
			// Find the save button
			const saveButton = page.locator('button[type="submit"], button:has-text("Save")');
			await expect(saveButton.first()).toBeVisible();

			// Click save
			await saveButton.first().click();

			// Wait for success message or form to complete
			await page.waitForTimeout(1000);

			// Should stay on the page (not error)
			await expect(page).toHaveURL(/\/admin\/settings\/hero/);
		});

		test('should show current values from database', async ({ page }) => {
			// Check that form has pre-filled values
			const animationRadio = page.locator('input[name="hero_animation_type"]:checked');
			const introSlider = page.locator('input[name="hero_intro_duration"]');
			const videoSlider = page.locator('input[name="hero_video_duration"]');

			// All inputs should have values
			await expect(animationRadio).toBeVisible();
			await expect(introSlider).toHaveAttribute('value', /.+/);
			await expect(videoSlider).toHaveAttribute('value', /.+/);
		});
	});
});
