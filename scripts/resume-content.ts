import {
  formatResumeProjectHeader,
  formatResumeProjectRoleLine,
  type ResumeProjectContext,
} from "./resume-project-header.js";

export interface ProjectLink {
  label: string;
  url: string;
}

export interface DetailSection {
  title: string;
  body: string;
}

export interface ProjectSnapshot {
  slug: string;
  name: string;
  role: string;
  outcome: string;
  tagline: string;
  description: string;
  techStack: string[];
  links: ProjectLink[];
  detailSections: DetailSection[];
  displayDomain?: string;
  displayPeriod?: string;
  resumeContext?: ResumeProjectContext;
}

export interface ExperienceSnapshot {
  id: string;
  company: string;
  title: string;
  employmentType?: string;
  location: string;
  startDate: string;
  endDate?: string;
  bullets: string[];
}

export interface CertificateSnapshot {
  slug: string;
  title: string;
  issuer: string;
  issuedAt: string;
  skills: string[];
  verifyUrl: string;
  udemyCredentialId?: string;
}

export interface ProfileSnapshot {
  profile: {
    name: string;
    heroSubtitle: string;
    about: string[];
    contactEmail: string;
    websiteUrl: string;
    githubUrl: string;
    linkedinUrl: string;
    specialization: string;
    experienceSince: string;
    jobTitle: string;
  };
  experience: ExperienceSnapshot[];
  certificates: CertificateSnapshot[];
  highlightProjects: ProjectSnapshot[];
  selectedProjects: ProjectSnapshot[];
  moreProjects: ProjectSnapshot[];
  resumeSelectedProjectSlugs: string[];
  resumeMoreProjectSlugs: string[];
  toolStripGroups: Array<{ title: string; items: string[] }>;
  toolStripFooterNote: string;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatMonthYear(value: string): string {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function formatExperienceRange(experience: ExperienceSnapshot): string {
  const start = formatMonthYear(experience.startDate);
  const end = experience.endDate
    ? formatMonthYear(experience.endDate)
    : "Present";
  return `${start} – ${end}`;
}

export function formatCertificateMonthYear(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function projectBullets(project: ProjectSnapshot, limit = 2): string[] {
  const bullets: string[] = [];

  if (project.outcome) {
    bullets.push(project.outcome);
  }

  const approach = project.detailSections.find(
    (section) => section.title.toLowerCase() === "approach",
  );
  if (approach) {
    bullets.push(approach.body);
  }

  if (project.displayDomain) {
    bullets.push(`Deployed at ${project.displayDomain}.`);
  }

  return bullets.slice(0, limit);
}

export function formatLinks(project: ProjectSnapshot): string {
  if (project.links.length === 0) {
    return "";
  }

  return project.links.map((link) => link.url).join(" · ");
}

export function buildSummary(snapshot: ProfileSnapshot): string {
  return [
    snapshot.profile.heroSubtitle,
    ...snapshot.profile.about.slice(0, 2),
  ].join(" ");
}

export function partitionProjects(snapshot: ProfileSnapshot): {
  selectedProjects: ProjectSnapshot[];
  additionalProjects: ProjectSnapshot[];
} {
  const selectedSet = new Set(snapshot.resumeSelectedProjectSlugs);
  const selectedProjects = snapshot.resumeSelectedProjectSlugs
    .map((slug) =>
      [...snapshot.selectedProjects, ...snapshot.highlightProjects].find(
        (project) => project.slug === slug,
      ),
    )
    .filter((project): project is ProjectSnapshot => project !== undefined);

  const additionalProjects = snapshot.resumeMoreProjectSlugs
    .map((slug) =>
      snapshot.moreProjects.find((project) => project.slug === slug),
    )
    .filter((project): project is ProjectSnapshot => project !== undefined);

  for (const project of snapshot.highlightProjects) {
    if (
      !selectedSet.has(project.slug) &&
      !additionalProjects.some((item) => item.slug === project.slug)
    ) {
      additionalProjects.push(project);
    }
  }

  return { selectedProjects, additionalProjects };
}

export function buildSkillsText(
  groups: ProfileSnapshot["toolStripGroups"],
): string {
  return groups
    .map((group) => `${group.title}: ${group.items.join(", ")}`)
    .join("\n");
}

export function buildCertificatesText(
  certificates: CertificateSnapshot[],
): string {
  return certificates
    .map(
      (certificate) =>
        `${certificate.title} (${certificate.issuer}, ${formatCertificateMonthYear(certificate.issuedAt)}) — ${certificate.verifyUrl}`,
    )
    .join("\n");
}

export function buildEngagementExperienceBlocks(
  snapshot: ProfileSnapshot,
): ExperienceSnapshot[] {
  return snapshot.experience;
}

export function buildSelectedProjectsBlocks(
  snapshot: ProfileSnapshot,
): ProjectSnapshot[] {
  return partitionProjects(snapshot).selectedProjects;
}

export function buildAdditionalProjectsBlocks(
  snapshot: ProfileSnapshot,
): ProjectSnapshot[] {
  return partitionProjects(snapshot).additionalProjects;
}

export function splitExperienceForApplicationResume(
  experience: ExperienceSnapshot[],
  firstPageCount = 6,
): {
  firstPageExperience: ExperienceSnapshot[];
  secondPageExperience: ExperienceSnapshot[];
} {
  return {
    firstPageExperience: experience.slice(0, firstPageCount),
    secondPageExperience: experience.slice(firstPageCount),
  };
}

export { formatResumeProjectHeader, formatResumeProjectRoleLine };
