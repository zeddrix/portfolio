import { expect, test } from "@playwright/test";

test.describe("project image mapping", () => {
  test("Given homepage cards, when user inspects media, then mapped static images are rendered", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("highlights-carousel").scrollIntoViewIfNeeded();

    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("project-image-queue")).toHaveAttribute(
      "src",
      /queue-dashboard\.png/,
    );
    await expect(page.getByTestId("project-image-queue")).toHaveClass(
      /object-contain/,
    );

    await page.getByTestId("highlight-card-3").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("project-image-jw-tabs")).toHaveAttribute(
      "src",
      /jwtabs-homepage\.png/,
    );

    await page.getByTestId("highlight-card-0").scrollIntoViewIfNeeded();
    await expect(
      page
        .getByTestId("highlight-card-0")
        .getByTestId("project-image-usedelight"),
    ).toHaveAttribute("src", /usedelight-landing-website\.png/);

    await page.getByTestId("highlight-card-1").scrollIntoViewIfNeeded();
    await expect(
      page
        .getByTestId("highlight-card-1")
        .getByTestId("project-image-adverio-tools"),
    ).toHaveAttribute("src", /adverio-tools\.png/);
    await expect(
      page
        .getByTestId("highlight-card-1")
        .getByTestId("project-image-adverio-tools"),
    ).toHaveAttribute("alt", /Adverio Tools/i);
  });

  test("Given multi-image highlight cards, when 2 seconds elapse, then image source transitions smoothly", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("highlight-card-2").scrollIntoViewIfNeeded();

    const queueImage = page.getByTestId("project-image-queue");
    const firstSrc = await queueImage.getAttribute("src");
    await expect(queueImage).toHaveAttribute("data-transition-state", "active");

    await page.waitForTimeout(2500);

    const secondSrc = await queueImage.getAttribute("src");
    expect(secondSrc).not.toBe(firstSrc);
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
      /adverio-tools\.png/,
    );
    await expect(
      page.getByTestId("project-detail-gallery-image-1"),
    ).toHaveAttribute("src", /adverio-forecasting\.png/);
  });
});
