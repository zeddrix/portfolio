import { expect, test } from "@playwright/test";
import { projects } from "../../../src/lib/data/portfolio";
import { pagesPath } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";

test.describe("project all slugs matrix", () => {
  for (const project of projects) {
    test(`Given slug ${project.slug}, when user opens project route, then detail title matches portfolio data`, async ({
      page,
    }) => {
      await page.goto(pagesPath(`/projects/${project.slug}`));

      await expect(page.getByTestId("project-detail-title")).toContainText(
        project.name,
      );
      await expect(page.getByTestId("project-detail-tech-stack")).toBeVisible();
      await expect(page.getByTestId("project-detail-back-link")).toBeVisible();
    });
  }

  test("Given unknown slug, when user opens invalid route, then not-found state renders", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/does-not-exist"));
    await expect(page.getByTestId(selectors.project.notFound)).toBeVisible();
    await expect(
      page.getByTestId(selectors.project.notFoundHome),
    ).toBeVisible();
  });
});
