import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:7212",
    trace: "off",
  },
  webServer: {
    command: "pnpm dev --host 127.0.0.1 --port 7212",
    url: "http://127.0.0.1:7212",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
