import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

/**
 * Admin Navigation E2E Tests
 *
 * Tests the admin panel navigation structure.
 * Requires TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables.
 */

test.describe('Admin Navigation', () => {
	test.beforeEach(async ({ page }) => {
		if (!process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD) {
			test.skip();
		}
		await loginAsAdmin(page);
	});

	test.describe('Main Navigation Items', () => {
		test('should display Dashboard link', async ({ page }) => {
			const dashboard = page.locator('nav a:has-text("Dashboard")');
			await expect(dashboard.first()).toBeVisible();
		});

		test('should display Profile link', async ({ page }) => {
			const profile = page.locator('nav a:has-text("Profile")');
			await expect(profile.first()).toBeVisible();
		});

		test('should display Projects link', async ({ page }) => {
			const projects = page.locator('nav a:has-text("Projects")');
			await expect(projects.first()).toBeVisible();
		});

		test('should display Skills link', async ({ page }) => {
			const skills = page.locator('nav a:has-text("Skills")');
			await expect(skills.first()).toBeVisible();
		});

		test('should display Certifications link', async ({ page }) => {
			const certifications = page.locator('nav a:has-text("Certifications")');
			await expect(certifications.first()).toBeVisible();
		});
	});

	test.describe('Settings Section', () => {
		test('should display Settings section header', async ({ page }) => {
			const settingsHeader = page.locator('nav :text("Settings")');
			await expect(settingsHeader.first()).toBeVisible();
		});

		test('should navigate to Hero Settings', async ({ page }) => {
			const heroSettings = page.locator('nav a:has-text("Hero Settings")');
			await expect(heroSettings.first()).toBeVisible();
			await heroSettings.first().click();
			await expect(page).toHaveURL(/\/admin\/settings\/hero/);
		});

		test('should navigate to Profile Display', async ({ page }) => {
			const profileDisplay = page.locator('nav a:has-text("Profile Display")');
			await expect(profileDisplay.first()).toBeVisible();
			await profileDisplay.first().click();
			await expect(page).toHaveURL(/\/admin\/settings\/profile-display/);
		});

		test('should navigate to Stats Section', async ({ page }) => {
			const statsSection = page.locator('nav a:has-text("Stats Section")');
			await expect(statsSection.first()).toBeVisible();
			await statsSection.first().click();
			await expect(page).toHaveURL(/\/admin\/settings\/stats/);
		});

		test('should navigate to Color Palettes', async ({ page }) => {
			const colorPalettes = page.locator('nav a:has-text("Color Palettes")');
			await expect(colorPalettes.first()).toBeVisible();
			await colorPalettes.first().click();
			await expect(page).toHaveURL(/\/admin\/settings\/palettes/);
		});

		test('should navigate to Button Text', async ({ page }) => {
			const buttonText = page.locator('nav a:has-text("Button Text")');
			await expect(buttonText.first()).toBeVisible();
			await buttonText.first().click();
			await expect(page).toHaveURL(/\/admin\/settings\/button-text/);
		});
	});

	test.describe('Content Section', () => {
		test('should display Content section header', async ({ page }) => {
			const contentHeader = page.locator('nav :text("Content")');
			await expect(contentHeader.first()).toBeVisible();
		});

		test('should navigate to Development Process', async ({ page }) => {
			const devProcess = page.locator('nav a:has-text("Development Process")');
			await expect(devProcess.first()).toBeVisible();
			await devProcess.first().click();
			await expect(page).toHaveURL(/\/admin\/content\/process/);
		});

		test('should navigate to Deliverables', async ({ page }) => {
			const deliverables = page.locator('nav a:has-text("Deliverables")');
			await expect(deliverables.first()).toBeVisible();
			await deliverables.first().click();
			await expect(page).toHaveURL(/\/admin\/content\/deliverables/);
		});

		test('should navigate to AI Showcase', async ({ page }) => {
			const aiShowcase = page.locator('nav a:has-text("AI Showcase")');
			await expect(aiShowcase.first()).toBeVisible();
			await aiShowcase.first().click();
			await expect(page).toHaveURL(/\/admin\/content\/ai-showcase/);
		});
	});

	test.describe('Navigation Active State', () => {
		test('should highlight Dashboard when on dashboard', async ({ page }) => {
			await page.goto('/admin');
			const dashboard = page.locator('nav a:has-text("Dashboard")').first();
			await expect(dashboard).toHaveClass(/bg-primary/);
		});

		test('should highlight Projects when on projects page', async ({ page }) => {
			await page.goto('/admin/projects');
			const projects = page.locator('nav a:has-text("Projects")').first();
			await expect(projects).toHaveClass(/bg-primary/);
		});
	});
});
