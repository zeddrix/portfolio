import { describe, expect, it } from "vitest";
import { getProjectBySlug } from "$lib/data/portfolio";
import {
  filterProjectsByWorkFilter,
  getProjectDisplayUrl,
  getProjectTypeLabel,
  getStatusLabel,
} from "./portfolio-display";

describe("portfolio-display", () => {
  it("returns client work label for client projects", () => {
    const usedelight = getProjectBySlug("usedelight");
    expect(usedelight).toBeDefined();
    expect(getProjectTypeLabel(usedelight!)).toBe("Client work");
  });

  it("returns concept label when status is concept", () => {
    const iaso = getProjectBySlug("iaso");
    expect(iaso).toBeDefined();
    expect(getProjectTypeLabel(iaso!)).toBe("Concept");
  });

  it("returns personal label for live personal products", () => {
    const queue = getProjectBySlug("queue");
    expect(queue).toBeDefined();
    expect(getProjectTypeLabel(queue!)).toBe("Personal");
  });

  it("uses displayDomain for showcase URL when set", () => {
    const adverio = getProjectBySlug("adverio-tools");
    expect(adverio).toBeDefined();
    expect(getProjectDisplayUrl(adverio!)).toBe("tools.adverio.io");
  });

  it("filters projects by work filter", () => {
    const queue = getProjectBySlug("queue");
    const usedelight = getProjectBySlug("usedelight");
    expect(queue).toBeDefined();
    expect(usedelight).toBeDefined();

    const all = filterProjectsByWorkFilter([queue!, usedelight!], "all");
    const personal = filterProjectsByWorkFilter(
      [queue!, usedelight!],
      "personal",
    );
    const client = filterProjectsByWorkFilter([queue!, usedelight!], "client");

    expect(all).toHaveLength(2);
    expect(personal).toHaveLength(1);
    expect(personal[0]?.slug).toBe("queue");
    expect(client).toHaveLength(1);
    expect(client[0]?.slug).toBe("usedelight");
  });

  it("maps status to readable labels", () => {
    expect(getStatusLabel("live")).toBe("Live");
    expect(getStatusLabel("in_progress")).toBe("In progress");
    expect(getStatusLabel("concept")).toBe("Concept");
  });
});
