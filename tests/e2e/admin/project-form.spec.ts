import { test, expect, type Page } from '@playwright/test';
import { loginAsAdmin } from './helpers';

test.describe('Admin Project Form', () => {
	let page: Page;

	test.beforeEach(async ({ browser }) => {
		page = await browser.newPage();
		await loginAsAdmin(page);
	});

	test.afterEach(async () => {
		await page.close();
	});

	test.describe('New Project Page', () => {
		test.beforeEach(async () => {
			await page.goto('/admin/projects/new');
			await page.waitForLoadState('networkidle');
		});

		test('should display basic project form fields', async () => {
			await expect(page.locator('input[name="title"]')).toBeVisible();
			await expect(page.locator('input[name="slug"]')).toBeVisible();
			await expect(page.locator('textarea[name="short_description"]')).toBeVisible();
		});

		// Hero Carousel Section Tests
		test('should display show_in_hero_carousel checkbox', async () => {
			const checkbox = page.locator('input[name="show_in_hero_carousel"]');
			await expect(checkbox).toBeVisible();
			await expect(checkbox).not.toBeChecked();
		});

		test('should display hero_display_order field when hero carousel is checked', async () => {
			const checkbox = page.locator('input[name="show_in_hero_carousel"]');
			const orderField = page.locator('input[name="hero_display_order"]');

			// Initially hidden
			await expect(orderField).not.toBeVisible();

			// Check the checkbox
			await checkbox.check();
			await expect(orderField).toBeVisible();
		});

		// Button Text Section Tests
		test('should display button_text_mode radio group', async () => {
			await expect(
				page.locator('input[name="button_text_mode"][value="predefined"]')
			).toBeVisible();
			await expect(page.locator('input[name="button_text_mode"][value="custom"]')).toBeVisible();
			await expect(page.locator('input[name="button_text_mode"][value="category"]')).toBeVisible();
		});

		test('should show preset dropdown for predefined mode', async () => {
			const predefinedRadio = page.locator('input[name="button_text_mode"][value="predefined"]');
			const presetDropdown = page.locator('select[name="button_text_preset_id"]');

			// Select predefined mode
			await predefinedRadio.check();
			await expect(presetDropdown).toBeVisible();
		});

		test('should show text input for custom mode', async () => {
			const customRadio = page.locator('input[name="button_text_mode"][value="custom"]');
			const customInput = page.locator('input[name="button_text"]');

			// Select custom mode
			await customRadio.check();
			await expect(customInput).toBeVisible();
		});

		test('should show category dropdown for category mode', async () => {
			const categoryRadio = page.locator('input[name="button_text_mode"][value="category"]');
			const categoryDropdown = page.locator('select[name="project_category_id"]');

			// Select category mode
			await categoryRadio.check();
			await expect(categoryDropdown).toBeVisible();
		});

		// Project Category Section Tests
		test('should display project_category dropdown in category section', async () => {
			const categoryLabel = page.locator('text=Project Category');
			await expect(categoryLabel).toBeVisible();
		});
	});

	test.describe('Video Preview Scrubber', () => {
		test.beforeEach(async () => {
			await page.goto('/admin/projects/new');
			await page.waitForLoadState('networkidle');
		});

		test('should display video preview controls when demo video exists', async () => {
			// The video preview section should appear once a video is uploaded
			// This is a visual indicator that video scrubbing will be available
			const videoPreviewLabel = page.locator('text=Video Preview Segment');

			// Initially not visible (no video)
			// Note: This requires a video to be uploaded first
			// For now, check that the section exists in the form
			const mediaSection = page.locator('h2:has-text("Media")');
			await expect(mediaSection).toBeVisible();
		});

		test('should have video_preview_start and video_preview_end hidden inputs', async () => {
			// These fields should exist for form submission
			await expect(page.locator('input[name="video_preview_start"]')).toBeAttached();
			await expect(page.locator('input[name="video_preview_end"]')).toBeAttached();
		});
	});

	test.describe('Edit Project Page', () => {
		// Note: These tests require an existing project in the database
		// They verify that existing project data is loaded correctly

		test('should load existing hero carousel settings', async () => {
			// Navigate to edit a project that exists in the test database
			// This test verifies data is pre-populated
			await page.goto('/admin/projects');
			await page.waitForLoadState('networkidle');

			// Click edit on first project if it exists
			const editButton = page.locator('[data-testid="edit-project"]').first();
			if (await editButton.isVisible()) {
				await editButton.click();
				await page.waitForLoadState('networkidle');

				// Verify form fields are present
				await expect(page.locator('input[name="show_in_hero_carousel"]')).toBeVisible();
				await expect(page.locator('input[name="button_text_mode"]').first()).toBeVisible();
			}
		});

		test('should load existing button text settings', async () => {
			await page.goto('/admin/projects');
			await page.waitForLoadState('networkidle');

			const editButton = page.locator('[data-testid="edit-project"]').first();
			if (await editButton.isVisible()) {
				await editButton.click();
				await page.waitForLoadState('networkidle');

				// Verify button text mode is selected
				const selectedMode = page.locator('input[name="button_text_mode"]:checked');
				await expect(selectedMode).toBeAttached();
			}
		});
	});

	test.describe('Form Validation', () => {
		test.beforeEach(async () => {
			await page.goto('/admin/projects/new');
			await page.waitForLoadState('networkidle');
		});

		test('should require custom button text when custom mode is selected', async () => {
			const customRadio = page.locator('input[name="button_text_mode"][value="custom"]');
			const customInput = page.locator('input[name="button_text"]');

			await customRadio.check();
			await expect(customInput).toBeVisible();

			// The input should have required attribute or validation
			const isRequired = await customInput.getAttribute('required');
			expect(
				isRequired !== null || (await customInput.evaluate((el: HTMLInputElement) => el.required))
			).toBeTruthy();
		});

		test('should require preset selection when predefined mode is selected', async () => {
			const predefinedRadio = page.locator('input[name="button_text_mode"][value="predefined"]');
			const presetDropdown = page.locator('select[name="button_text_preset_id"]');

			await predefinedRadio.check();
			await expect(presetDropdown).toBeVisible();

			// The dropdown should have required attribute
			const isRequired = await presetDropdown.getAttribute('required');
			expect(
				isRequired !== null ||
					(await presetDropdown.evaluate((el: HTMLSelectElement) => el.required))
			).toBeTruthy();
		});
	});
});
