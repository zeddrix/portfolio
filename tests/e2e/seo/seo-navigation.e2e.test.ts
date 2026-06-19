import { expect, test } from "@playwright/test";
import { PAGES_BASE_PATH, PAGES_SITE_URL } from "../fixtures/pages-env";
import { selectors } from "../fixtures/selectors";
import {
  gotoHome,
  navigateToProjectViaCarousel,
  scrollToTestId,
  setCapabilityLayout,
} from "../fixtures/test-helpers";

test.describe("seo navigation metadata", () => {
  test("Given homepage, when user navigates to Queue project, then canonical and title update", async ({
    page,
  }) => {
    await gotoHome(page);
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      "Zeddrix Fabian Portfolio",
    );
    await navigateToProjectViaCarousel(page, "queue");

    await expect(page).toHaveTitle(/Queue.*Zeddrix Fabian/i);
    const projectCanonical = `${PAGES_SITE_URL}/projects/queue`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      projectCanonical,
    );
    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Queue",
    );
  });

  test("Given homepage approach band, when user opens MERN's Shop, then SEO meta and external links resolve", async ({
    page,
  }) => {
    await gotoHome(page);
    await setCapabilityLayout(page, "sevenBands");
    await scrollToTestId(page, selectors.sections.approach);
    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/merns-shop`),
      page.getByTestId("band-project-link-atdd-merns-shop").click(),
    ]);

    await expect(page).toHaveTitle(/MERN's Shop.*Zeddrix Fabian/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${PAGES_SITE_URL}/projects/merns-shop`,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /electronics|PayPal|Playwright/i,
    );
    await expect(page.getByTestId("project-external-link-0")).toHaveAttribute(
      "href",
      "https://merns-shop.onrender.com/",
    );
    await expect(page.getByTestId("project-external-link-1")).toHaveAttribute(
      "href",
      "https://github.com/zeddrix/merns-shop",
    );
  });

  test("Given homepage billing band, when user opens AnswerIQ, then SEO meta and live demo link resolve", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, selectors.sections.approach);
    await Promise.all([
      page.waitForURL(`**${PAGES_BASE_PATH}/projects/answeriq`),
      page.getByTestId("band-project-link-billing-answeriq").click(),
    ]);

    await expect(page).toHaveTitle(/AnswerIQ.*Zeddrix Fabian/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${PAGES_SITE_URL}/projects/answeriq`,
    );
    await expect(page.getByTestId("project-external-link-0")).toHaveAttribute(
      "href",
      "https://answeriq.io/",
    );
    await expect(page.getByTestId("project-external-link-1")).toHaveCount(0);
  });

  test("Given homepage footer, when user opens certifications, then canonical and title update", async ({
    page,
  }) => {
    await gotoHome(page);
    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await page.getByTestId("footer-certificates-link").click();

    await expect(page).toHaveURL(`${PAGES_SITE_URL}/certificates`);
    await expect(page).toHaveTitle(/Certifications.*Zeddrix Fabian/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${PAGES_SITE_URL}/certificates`,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Udemy|JavaScript/i,
    );
  });

  test("Given certifications index, when user opens MERN certificate, then detail SEO meta resolves", async ({
    page,
  }) => {
    await page.goto(`${PAGES_SITE_URL}/certificates`);
    await page
      .getByTestId("certificate-card-mern-ecommerce-from-scratch")
      .click();

    await expect(page).toHaveTitle(/MERN eCommerce.*Certificate/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${PAGES_SITE_URL}/certificates/mern-ecommerce-from-scratch`,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.getByTestId("certificate-detail-title")).toContainText(
      "MERN",
    );
  });
});
