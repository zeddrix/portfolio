import { expect, test } from "@playwright/test";

test.describe("homepage projects", () => {
  test("Given homepage, when user explores highlight carousel and overview sections, then ordered highlights and grouped projects are visible", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByTestId("highlights-carousel").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("highlight-card-0")).toContainText(
      "UseDelight",
    );
    await expect(page.getByTestId("highlight-card-1")).toContainText(
      "Adverio Tools",
    );
    await expect(page.getByTestId("highlight-card-2")).toContainText("Queue");
    await expect(page.getByTestId("highlight-card-3")).toContainText("JW Tabs");
    await expect(page.getByTestId("highlight-card-4")).toContainText("Iaso");

    await page
      .getByTestId("projects-overview-section")
      .scrollIntoViewIfNeeded();
    await expect(page.getByTestId("my-projects-group")).toBeVisible();
    await expect(page.getByTestId("my-projects-group")).toContainText("Queue");
    await expect(page.getByTestId("my-projects-group")).toContainText(
      "JW Tabs",
    );
    await expect(page.getByTestId("my-projects-group")).toContainText("Iaso");

    await page.getByTestId("client-projects-group").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("client-projects-group")).toContainText(
      "UseDelight",
    );
    await expect(page.getByTestId("client-projects-group")).toContainText(
      "Adverio Tools",
    );
    await expect(page.getByTestId("client-projects-group")).toContainText(
      "TrulyHappy",
    );
    await expect(page.getByTestId("client-projects-group")).toContainText(
      "Articulearn",
    );
  });
});
