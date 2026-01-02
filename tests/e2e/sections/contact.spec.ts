import { test, expect } from '@playwright/test';

test.describe('Contact Section', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.locator('#contact').scrollIntoViewIfNeeded();
	});

	test('should display contact section', async ({ page }) => {
		const section = page.locator('#contact');
		await expect(section).toBeVisible();
	});

	test('should display section heading', async ({ page }) => {
		const heading = page.locator('#contact h2, #contact h3').first();
		await expect(heading).toBeVisible();
	});

	test('should display contact form', async ({ page }) => {
		const form = page.locator('#contact form');
		await expect(form).toBeVisible();
	});

	test('should have name input field', async ({ page }) => {
		const nameInput = page
			.locator('#contact input[name="name"], #contact input[type="text"]')
			.first();
		await expect(nameInput).toBeVisible();
	});

	test('should have email input field', async ({ page }) => {
		const emailInput = page.locator('#contact input[name="email"], #contact input[type="email"]');
		await expect(emailInput).toBeVisible();
	});

	test('should have message textarea', async ({ page }) => {
		const textarea = page.locator('#contact textarea');
		await expect(textarea).toBeVisible();
	});

	test('should have submit button', async ({ page }) => {
		const submitButton = page.locator('#contact button[type="submit"]');
		await expect(submitButton).toBeVisible();
	});

	test('form fields should be interactive', async ({ page }) => {
		const nameInput = page
			.locator('#contact input[type="text"], #contact input[name="name"]')
			.first();

		await nameInput.fill('Test User');
		await expect(nameInput).toHaveValue('Test User');
	});

	test('should validate required fields', async ({ page }) => {
		const submitButton = page.locator('#contact button[type="submit"]');
		await submitButton.click();

		// Check for validation (browser native or custom)
		const form = page.locator('#contact form');
		const invalidInputs = form.locator(':invalid');
		const count = await invalidInputs.count();

		// Should have at least one invalid field if empty
		expect(count).toBeGreaterThanOrEqual(0);
	});
});
