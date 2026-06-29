import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import {
  COMPLETE_RESUME_HTML_FILE,
  OPTIMIZED_RESUME_HTML_FILE,
} from "../../scripts/generate-resume";

const outDir = path.join(process.cwd(), "reference", "screenshots", "resumes");
const completeResumeHtmlPath = path.join(
  process.cwd(),
  "resume",
  COMPLETE_RESUME_HTML_FILE,
);
const optimizedResumeHtmlPath = path.join(
  process.cwd(),
  "resume",
  OPTIMIZED_RESUME_HTML_FILE,
);

async function captureResumeVariant(
  page: import("@playwright/test").Page,
  resumeHtmlPath: string,
  outputPrefix: string,
) {
  await page.goto(`file://${resumeHtmlPath}`, { waitUntil: "load" });
  await page.getByTestId("resume-page-1").waitFor({ state: "visible" });
  await page.getByTestId("resume-page-1-sidebar").waitFor({ state: "visible" });

  await page.getByTestId("resume-page-1").screenshot({
    path: path.join(outDir, `${outputPrefix}-page-1.png`),
  });

  await page.getByTestId("resume-page-1-sidebar").screenshot({
    path: path.join(outDir, `${outputPrefix}-page-1-rail.png`),
  });

  await page
    .getByTestId("resume-sidebar-ribbon-professional-development")
    .screenshot({
      path: path.join(
        outDir,
        `${outputPrefix}-sidebar-ribbon-professional-development.png`,
      ),
    });

  await page.getByTestId("resume-main").screenshot({
    path: path.join(outDir, `${outputPrefix}-page-1-main.png`),
  });

  await page.getByTestId("resume-page-2").screenshot({
    path: path.join(outDir, `${outputPrefix}-page-2.png`),
  });

  await page.getByTestId("resume-client-projects").screenshot({
    path: path.join(outDir, `${outputPrefix}-page-2-client.png`),
  });

  await page.getByTestId("resume-personal-projects").screenshot({
    path: path.join(outDir, `${outputPrefix}-page-2-personal.png`),
  });
}

test.describe("application resume visual capture", () => {
  test("captures complete and optimized variants", async ({ page }) => {
    mkdirSync(outDir, { recursive: true });

    await page.setViewportSize({ width: 816, height: 1056 });
    await captureResumeVariant(page, completeResumeHtmlPath, "complete");
    await captureResumeVariant(page, optimizedResumeHtmlPath, "optimized");
    await page.getByTestId("resume-page-1").screenshot({
      path: path.join(outDir, "application-page-1.png"),
    });
  });
});
