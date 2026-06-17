import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { ProfileSnapshot } from "./resume-content.js";
import {
  buildAdditionalProjectsBlocks,
  buildCertificatesText,
  buildEngagementExperienceBlocks,
  buildSelectedProjectsBlocks,
  buildSkillsText,
  buildSummary,
  formatExperienceRange,
  formatResumeProjectHeader,
  projectBullets,
} from "./resume-content.js";

function heading(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
  });
}

function bodyParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: "Arial", size: 22 })],
    spacing: { after: 120 },
  });
}

export async function buildLinkedInDocxBuffer(
  snapshot: ProfileSnapshot,
): Promise<Buffer> {
  const { profile, certificates, toolStripGroups, toolStripFooterNote } =
    snapshot;
  const experience = buildEngagementExperienceBlocks(snapshot);
  const selectedProjects = buildSelectedProjectsBlocks(snapshot);
  const additionalProjects = buildAdditionalProjectsBlocks(snapshot);
  const summary = buildSummary(snapshot);

  const children: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: profile.name,
          font: "Arial",
          size: 40,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: profile.jobTitle,
          font: "Arial",
          size: 24,
          bold: true,
        }),
      ],
    }),
    bodyParagraph(
      `${profile.contactEmail} | ${profile.websiteUrl} | ${profile.githubUrl} | ${profile.linkedinUrl}`,
    ),
    heading("Summary"),
    bodyParagraph(summary),
    heading("Experience"),
  ];

  for (const role of experience) {
    const titleLine = role.employmentType
      ? `${role.title} (${role.employmentType})`
      : role.title;
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${titleLine} — ${role.company}`,
            font: "Arial",
            size: 22,
            bold: true,
          }),
        ],
      }),
      bodyParagraph(`${formatExperienceRange(role)} · ${role.location}`),
    );
    for (const bullet of role.bullets) {
      children.push(bodyParagraph(`• ${bullet}`));
    }
  }

  children.push(heading("Selected Projects"));
  for (const project of selectedProjects) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: formatResumeProjectHeader(project),
            font: "Arial",
            size: 22,
            bold: true,
          }),
        ],
      }),
    );
    for (const bullet of projectBullets(project)) {
      children.push(bodyParagraph(`• ${bullet}`));
    }
    children.push(
      bodyParagraph(`Stack: ${project.techStack.slice(0, 8).join(", ")}`),
    );
  }

  children.push(heading("Additional Projects"));
  for (const project of additionalProjects) {
    children.push(
      bodyParagraph(
        `${formatResumeProjectHeader(project)} — ${project.outcome || project.tagline}. Stack: ${project.techStack.slice(0, 6).join(", ")}`,
      ),
    );
  }

  children.push(
    heading("Skills"),
    bodyParagraph(buildSkillsText(toolStripGroups)),
    bodyParagraph(toolStripFooterNote),
    heading("Professional Development"),
    bodyParagraph(buildCertificatesText(certificates)),
    heading("Languages"),
    bodyParagraph(
      "Tagalog (Native), English (Professional Working Proficiency)",
    ),
  );

  const document = new Document({
    sections: [{ children }],
  });

  return Packer.toBuffer(document);
}
