import { describe, expect, it } from "vitest";
import {
  capabilityBands,
  caseStudyProjectSlugs,
  clientProjectCount,
  getBandsForProject,
  getProjectBySlug,
  getProjectsForWorkFilter,
  highlightProjectSlugs,
  highlightProjects,
  isPortfolioProjectVisible,
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

    expect(adverio?.primaryImage).toBe("/adverio-tools-1-overview.webp");
    expect(adverio?.galleryImages).toContain(
      "/adverio-tools-2-forecasting.webp",
    );
    expect(usedelight?.primaryImage).toBe("/usedelight-1-new-tab.webp");
    expect(usedelight?.galleryImages).toContain(
      "/usedelight-5-subscription.webp",
    );
    expect(queue?.primaryImage).toBe("/queue-1-dashboard.webp");
    expect(queue?.galleryImages).toContain("/chatbot-start.webp");
    expect(queue?.galleryImages).toContain(
      "/chatbot-placement-in-full-dashboard.webp",
    );
    expect(jwTabs?.primaryImage).toBe("/jw-tabs-1-homepage.webp");
  });

  it("maps chatbot capability band to hybrid carousel visuals", () => {
    const chatbotBand = capabilityBands.find((band) => band.id === "chatbot");

    expect(chatbotBand?.visual.type).toBe("hybrid");
    expect(chatbotBand?.visual.imageLayout).toBe("carousel");
    expect(chatbotBand?.visual.images).toEqual([
      "/chatbot-start.webp",
      "/chatbot-placement-in-full-dashboard.webp",
    ]);
    expect(chatbotBand?.visual.badges).toEqual(["Groq", "Anthropic Claude"]);
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
      "answeriq",
    ]);
  });

  it("exposes highlight carousel slugs with AnswerIQ after MERN's Shop", () => {
    expect(highlightProjectSlugs).toEqual([
      "usedelight",
      "adverio-tools",
      "queue",
      "jw-tabs",
      "merns-shop",
      "answeriq",
    ]);
  });

  it("keeps hidden projects out of highlight carousel", () => {
    const iaso = getProjectBySlug("iaso");
    expect(iaso?.hiddenFromPortfolio).toBe(true);
    expect([...highlightProjectSlugs]).not.toContain("iaso");
  });

  it("ships ten portfolio projects total", () => {
    expect(projects.length).toBe(10);
  });

  it("returns MERN's Shop project with mapped assets and bands", () => {
    const project = getProjectBySlug("merns-shop");

    expect(project?.name).toBe("MERN's Shop");
    expect(project?.status).toBe("live");
    expect(project?.techStack).toContain("React");
    expect(project?.primaryImage).toBe("/merns-shop-1-homepage.webp");
    expect(project?.galleryImages).toContain("/merns-shop-2-product.webp");
    expect(project?.galleryImages).toContain("/merns-shop-4-checkout.webp");
    expect(project?.galleryImages).toContain("/atdd-playwright-e2e.webp");
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

  it("returns AnswerIQ project with mapped assets and bands", () => {
    const project = getProjectBySlug("answeriq");

    expect(project?.name).toBe("AnswerIQ");
    expect(project?.category).toBe("client");
    expect(project?.role).toBe("Full-stack contributor");
    expect(project?.status).toBe("live");
    expect(project?.techStack).toContain("React");
    expect(project?.techStack).toContain("PostgreSQL");
    expect(project?.techStack).toContain("Stripe");
    expect(project?.techStack).toContain("OpenAI");
    expect(project?.techStack).toContain("Recharts");
    expect(project?.primaryImage).toBe("/answeriq-1-dashboard.webp");
    expect(project?.galleryImages).toContain("/answeriq-2-articles.webp");
    expect(project?.galleryImages).toContain("/answeriq-6-admin-users.webp");
    expect(project?.links).toEqual([
      expect.objectContaining({
        label: "Live demo",
        url: "https://answeriq.io/",
      }),
    ]);

    const bandIds = getBandsForProject("answeriq").map((band) => band.id);

    expect(bandIds).toContain("fullstack");
    expect(bandIds).toContain("billing");
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
    expect(clientOnly.every(isPortfolioProjectVisible)).toBe(true);
    expect(getProjectsForWorkFilter("all").some((p) => p.slug === "iaso")).toBe(
      false,
    );
  });

  it("excludes hidden projects from highlight carousel list", () => {
    expect(highlightProjects.some((project) => project.slug === "iaso")).toBe(
      false,
    );
  });
});
