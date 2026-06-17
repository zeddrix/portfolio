import { describe, expect, it } from "vitest";
import { formatProjectPeriodLabel } from "./format-project-period";

describe("formatProjectPeriodLabel", () => {
  it("formats an open-ended range", () => {
    expect(formatProjectPeriodLabel("2026-01")).toBe("Jan 2026 – present");
  });

  it("formats a bounded range with note", () => {
    expect(
      formatProjectPeriodLabel("2021-05", "2021-10", "MVP shipped Oct 2021"),
    ).toBe("May 2021 – Oct 2021 (MVP shipped Oct 2021)");
  });
});
