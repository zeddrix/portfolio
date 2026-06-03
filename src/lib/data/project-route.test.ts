import { describe, expect, it } from "vitest";
import { getProjectBySlug } from "./portfolio";

describe("project detail route contract", () => {
  it("returns project for known slug", () => {
    const project = getProjectBySlug("queue");

    expect(project?.name).toBe("Queue");
    expect(project?.slug).toBe("queue");
  });

  it("returns undefined project for unknown slug", () => {
    const project = getProjectBySlug("missing-project");

    expect(project).toBeUndefined();
  });
});
