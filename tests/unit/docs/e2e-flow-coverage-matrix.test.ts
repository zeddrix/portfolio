import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const MATRIX = path.resolve("docs/e2e-flow-coverage-matrix.md");
const E2E_ROOT = path.resolve("tests/e2e");

function listE2eSpecFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "fixtures") continue;
      results.push(...listE2eSpecFiles(full));
    } else if (entry.name.endsWith(".e2e.test.ts")) {
      results.push(path.relative(process.cwd(), full).replace(/\\/g, "/"));
    }
  }
  return results;
}

describe("e2e-flow-coverage-matrix.md", () => {
  it("lists every E2E spec file with required columns", () => {
    expect(fs.existsSync(MATRIX)).toBe(true);
    const content = fs.readFileSync(MATRIX, "utf8");
    expect(content).toContain("MinActions");
    expect(content).toContain("BranchesCovered");
    expect(content).toContain("JourneyTier");

    const specs = listE2eSpecFiles(E2E_ROOT);
    for (const spec of specs) {
      expect(content).toContain(spec);
    }
  });

  it("passes prettier format:check so CI quality gate stays green", () => {
    expect(() => {
      execSync(`pnpm exec prettier --check "${MATRIX}"`, {
        cwd: process.cwd(),
        stdio: "pipe",
      });
    }).not.toThrow();
  });
});
