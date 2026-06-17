import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export function readDocxDocumentXml(buffer: Buffer): string {
  const dir = mkdtempSync(join(tmpdir(), "portfolio-docx-"));
  const docxPath = join(dir, "resume.docx");

  try {
    writeFileSync(docxPath, buffer);
    return execFileSync("unzip", ["-p", docxPath, "word/document.xml"], {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function stripXmlTags(xml: string): string {
  return xml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
