import { describe, expect, it } from "vitest";
import { buildPortfolioSnapshot } from "./export-portfolio-snapshot";
import {
  buildApplicationResumeHtml,
  COMPLETE_RESUME_DIR,
  COMPLETE_RESUME_HTML_FILE,
  COMPLETE_RESUME_PDF_FILE,
  OPTIMIZED_RESUME_DIR,
  OPTIMIZED_RESUME_HTML_FILE,
  OPTIMIZED_RESUME_PDF_FILE,
  RESUME_HTML_FILE,
  RESUME_PDF_FILE,
} from "./generate-resume";
import { buildOptimizedResumeSnapshot } from "./resume-optimized-snapshot";

describe("generate-resume output contract", () => {
  it("keeps permanent foldered output contract with shared filenames", () => {
    expect(COMPLETE_RESUME_DIR).toBe("complete");
    expect(OPTIMIZED_RESUME_DIR).toBe("optimized");
    expect(RESUME_HTML_FILE).toBe("resume.html");
    expect(RESUME_PDF_FILE).toBe("Zeddrix-Fabian-Resume.pdf");
    expect(COMPLETE_RESUME_HTML_FILE).toBe("complete/resume.html");
    expect(OPTIMIZED_RESUME_HTML_FILE).toBe("optimized/resume.html");
    expect(COMPLETE_RESUME_PDF_FILE).toBe("complete/Zeddrix-Fabian-Resume.pdf");
    expect(OPTIMIZED_RESUME_PDF_FILE).toBe(
      "optimized/Zeddrix-Fabian-Resume.pdf",
    );
  });

  it("keeps complete layout structure while optimized content differs", async () => {
    const snapshot = buildPortfolioSnapshot();
    const optimizedSnapshot = buildOptimizedResumeSnapshot(snapshot as never);

    const completeHtml = await buildApplicationResumeHtml(snapshot as never);
    const optimizedHtml = await buildApplicationResumeHtml(
      optimizedSnapshot as never,
    );

    expect(completeHtml).toContain('data-testid="resume-page-1"');
    expect(completeHtml).toContain('data-testid="resume-page-2"');
    expect(completeHtml).toContain("Professional Experience");
    expect(optimizedHtml).toContain('data-testid="resume-page-1"');
    expect(optimizedHtml).toContain('data-testid="resume-page-2"');
    expect(optimizedHtml).toContain("Professional Experience");
    expect(completeHtml).not.toEqual(optimizedHtml);
  });
});
