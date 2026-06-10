import { defineConfig, devices } from "@playwright/test";
import {
  PAGES_BASE_PATH,
  PAGES_SITE_URL,
} from "./tests/e2e/fixtures/pages-env";

const e2ePort = 7212;
const e2eHost = `http://127.0.0.1:${e2ePort}`;
const e2eAppURL = `${e2eHost}${PAGES_BASE_PATH}`;

function readEnvInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: readEnvInt("PW_WORKERS", 1),
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: e2eHost,
    trace: "off",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `pnpm dev --host 127.0.0.1 --port ${e2ePort}`,
    url: e2eAppURL,
    reuseExistingServer:
      !process.env.CI && !process.env.PW_DISABLE_REUSE_SERVER,
    timeout: 120_000,
    env: {
      BASE_PATH: PAGES_BASE_PATH,
      PUBLIC_SITE_URL: PAGES_SITE_URL,
    },
  },
});
