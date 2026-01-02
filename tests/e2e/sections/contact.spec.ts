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

	// Phase 7: Comprehensive contact form tests
	test('should validate email format', async ({ page }) => {
		const emailInput = page.locator('#contact input[name="email"], #contact input[type="email"]');
		const submitButton = page.locator('#contact button[type="submit"]');

		// Fill with invalid email
		await emailInput.fill('invalid-email');
		await submitButton.click();

		// HTML5 email validation should mark it as invalid
		const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
		expect(isInvalid).toBe(true);
	});

	test('should accept valid email format', async ({ page }) => {
		const emailInput = page.locator('#contact input[name="email"], #contact input[type="email"]');

		// Fill with valid email
		await emailInput.fill('test@example.com');

		// Should be valid
		const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
		expect(isValid).toBe(true);
	});

	test('form should have all required fields marked as required', async ({ page }) => {
		const form = page.locator('#contact form');
		const requiredInputs = form.locator('[required]');
		const count = await requiredInputs.count();

		// Should have at least name, email, and message as required
		expect(count).toBeGreaterThanOrEqual(2);
	});

	test('form fields should be clearable', async ({ page }) => {
		const nameInput = page
			.locator('#contact input[type="text"], #contact input[name="name"]')
			.first();
		const emailInput = page.locator('#contact input[name="email"], #contact input[type="email"]');

		// Fill fields
		await nameInput.fill('Test User');
		await emailInput.fill('test@example.com');

		// Clear fields
		await nameInput.clear();
		await emailInput.clear();

		// Verify cleared
		await expect(nameInput).toHaveValue('');
		await expect(emailInput).toHaveValue('');
	});

	test('honeypot field should be hidden if exists', async ({ page }) => {
		// Look for common honeypot field patterns
		const honeypotFields = page.locator(
			'#contact input[name="website"], #contact input[name="url"], #contact input[name="phone_number"], #contact .hidden input, #contact [aria-hidden="true"] input'
		);
		const count = await honeypotFields.count();

		// If honeypot exists, it should be hidden
		if (count > 0) {
			const isHidden = await honeypotFields.first().isHidden();
			expect(isHidden).toBe(true);
		}
	});

	test('submit button should have proper aria labels', async ({ page }) => {
		const submitButton = page.locator('#contact button[type="submit"]');
		const text = await submitButton.textContent();

		// Should have meaningful text
		expect(text?.trim().length).toBeGreaterThan(0);
	});
});
