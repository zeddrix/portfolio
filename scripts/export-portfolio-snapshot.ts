#!/usr/bin/env tsx
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  caseStudyProjectSlugs,
  highlightProjectSlugs,
  profile,
  projects,
  toolStripGroups,
} from "../src/lib/data/portfolio.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, "profile-snapshot.json");

const PORTFOLIO_URL = profile.websiteUrl;
const GITHUB_URL = profile.githubUrl;
const LINKEDIN_URL = "https://www.linkedin.com/in/zeddrix-fabian-30a18029a/";

const moreProjectSlugs = [
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
    links: project.links,
    detailSections: project.detailSections,
    primaryImage: project.primaryImage,
  };
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  profile: {
    ...profile,
    websiteUrl: PORTFOLIO_URL,
    githubUrl: GITHUB_URL,
    linkedinUrl: LINKEDIN_URL,
    jobTitle: "Full-Stack Web App Developer",
  },
  highlightProjects: highlightProjectSlugs
    .map((slug) => projectSnapshot(slug))
    .filter((project) => project !== null),
  moreProjects: moreProjectSlugs
    .map((slug) => projectSnapshot(slug))
    .filter((project) => project !== null),
  caseStudySlugs: [...caseStudyProjectSlugs],
  toolStripGroups: toolStripGroups.map((group) => ({
    id: group.id,
    title: group.title,
    items: group.items.map((item) => item.label),
  })),
};

await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);
