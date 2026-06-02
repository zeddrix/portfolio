import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'tests/visual',
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	timeout: 60_000,
	expect: { timeout: 15_000 },
	use: {
		...devices['Desktop Chrome'],
		trace: 'off'
	},
	webServer: {
		command: 'pnpm dev --host 127.0.0.1 --port 5173',
		url: 'http://127.0.0.1:5173',
		reuseExistingServer: true,
		timeout: 120_000
	}
});
