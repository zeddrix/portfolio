import { expect, test } from "@playwright/test";

test.describe("project image mapping", () => {
  test("Given homepage cards, when user inspects media, then mapped static images are rendered", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("highlights-carousel").scrollIntoViewIfNeeded();

    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();
    await expect(
      page
        .getByTestId("highlight-card-2")
        .getByTestId("carousel-project-image-queue"),
    ).toHaveAttribute("src", /queue-1-dashboard\.png/);

    await page.getByTestId("highlight-card-3").scrollIntoViewIfNeeded();
    await expect(
      page
        .getByTestId("highlight-card-3")
        .getByTestId("carousel-project-image-jw-tabs"),
    ).toHaveAttribute("src", /jw-tabs-1-homepage\.png/);

    await page.getByTestId("highlight-card-0").scrollIntoViewIfNeeded();
    await expect(
      page
        .getByTestId("highlight-card-0")
        .getByTestId("carousel-project-image-usedelight"),
    ).toHaveAttribute("src", /usedelight-1-new-tab\.png/);

    await page.getByTestId("highlight-card-1").scrollIntoViewIfNeeded();
    await expect(
      page
        .getByTestId("highlight-card-1")
        .getByTestId("carousel-project-image-adverio-tools"),
    ).toHaveAttribute("src", /adverio-tools-1-overview\.png/);
    await expect(
      page
        .getByTestId("highlight-card-1")
        .getByTestId("carousel-project-image-adverio-tools"),
    ).toHaveAttribute("alt", /Adverio Tools/i);
  });

  test("Given multi-image highlight cards, when carousel advances, then image source transitions", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();

    const queueImage = page
      .getByTestId("highlight-card-2")
      .getByTestId("carousel-project-image-queue")
      .first();
    const firstSrc = await queueImage.getAttribute("src");
    await expect(queueImage).toHaveAttribute("data-transition-state", "active");

    await expect
      .poll(async () => queueImage.getAttribute("src"))
      .not.toBe(firstSrc);
  });

  test("Given a project detail page, when user views gallery, then slug media matches mapped assets", async ({
    page,
  }) => {
    await page.goto("/projects/adverio-tools");

    await expect(page.getByTestId("project-detail-title")).toContainText(
      "Adverio Tools",
    );
    await expect(page.getByTestId("project-detail-hero-image")).toHaveAttribute(
      "src",
      /adverio-tools-1-overview\.png/,
    );
    await expect(
      page.getByTestId("project-detail-gallery-image-1"),
    ).toHaveAttribute("src", /adverio-tools-2-forecasting\.png/);
  });

  test("Given UseDelight detail page, when user views gallery, then updated static assets are rendered", async ({
    page,
  }) => {
    await page.goto("/projects/usedelight");

    await expect(page.getByTestId("project-detail-hero-image")).toHaveAttribute(
      "src",
      /usedelight-1-new-tab\.png/,
    );
    await expect(
      page.getByTestId("project-detail-gallery-image-4"),
    ).toHaveAttribute("src", /usedelight-5-subscription\.png/);
  });
});
