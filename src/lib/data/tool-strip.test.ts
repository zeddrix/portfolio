import { describe, expect, it } from "vitest";
import { toolStripGroups, toolStripItems } from "./portfolio";

describe("tool strip groups", () => {
  it("defines groups in the planned order", () => {
    expect(toolStripGroups.map((group) => group.id)).toEqual([
      "ai-delivery",
      "frontend-frameworks",
      "frontend-libraries",
      "languages",
      "backend-architecture",
      "data-storage",
      "styling-ui",
      "testing",
      "devops-platforms",
    ]);
  });

  it("keeps chip labels unique across all groups", () => {
    const labels = toolStripItems.map((item) => item.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("includes representative technologies from the requested stack list", () => {
    const labels = new Set(toolStripItems.map((item) => item.label));
    expect(labels.has("SvelteKit")).toBe(true);
    expect(labels.has("Playwright")).toBe(true);
    expect(labels.has("Cloudflare")).toBe(true);
    expect(labels.has("Cursor IDE")).toBe(true);
    expect(labels.has("Node.js (Express, NestJS)")).toBe(true);
    expect(labels.has("Tailwind CSS")).toBe(true);
  });
});
