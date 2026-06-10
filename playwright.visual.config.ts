import { defineConfig, devices } from "@playwright/test";

/** Playwright config for visual screenshot capture only. */
export default defineConfig({
  testDir: "tests/visual",
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:7212",
    trace: "off",
  },
});
