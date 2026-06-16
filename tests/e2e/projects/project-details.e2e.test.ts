import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH, pagesPath } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";
import {
  gotoHome,
  navigateToProjectViaCarousel,
  scrollToTestId,
} from "../fixtures/test-helpers";

test.describe("project details routing", () => {
  test("Given homepage carousel, when user opens Queue showcase, then detail page shows metadata and stack", async ({
    page,
  }) => {
    await gotoHome(page);
    await navigateToProjectViaCarousel(page, "queue");

    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
    await expect(page.getByTestId("project-detail-role")).toContainText(
      "Sole builder",
    );
    await expect(
      page.getByTestId("project-detail-related-capabilities"),
    ).toContainText("PWA");
    await expect(page.getByTestId("project-detail-tech-stack")).toContainText(
      "SvelteKit",
    );
  });

  test("Given approach section, when user opens band project link, then detail page loads", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, selectors.sections.approach);
    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/queue`),
      page.getByTestId("band-project-link-pwa-queue").click(),
    ]);
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
  });

  test("Given carousel showcase, when user opens MERN's Shop, then detail shows ATDD capabilities", async ({
    page,
  }) => {
    await gotoHome(page);
    await navigateToProjectViaCarousel(page, "merns-shop");
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "MERN's Shop",
    );
    await expect(
      page.getByTestId("project-detail-related-capabilities"),
    ).toContainText("Acceptance-test-driven development");
  });

  test("Given carousel showcase, when user opens Queue, then detail page loads", async ({
    page,
  }) => {
    await gotoHome(page);
    await navigateToProjectViaCarousel(page, "queue");
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
  });

  test("Given carousel showcase, when user opens MERN's Shop, then detail loads with React stack", async ({
    page,
  }) => {
    await gotoHome(page);
    await navigateToProjectViaCarousel(page, "merns-shop");
    await expect(page.getByTestId("project-detail-tech-stack")).toContainText(
      "React",
    );
  });

  test("Given carousel showcase, when user opens AnswerIQ, then detail shows billing and admin capabilities", async ({
    page,
  }) => {
    await gotoHome(page);
    await navigateToProjectViaCarousel(page, "answeriq");
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "AnswerIQ",
    );
    await expect(
      page.getByTestId("project-detail-related-capabilities"),
    ).toContainText("Billing integration");
    await expect(
      page.getByTestId("project-detail-related-capabilities"),
    ).toContainText("Admin Dashboard");
  });

  test("Given carousel showcase, when user opens AnswerIQ, then detail loads with Stripe stack", async ({
    page,
  }) => {
    await gotoHome(page);
    await navigateToProjectViaCarousel(page, "answeriq");
    await expect(page.getByTestId("project-detail-tech-stack")).toContainText(
      "Stripe",
    );
    await expect(page.getByTestId("project-detail-tech-stack")).toContainText(
      "PostgreSQL",
    );
  });

  test("Given project detail, when user clicks back link, then homepage hero is visible", async ({
    page,
  }) => {
    await gotoHome(page);
    await navigateToProjectViaCarousel(page, "queue");
    await page.getByTestId("project-detail-back-link").click();
    await page.waitForURL(new RegExp(`${PAGES_BASE_PATH}/?$`));
    await expect(page.getByTestId(selectors.hero.title)).toBeVisible();
  });

  test("Given hidden iaso slug, when user opens direct project URL, then detail page still loads", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/iaso"));
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Iaso",
    );
    await expect(page.getByTestId("project-detail-type")).toContainText(
      "Concept",
    );
  });

  test("Given unknown slug, when route loads and user returns home, then not found and homepage resolve", async ({
    page,
  }) => {
    await page.goto(pagesPath("/projects/non-existent"));

    await expect(page.getByTestId(selectors.project.notFound)).toBeVisible();
    await page.getByTestId(selectors.project.notFoundHome).click();
    await page.waitForURL(new RegExp(`${PAGES_BASE_PATH}/?$`));
    await expect(page.getByTestId(selectors.hero.title)).toBeVisible();
  });
});
