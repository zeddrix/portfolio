import { describe, expect, it } from "vitest";
import { getProjectBySlug, projects } from "./portfolio";

describe("portfolio data", () => {
  it("returns known project by slug", () => {
    const project = getProjectBySlug("queue");

    expect(project?.name).toBe("Queue");
    expect(project?.techStack).toContain("SvelteKit");
  });

  it("returns undefined for unknown slug", () => {
    const project = getProjectBySlug("unknown-slug");
    expect(project).toBeUndefined();
  });

  it("contains mapped static images for client showcases", () => {
    const adverio = getProjectBySlug("adverio-tools");
    const usedelight = getProjectBySlug("usedelight");
    const queue = getProjectBySlug("queue");
    const jwTabs = getProjectBySlug("jw-tabs");

    expect(adverio?.primaryImage).toBe("/adverio-tools.png");
    expect(adverio?.galleryImages).toContain("/adverio-forecasting.png");
    expect(usedelight?.primaryImage).toBe("/usedelight-landing-website.png");
    expect(queue?.primaryImage).toBe("/queue-dashboard.png");
    expect(jwTabs?.primaryImage).toBe("/jwtabs-homepage.png");
  });

  it("contains at least one personal and one client project", () => {
    const personalCount = projects.filter(
      (project) => project.category === "personal",
    ).length;
    const clientCount = projects.filter(
      (project) => project.category === "client",
    ).length;

    expect(personalCount).toBeGreaterThan(0);
    expect(clientCount).toBeGreaterThan(0);
  });
});
