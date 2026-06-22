import { describe, expect, it } from "vitest";
import {
  getPlanOrderedEngagements,
  resumeEngagements,
} from "./resume-engagements";

describe("resume-engagements", () => {
  it("defines twelve engagement rows in locked plan order", () => {
    const ordered = getPlanOrderedEngagements(resumeEngagements);

    expect(ordered).toHaveLength(12);
    expect(ordered.map((engagement) => engagement.id)).toEqual([
      "independent-queue",
      "codefrost-manatal-2026",
      "independent-merns-modernization",
      "codefrost-adverio",
      "codefrost-bolt",
      "independent-answeriq",
      "codefrost-usedelight",
      "codefrost-articulearn",
      "codefrost-trulyhappy",
      "independent-jwtabs",
      "codefrost-manatal-2021",
      "codefrost-student-intern",
    ]);
  });

  it("omits gap years 2022 and 2023 from engagement dates", () => {
    const experience = resumeEngagements.flatMap((engagement) => [
      engagement.startDate,
      engagement.endDate ?? "",
    ]);
    const serialized = experience.join(" ");

    expect(serialized).not.toContain("2022");
    expect(serialized).not.toContain("2023");
  });

  it("starts MERN modernization in June 2026", () => {
    const mern = resumeEngagements.find(
      (engagement) => engagement.id === "independent-merns-modernization",
    );

    expect(mern?.startDate).toBe("2026-06");
    expect(mern?.title).toContain("modernization");
  });

  it("ends internship in December 2021", () => {
    const intern = resumeEngagements.find(
      (engagement) => engagement.id === "codefrost-student-intern",
    );

    expect(intern?.endDate).toBe("2021-12");
  });

  it("lists TrulyHappy as first post-gap engagement chronologically", () => {
    const chronologicallyFirstPostGap = [...resumeEngagements]
      .sort((left, right) => left.startDate.localeCompare(right.startDate))
      .find((engagement) => engagement.startDate >= "2024-01");

    expect(chronologicallyFirstPostGap?.id).toBe("codefrost-trulyhappy");
    expect(chronologicallyFirstPostGap?.startDate).toBe("2024-01");
  });

  it("omits Django and PWA from UseDelight engagement bullet", () => {
    const usedelight = resumeEngagements.find(
      (engagement) => engagement.id === "codefrost-usedelight",
    );

    expect(usedelight?.bullets[0]).not.toMatch(/Django/i);
    expect(usedelight?.bullets[0]).not.toMatch(/PWA/i);
    expect(usedelight?.bullets[0]).toContain("Express");
  });
});
