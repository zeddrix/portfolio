import { describe, expect, it } from "vitest";
import {
  formatResumeProjectAttribution,
  formatResumeProjectHeader,
  formatResumeProjectRoleLine,
} from "./resume-project-header";

describe("formatResumeProjectAttribution", () => {
  it("returns empty for personal projects", () => {
    expect(formatResumeProjectAttribution({ productOwner: "personal" })).toBe(
      "",
    );
  });

  it("returns Codefrost for Codefrost-owned products", () => {
    expect(
      formatResumeProjectAttribution({
        employer: "Codefrost",
        productOwner: "codefrost",
      }),
    ).toBe("(Codefrost)");
  });

  it("returns Codefrost and client brand for external client deliveries", () => {
    expect(
      formatResumeProjectAttribution({
        employer: "Codefrost",
        productOwner: "client",
        clientBrand: "Manatal Cooperative",
      }),
    ).toBe("(Codefrost · Manatal Cooperative)");
  });

  it("returns client brand only for independent client work", () => {
    expect(
      formatResumeProjectAttribution({
        productOwner: "client",
        clientBrand: "AnswerIQ",
      }),
    ).toBe("(AnswerIQ)");
  });
});

describe("formatResumeProjectHeader", () => {
  it("formats Codefrost-owned product headers", () => {
    expect(
      formatResumeProjectHeader({
        name: "TrulyHappy",
        role: "Full-stack contributor",
        resumeContext: {
          employer: "Codefrost",
          productOwner: "codefrost",
        },
      }),
    ).toBe("TrulyHappy — Full-stack contributor (Codefrost)");
  });

  it("formats personal project headers without attribution", () => {
    expect(
      formatResumeProjectHeader({
        name: "Queue",
        role: "Sole builder",
        resumeContext: { productOwner: "personal" },
      }),
    ).toBe("Queue — Sole builder");
  });
});

describe("formatResumeProjectRoleLine", () => {
  it("appends attribution to role line for application resume layout", () => {
    expect(
      formatResumeProjectRoleLine({
        role: "Full-stack contributor",
        resumeContext: {
          employer: "Codefrost",
          productOwner: "client",
          clientBrand: "UseDelight",
        },
      }),
    ).toBe("Full-stack contributor (Codefrost · UseDelight)");
  });
});
