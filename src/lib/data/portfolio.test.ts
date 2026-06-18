import { describe, expect, it } from "vitest";
import {
  capabilityBands,
  carouselProjects,
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
import { getProjectTypeLabel } from "$lib/utils/portfolio-display";

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
    expect(queue?.galleryImages).toEqual([
      "/queue-2-analytics.webp",
      "/queue-3-events.webp",
      "/queue-4-listings.webp",
    ]);
    expect(queue?.galleryImages).not.toContain("/chatbot-start.webp");
    expect(queue?.galleryImages).not.toContain(
      "/chatbot-placement-in-full-dashboard.webp",
    );
    expect(jwTabs?.primaryImage).toBe("/jw-tabs-1-homepage.webp");
  });

  it("maps chatbot capability band to hybrid carousel visuals", () => {
    const chatbotBand = capabilityBands.find((band) => band.id === "chatbot");

    expect(chatbotBand?.visual.type).toBe("hybrid");
    expect(chatbotBand?.visual.imageLayout).toBe("carousel");
    expect(chatbotBand?.visual.slides?.map((slide) => slide.src)).toEqual([
      "/manatal-coop-chatbot.webp",
      "/chatbot-placement-in-full-dashboard.webp",
    ]);
    expect(chatbotBand?.visual.slides?.[0]?.frame).toBe("phone");
    expect(chatbotBand?.visual.slides?.[0]?.domain).toBe("manatalcoop.app");
    expect(chatbotBand?.visual.slides?.[1]?.frame).toBe("browser");
    expect(chatbotBand?.relatedProjectSlugs).toContain("manatal-coop");
    expect(chatbotBand?.visual.badges).toEqual(["Groq", "Anthropic Claude"]);
  });

  it("maps billing capability band to PayPal and MERN's Shop", () => {
    const billingBand = capabilityBands.find((band) => band.id === "billing");

    expect(billingBand?.description).toContain("PayPal");
    expect(billingBand?.relatedProjectSlugs).toContain("merns-shop");
    expect(billingBand?.highlights).toContain("PayPal");
    expect(billingBand?.highlights).toContain("MERN's Shop");
    expect(billingBand?.visual.type).toBe("hybrid");
    expect(billingBand?.visual.imageLayout).toBe("carousel");
    expect(billingBand?.visual.slides?.map((slide) => slide.src)).toEqual([
      "/lemonsqueezy-dashboard.webp",
      "/merns-shop-4-checkout.webp",
    ]);
    expect(
      billingBand?.visual.slides?.every((slide) => slide.frame === "browser"),
    ).toBe(true);
    expect(billingBand?.visual.badges).toEqual([
      "Stripe",
      "Lemon Squeezy",
      "PayPal",
    ]);
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
      "manatal-coop",
      "merns-shop",
      "jw-tabs",
      "answeriq",
    ]);
  });

  it("keeps hidden projects out of highlight carousel", () => {
    const iaso = getProjectBySlug("iaso");
    expect(iaso?.hiddenFromPortfolio).toBe(true);
    expect([...highlightProjectSlugs]).not.toContain("iaso");
  });

  it("ships eleven portfolio projects total", () => {
    expect(projects.length).toBe(11);
  });

  it("assigns displayPeriod to every visible portfolio project", () => {
    const visible = projects.filter((project) => !project.hiddenFromPortfolio);

    for (const project of visible) {
      expect(project.displayPeriod, project.slug).toBeTruthy();
    }
  });

  it("assigns resumeContext to hidden concept projects", () => {
    const iaso = getProjectBySlug("iaso");
    expect(iaso?.resumeContext).toEqual({ productOwner: "personal" });
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
    expect(bandIds).toContain("billing");
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
    expect(project?.primaryImage).toBe("/answeriq-1-landingpage.webp");
    expect(project?.galleryImages).toHaveLength(7);
    expect(project?.galleryImages).toContain("/answeriq-2-dashboard.webp");
    expect(project?.galleryImages).toContain("/answeriq-3-articles.webp");
    expect(project?.galleryImages).toContain("/answeriq-7-admin-users.webp");
    expect(project?.galleryImages).not.toContain(
      "/answeriq-7-admin-subscriptions.webp",
    );
    expect(project?.galleryImages).not.toContain(
      "/answeriq-9-admin-system-settings.webp",
    );
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

  it("orders carousel projects with highlights first then remaining visible projects", () => {
    expect(carouselProjects.map((project) => project.slug)).toEqual([
      "usedelight",
      "adverio-tools",
      "queue",
      "manatal-coop",
      "merns-shop",
      "jw-tabs",
      "answeriq",
      "trulyhappy",
      "articulearn",
      "bolt-to-github",
    ]);
    expect(carouselProjects.every(isPortfolioProjectVisible)).toBe(true);
  });

  it("assigns resumeContext to visible client projects without exposing Codefrost on site labels", () => {
    const clientProjects = projects.filter(
      (project) =>
        project.category === "client" && isPortfolioProjectVisible(project),
    );

    expect(clientProjects.length).toBeGreaterThan(0);
    for (const project of clientProjects) {
      expect(project.resumeContext).toBeDefined();
      expect(getProjectTypeLabel(project)).toBe("Client work");
      expect(getProjectTypeLabel(project)).not.toContain("Codefrost");
    }
  });

  it("describes TrulyHappy as a mental wellbeing product", () => {
    const project = getProjectBySlug("trulyhappy");

    expect(project?.tagline).toMatch(/wellbeing/i);
    expect(project?.description).toMatch(/mood tracking/i);
    expect(project?.resumeContext).toEqual({
      employer: "Codefrost",
      productOwner: "codefrost",
    });
  });

  it("describes ArticuLearn as speaking practice without Claude in stack", () => {
    const project = getProjectBySlug("articulearn");

    expect(project?.tagline).toMatch(/speaking practice/i);
    expect(project?.techStack).not.toContain("Anthropic Claude");
    expect(project?.techStack).toContain("WaveSurfer.js");
  });

  it("includes Manatal Coop with external client resume context", () => {
    const project = getProjectBySlug("manatal-coop");

    expect(project?.displayDomain).toBe("manatalcoop.app");
    expect(project?.primaryImage).toBe("/manatal-coop-homepage.webp");
    expect(project?.galleryImages).toEqual([
      "/manatal-coop-signin.webp",
      "/manatal-coop-chatbot.webp",
    ]);
    expect(project?.galleryColumns).toBe(3);
    expect(project?.resumeContext).toEqual({
      employer: "Codefrost",
      productOwner: "client",
      clientBrand: "Manatal Cooperative",
    });
  });
});
