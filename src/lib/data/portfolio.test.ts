import { describe, expect, it } from "vitest";
import {
  caseStudyProjectSlugs,
  clientProjectCount,
  getBandsForProject,
  getProjectBySlug,
  getProjectsForWorkFilter,
  highlightProjectSlugs,
  personalProjectCount,
  projects,
} from "./portfolio";

describe("portfolio data", () => {
  it("returns known project by slug", () => {
    const project = getProjectBySlug("queue");

    expect(project?.name).toBe("Queue");
    expect(project?.techStack).toContain("SvelteKit");
    expect(project?.status).toBe("live");
    expect(project?.role).toBe("Sole builder");
  });

  it("returns undefined for unknown slug", () => {
    const project = getProjectBySlug("unknown-slug");
    expect(project).toBeUndefined();
  });

  it("contains mapped static images for showcases", () => {
    const adverio = getProjectBySlug("adverio-tools");
    const usedelight = getProjectBySlug("usedelight");
    const queue = getProjectBySlug("queue");
    const jwTabs = getProjectBySlug("jw-tabs");

    expect(adverio?.primaryImage).toBe("/adverio-tools-1-overview.png");
    expect(adverio?.galleryImages).toContain(
      "/adverio-tools-2-forecasting.png",
    );
    expect(usedelight?.primaryImage).toBe("/usedelight-1-new-tab.png");
    expect(usedelight?.galleryImages).toContain(
      "/usedelight-5-subscription.png",
    );
    expect(queue?.primaryImage).toBe("/queue-1-dashboard.png");
    expect(jwTabs?.primaryImage).toBe("/jw-tabs-1-homepage.png");
  });

  it("contains at least one personal and one client project", () => {
    expect(personalProjectCount).toBeGreaterThan(0);
    expect(clientProjectCount).toBeGreaterThan(0);
    expect(projects.length).toBe(personalProjectCount + clientProjectCount);
  });

  it("exposes case study slugs in carousel order", () => {
    expect(caseStudyProjectSlugs).toEqual([
      "usedelight",
      "adverio-tools",
      "queue",
      "merns-shop",
    ]);
  });

  it("exposes highlight carousel slugs with MERN's Shop after JW Tabs", () => {
    expect(highlightProjectSlugs).toEqual([
      "usedelight",
      "adverio-tools",
      "queue",
      "jw-tabs",
      "merns-shop",
      "iaso",
    ]);
  });

  it("ships nine portfolio projects total", () => {
    expect(projects.length).toBe(9);
  });

  it("returns MERN's Shop project with mapped assets and bands", () => {
    const project = getProjectBySlug("merns-shop");

    expect(project?.name).toBe("MERN's Shop");
    expect(project?.status).toBe("live");
    expect(project?.techStack).toContain("React");
    expect(project?.primaryImage).toBe("/merns-shop-1-homepage.png");
    expect(project?.galleryImages).toContain("/merns-shop-2-product.png");
    expect(project?.galleryImages).toContain("/merns-shop-4-checkout.png");
    expect(project?.galleryImages).toContain("/atdd-playwright-e2e.png");
    expect(project?.links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Live demo",
          url: "https://merns-shop.onrender.com/",
        }),
        expect.objectContaining({
          label: "Source",
          url: "https://github.com/zeddrix/merns-shop",
        }),
      ]),
    );

    const bandIds = getBandsForProject("merns-shop").map((band) => band.id);

    expect(bandIds).toContain("fullstack");
    expect(bandIds).toContain("pwa");
    expect(bandIds).toContain("admin-dashboard");
    expect(bandIds).toContain("deployment");
    expect(bandIds).toContain("atdd");
    expect(bandIds).toContain("docker");
  });

  it("returns capability bands related to a project", () => {
    const bands = getBandsForProject("queue");
    const bandIds = bands.map((band) => band.id);

    expect(bandIds).toContain("pwa");
    expect(bandIds).toContain("billing");
  });

  it("filters projects for work section", () => {
    const clientOnly = getProjectsForWorkFilter("client");
    expect(clientOnly.every((project) => project.category === "client")).toBe(
      true,
    );
  });
});
