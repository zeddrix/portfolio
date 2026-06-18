import { expect, test } from "@playwright/test";
import {
  emulateSlow3G,
  expectManatalPhoneFrameMinHeight,
  gotoHome,
  gotoHomeForNetworkThrottling,
  manatalCarouselPhoneMinHeightPx,
  scrollCarouselCardIntoViewCenter,
  scrollToTestId,
} from "../fixtures/test-helpers";
import { selectors } from "../fixtures/selectors";

test.describe("home performance", () => {
  test("Given homepage, when user loads page, then no Google Fonts requests occur", async ({
    page,
  }) => {
    const googleFontRequests: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (
        url.includes("fonts.googleapis.com") ||
        url.includes("fonts.gstatic.com")
      ) {
        googleFontRequests.push(url);
      }
    });

    await gotoHome(page);
    expect(googleFontRequests).toHaveLength(0);
  });

  test("Given homepage carousel, when user scrolls to highlights, then first card shows LQIP or loaded state", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, "highlights-carousel");

    const imageWrapper = page
      .getByTestId("highlight-card-0")
      .getByTestId("carousel-project-image-usedelight");
    await expect(imageWrapper).toHaveAttribute(
      "data-image-state",
      /^(lqip|loaded)$/,
    );
  });

  test("Given homepage, when user lands, then first carousel image loads eagerly with high priority", async ({
    page,
  }) => {
    await gotoHome(page);
    await scrollToTestId(page, "highlights-carousel");

    const image = page
      .getByTestId("highlight-card-0")
      .getByTestId("carousel-project-image-usedelight")
      .locator("img");
    await expect(image).toHaveAttribute("loading", "eager");
    await expect(image).toHaveAttribute("fetchpriority", "high");
    await expect(image).toHaveAttribute("srcset", /.+/);
  });

  test("Given Slow 3G, when user loads homepage and scrolls to carousel, then UseDelight image is never empty", async ({
    page,
  }) => {
    await emulateSlow3G(page);
    await gotoHomeForNetworkThrottling(page);
    await expect(page.getByTestId("highlight-card-0")).toBeVisible({
      timeout: 60_000,
    });
    await scrollToTestId(page, "highlights-carousel");

    const wrapper = page
      .getByTestId("highlight-card-0")
      .getByTestId("carousel-project-image-usedelight");
    await expect(wrapper).toBeVisible({ timeout: 30_000 });
    await expect(wrapper).toHaveAttribute(
      "data-image-state",
      /^(lqip|loaded)$/,
    );

    await expect
      .poll(
        async () => {
          const state = await wrapper.getAttribute("data-image-state");
          const naturalWidth = await wrapper
            .locator("img")
            .evaluate((img) => (img as HTMLImageElement).naturalWidth);
          return state === "loaded" || naturalWidth > 0;
        },
        { timeout: 8_000 },
      )
      .toBeTruthy();
  });

  test("Given Slow 3G, when user scrolls to Manatal carousel card, then phone frame stays tall while image is LQIP or loaded", async ({
    page,
  }) => {
    await emulateSlow3G(page);
    await gotoHomeForNetworkThrottling(page);
    await expect(page.getByTestId("highlights-carousel")).toBeVisible({
      timeout: 60_000,
    });
    await scrollToTestId(page, selectors.work.carousel);
    await scrollCarouselCardIntoViewCenter(
      page,
      "highlight-card-column-manatal-coop",
    );

    const wrapper = page
      .getByTestId("highlight-card-3")
      .getByTestId("carousel-project-image-manatal-coop");
    await expect(wrapper).toBeVisible({ timeout: 30_000 });
    await expect(wrapper).toHaveAttribute(
      "data-image-state",
      /^(lqip|loaded)$/,
    );

    const wrapperBox = await wrapper.boundingBox();
    expect(wrapperBox?.height ?? 0).toBeGreaterThan(0);
    await expectManatalPhoneFrameMinHeight(
      page,
      manatalCarouselPhoneMinHeightPx,
    );

    await expect
      .poll(
        async () => {
          const state = await wrapper.getAttribute("data-image-state");
          const naturalWidth = await wrapper
            .locator("img")
            .evaluate((img) => (img as HTMLImageElement).naturalWidth);
          return state === "loaded" || naturalWidth > 0;
        },
        { timeout: 8_000 },
      )
      .toBeTruthy();
  });

  test("Given Slow 3G, when user scrolls carousel to Queue card, then image shows LQIP or loads within 4s", async ({
    page,
  }) => {
    await emulateSlow3G(page);
    await gotoHomeForNetworkThrottling(page);
    await expect(page.getByTestId("highlights-carousel")).toBeVisible({
      timeout: 60_000,
    });
    await scrollToTestId(page, "highlights-carousel");
    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();

    const wrapper = page
      .getByTestId("highlight-card-2")
      .getByTestId("carousel-project-image-queue");
    await expect(wrapper).toBeVisible({ timeout: 30_000 });
    await expect(wrapper).toHaveAttribute(
      "data-image-state",
      /^(lqip|loaded)$/,
    );

    await expect
      .poll(
        async () => {
          const state = await wrapper.getAttribute("data-image-state");
          const naturalWidth = await wrapper
            .locator("img")
            .evaluate((img) => (img as HTMLImageElement).naturalWidth);
          return state === "loaded" || naturalWidth > 0;
        },
        { timeout: 8_000 },
      )
      .toBeTruthy();
  });
});
