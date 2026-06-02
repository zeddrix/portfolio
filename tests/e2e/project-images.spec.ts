import { expect, test } from "@playwright/test";

test.describe("project image mapping", () => {
  test("Given homepage cards, when user inspects media, then mapped static images are rendered", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("project-card-queue").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("project-image-queue")).toHaveAttribute(
      "src",
      /queue-dashboard\.png/,
    );

    await page.getByTestId("project-card-jw-tabs").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("project-image-jw-tabs")).toHaveAttribute(
      "src",
      /jwtabs-homepage\.png/,
    );

    await page.getByTestId("project-card-usedelight").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("project-image-usedelight")).toHaveAttribute(
      "src",
      /usedelight-landing-website\.png/,
    );

    await page
      .getByTestId("project-card-adverio-tools")
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByTestId("project-image-adverio-tools"),
    ).toHaveAttribute("src", /adverio-tools\.png/);
    await expect(
      page.getByTestId("project-image-adverio-tools"),
    ).toHaveAttribute("alt", /Adverio Tools/i);
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
