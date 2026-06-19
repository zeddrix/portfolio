#!/usr/bin/env tsx
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { formatCertificateDate } from "../src/lib/data/certificates.js";
import { PORTFOLIO_PUBLIC_SITE_URL } from "../src/lib/data/site.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const snapshotPath = join(__dirname, "profile-snapshot.json");
const exportsDir = join(rootDir, "exports");

interface CertificateExport {
  slug: string;
  title: string;
  issuer: string;
  issuedAt: string;
  skills: string[];
  verifyUrl: string;
  udemyCredentialId?: string;
}

interface ProjectExport {
  slug: string;
  name: string;
  displayPeriod?: string;
  links: Array<{ label: string; url: string }>;
}

interface Snapshot {
  certificates: CertificateExport[];
  selectedProjects: ProjectExport[];
  moreProjects: ProjectExport[];
}

function buildLinkedInCertificatesMd(
  certificates: CertificateExport[],
): string {
  return certificates
    .map((certificate) => {
      const issueDate = formatCertificateDate(certificate.issuedAt);
      const skills = certificate.skills.join(", ");
      const credentialLine = certificate.udemyCredentialId
        ? `\n- Credential ID: ${certificate.udemyCredentialId}`
        : "";

      return `### ${certificate.title}

- Issuer: ${certificate.issuer}
- Issue date: ${issueDate}
- Credential URL: ${certificate.verifyUrl}${credentialLine}
- Skills: ${skills}`;
    })
    .join("\n\n");
}

function buildGithubReadmeTable(certificates: CertificateExport[]): string {
  const rows = certificates
    .map((certificate) => {
      const completed = formatCertificateDate(certificate.issuedAt);
      return `| ${certificate.title} | ${certificate.issuer} | ${completed} | [View certificate](${certificate.verifyUrl}) |`;
    })
    .join("\n");

  return `## Certifications

| Course | Issuer | Completed | Verify |
|--------|--------|-----------|--------|
${rows}

All certifications: [portfolio certificates](${PORTFOLIO_PUBLIC_SITE_URL}/certificates)`;
}

function buildGithubReadmeProjectsTable(projects: ProjectExport[]): string {
  const rows = projects
    .map((project) => {
      const period = project.displayPeriod ?? "—";
      const link =
        project.links[0]?.url ??
        `${PORTFOLIO_PUBLIC_SITE_URL}/projects/${project.slug}`;
      return `| ${project.name} | ${period} | [View](${link}) |`;
    })
    .join("\n");

  return `## Portfolio projects (resume periods)

| Project | Period | Link |
|---------|--------|------|
${rows}`;
}

function buildGithubReadmeManatalCoop(): string {
  return `### [Manatal Coop](${PORTFOLIO_PUBLIC_SITE_URL}/projects/manatal-coop)

<p align="left">
  <img src="./manatal-coop-homepage.png" width="220" alt="Manatal Cooperative member home screen" />
  <img src="./manatal-coop-signin.png" width="220" alt="Manatal Cooperative sign-in screen" />
  <img src="./manatal-coop-chatbot.png" width="220" alt="Manatal Cooperative assistant screen" />
</p>

**Full-stack contributor** — Cooperative member banking PWA with financial request workflows, offline caching, and push notifications.

Member banking PWA for a Philippine credit union

[Portfolio case study](${PORTFOLIO_PUBLIC_SITE_URL}/projects/manatal-coop) · [Member app](https://manatalcoop.app/)`;
}

async function main() {
  const snapshotRaw = await readFile(snapshotPath, "utf8");
  const snapshot = JSON.parse(snapshotRaw) as Snapshot;

  const certificateUrls = snapshot.certificates.map((certificate) => ({
    slug: certificate.slug,
    title: certificate.title,
    url: certificate.verifyUrl,
    issuedAt: certificate.issuedAt,
    skills: certificate.skills,
  }));

  await mkdir(exportsDir, { recursive: true });

  await writeFile(
    join(exportsDir, "certificate-urls.json"),
    `${JSON.stringify(certificateUrls, null, 2)}\n`,
  );
  await writeFile(
    join(exportsDir, "linkedin-certificates.md"),
    `${buildLinkedInCertificatesMd(snapshot.certificates)}\n`,
  );
  await writeFile(
    join(exportsDir, "github-readme-certifications.md"),
    `${buildGithubReadmeTable(snapshot.certificates)}\n`,
  );
  await writeFile(
    join(exportsDir, "github-readme-projects.md"),
    `${buildGithubReadmeProjectsTable([...snapshot.selectedProjects, ...snapshot.moreProjects])}\n`,
  );
  await writeFile(
    join(exportsDir, "github-readme-manatal-coop.md"),
    `${buildGithubReadmeManatalCoop()}\n`,
  );

  console.log(`Wrote exports to ${exportsDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
