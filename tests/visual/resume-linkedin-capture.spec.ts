import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "reference", "screenshots", "resumes");
const resumeHtmlPath = path.join(
  process.cwd(),
  "resume",
  "resume-linkedin.html",
);

test.describe("linkedin resume visual capture", () => {
  test("top and mid-scroll checkpoints", async ({ page }) => {
    mkdirSync(outDir, { recursive: true });

    await page.setViewportSize({ width: 816, height: 1056 });
    await page.goto(`file://${resumeHtmlPath}`, { waitUntil: "load" });
    await page
      .getByTestId("resume-linkedin-body")
      .waitFor({ state: "visible" });

    await page.screenshot({
      path: path.join(outDir, "linkedin-top.png"),
      fullPage: false,
    });

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.screenshot({
      path: path.join(outDir, "linkedin-mid.png"),
      fullPage: false,
    });
  });
});
