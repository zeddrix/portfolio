import { chromium } from "@playwright/test";
import { describe, expect, it } from "vitest";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";
import { buildApplicationResumeHtml } from "./generate-resume";

function countPdfPages(buffer: Buffer): number {
  const text = buffer.toString("latin1");
  const matches = text.match(/\/Type[\s]*\/Page[^s]/g);
  return matches?.length ?? 0;
}

describe("application resume PDF page count", () => {
  it("prints exactly two pages", async () => {
    const snapshot = buildPortfolioSnapshot();
    const html = await buildApplicationResumeHtml(snapshot as never);

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      scale: 0.96,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    await browser.close();

    expect(countPdfPages(Buffer.from(pdf))).toBe(2);
  }, 60_000);
});
