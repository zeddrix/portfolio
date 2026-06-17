#!/usr/bin/env tsx
import { writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildCertificatePublicUrl,
  certificates,
} from "../src/lib/data/certificates.js";
import { workExperience } from "../src/lib/data/experience.js";
import {
  highlightProjectSlugs,
  profile,
  projects,
  toolStripFooterNote,
  toolStripGroups,
} from "../src/lib/data/portfolio.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, "profile-snapshot.json");

const PORTFOLIO_URL = profile.websiteUrl;
const GITHUB_URL = profile.githubUrl;
const LINKEDIN_URL = "https://www.linkedin.com/in/zeddrix-fabian-30a18029a/";

export const resumeSelectedProjectSlugs = [
  "adverio-tools",
  "usedelight",
  "merns-shop",
] as const;

export const resumeMoreProjectSlugs = [
  "queue",
  "answeriq",
  "jw-tabs",
  "manatal-coop",
  "trulyhappy",
  "articulearn",
  "bolt-to-github",
] as const;

function projectSnapshot(slug: string) {
  const project = projects.find((item) => item.slug === slug);
  if (!project || project.hiddenFromPortfolio) {
    return null;
  }

  return {
    slug: project.slug,
    name: project.name,
    category: project.category,
    status: project.status,
    role: project.role,
    outcome: project.outcome ?? project.tagline,
    tagline: project.tagline,
    description: project.description,
    techStack: project.techStack,
    displayDomain: project.displayDomain,
    displayPeriod: project.displayPeriod,
    resumePeriod: project.resumePeriod,
    links: project.links,
    detailSections: project.detailSections,
    primaryImage: project.primaryImage,
    resumeContext: project.resumeContext,
  };
}

export function buildPortfolioSnapshot() {
  return {
    generatedAt: new Date().toISOString(),
    profile: {
      ...profile,
      websiteUrl: PORTFOLIO_URL,
      githubUrl: GITHUB_URL,
      linkedinUrl: LINKEDIN_URL,
      jobTitle: "Full-Stack Web App Developer",
    },
    experience: workExperience,
    certificates: certificates.map((certificate) => ({
      slug: certificate.slug,
      title: certificate.title,
      issuer: certificate.issuer,
      issuedAt: certificate.issuedAt,
      skills: certificate.skills,
      verifyUrl: buildCertificatePublicUrl(certificate.slug),
      udemyCredentialId: certificate.udemyCredentialId,
    })),
    highlightProjects: highlightProjectSlugs
      .map((slug) => projectSnapshot(slug))
      .filter((project) => project !== null),
    selectedProjects: resumeSelectedProjectSlugs
      .map((slug) => projectSnapshot(slug))
      .filter((project) => project !== null),
    moreProjects: resumeMoreProjectSlugs
      .map((slug) => projectSnapshot(slug))
      .filter((project) => project !== null),
    resumeSelectedProjectSlugs: [...resumeSelectedProjectSlugs],
    resumeMoreProjectSlugs: [...resumeMoreProjectSlugs],
    toolStripGroups: toolStripGroups.map((group) => ({
      id: group.id,
      title: group.title,
      items: group.items.map((item) => item.label),
    })),
    toolStripFooterNote,
  };
}

const snapshot = buildPortfolioSnapshot();

const isCli =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Wrote ${outputPath}`);
}
