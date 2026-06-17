import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: [
      "src/**/*.test.ts",
      "scripts/**/*.test.ts",
      "tests/unit/**/*.test.ts",
      "**/tests/unit/**/*.test.ts",
    ],
    exclude: ["tests/e2e/**", "tests/visual/**", "node_modules/**", "dist/**"],
  },
});
