import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { PAGES_BASE_PATH } from "../e2e/fixtures/pages-env";

const outDir = path.join(
  process.cwd(),
  "reference",
  "screenshots",
  "project-periods",
);

test.describe("project period visual capture", () => {
  test("MERN and Queue detail periods on mobile and desktop", async ({
    page,
  }) => {
    mkdirSync(outDir, { recursive: true });

    const captures = [
      {
        slug: "merns-shop",
        viewport: { width: 390, height: 844 },
        filename: "merns-shop-mobile-period.png",
      },
      {
        slug: "merns-shop",
        viewport: { width: 1280, height: 900 },
        filename: "merns-shop-desktop-period.png",
      },
      {
        slug: "queue",
        viewport: { width: 390, height: 844 },
        filename: "queue-mobile-period.png",
      },
      {
        slug: "queue",
        viewport: { width: 1280, height: 900 },
        filename: "queue-desktop-period.png",
      },
    ] as const;

    for (const capture of captures) {
      await page.setViewportSize(capture.viewport);
      await page.goto(`${PAGES_BASE_PATH}/projects/${capture.slug}`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.getByTestId("project-detail-period")).toBeVisible();
      await expect(page.getByTestId("project-detail-period")).toContainText(
        "2026",
      );
      await page.getByTestId("project-detail-period").screenshot({
        path: path.join(outDir, capture.filename),
      });
    }
  });
});
