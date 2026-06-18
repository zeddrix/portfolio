import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import {
  APPLICATION_RESUME_LAYOUTS,
  APPLICATION_RESUME_LAYOUT_CONFIG,
} from "../../scripts/application-resume-config";

const outDir = path.join(
  process.cwd(),
  "reference",
  "screenshots",
  "resumes",
  "variants",
);

test.describe("application resume variant visual capture", () => {
  for (const layout of APPLICATION_RESUME_LAYOUTS) {
    test(`${layout} page checkpoints`, async ({ page }) => {
      mkdirSync(outDir, { recursive: true });

      const resumeHtmlPath = path.join(
        process.cwd(),
        "resume",
        "variants",
        layout,
        "resume-application.html",
      );
      const targetPageCount =
        APPLICATION_RESUME_LAYOUT_CONFIG[layout].targetPageCount;

      await page.setViewportSize({ width: 816, height: 1056 });
      await page.goto(`file://${resumeHtmlPath}`, { waitUntil: "load" });
      await page.getByTestId("resume-page-1").waitFor({ state: "visible" });

      await page.getByTestId("resume-page-1").screenshot({
        path: path.join(outDir, `${layout}-page-1.png`),
      });

      if (layout === "refined-lorna") {
        await page.getByTestId("resume-page-1-sidebar").screenshot({
          path: path.join(outDir, `${layout}-rail.png`),
        });

        await page.getByTestId("resume-main").screenshot({
          path: path.join(outDir, `${layout}-main.png`),
        });
      }

      if (targetPageCount === 2) {
        await page.getByTestId("resume-page-2").screenshot({
          path: path.join(outDir, `${layout}-page-2.png`),
        });
      }
    });
  }
});
