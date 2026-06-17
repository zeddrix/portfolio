import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "reference", "screenshots", "resumes");
const resumeHtmlPath = path.join(
  process.cwd(),
  "resume",
  "resume-application.html",
);

test.describe("application resume visual capture", () => {
  test("page one and page two checkpoints", async ({ page }) => {
    mkdirSync(outDir, { recursive: true });

    await page.setViewportSize({ width: 816, height: 1056 });
    await page.goto(`file://${resumeHtmlPath}`, { waitUntil: "load" });
    await page.getByTestId("resume-page-1").waitFor({ state: "visible" });
    await page
      .getByTestId("resume-skills-footer-note")
      .waitFor({ state: "visible" });

    await page.getByTestId("resume-page-1").screenshot({
      path: path.join(outDir, "application-page-1.png"),
    });

    await page.getByTestId("resume-page-1-sidebar").screenshot({
      path: path.join(outDir, "application-page-1-rail.png"),
    });

    await page.getByTestId("resume-main").screenshot({
      path: path.join(outDir, "application-page-1-main.png"),
    });

    await page.getByTestId("resume-page-2").screenshot({
      path: path.join(outDir, "application-page-2.png"),
    });
  });
});
