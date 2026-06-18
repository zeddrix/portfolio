import { describe, expect, it } from "vitest";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";
import { buildLinkedInDocxBuffer } from "./build-linkedin-docx";
import { readDocxDocumentXml, stripXmlTags } from "./docx-test-helpers";

describe("buildLinkedInDocxBuffer", () => {
  it("builds a docx with plan-ordered experience and project sections", async () => {
    const snapshot = buildPortfolioSnapshot();
    const buffer = await buildLinkedInDocxBuffer(snapshot as never);

    expect(buffer.byteLength).toBeGreaterThan(1000);
    expect(buffer.subarray(0, 2).toString("utf8")).toBe("PK");

    const documentText = stripXmlTags(readDocxDocumentXml(buffer));

    expect(documentText).toContain("Queue");
    expect(documentText).toContain("Adverio");
    expect(documentText).toContain("MERN");
    expect(documentText).toContain("Experience");
    expect(documentText).toContain("Selected Projects");
    expect(documentText).toContain("Additional Projects");
    expect(documentText).not.toContain("Primary depth in the stacks above");
    expect(documentText.indexOf("Queue")).toBeLessThan(
      documentText.indexOf("Adverio"),
    );
  });
});
