#!/usr/bin/env tsx
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { formatCertificateDate } from "../src/lib/data/certificates.js";

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

All certifications: [portfolio certificates](https://zeddrix.github.io/portfolio/certificates)`;
}

function buildGithubReadmeProjectsTable(projects: ProjectExport[]): string {
  const rows = projects
    .map((project) => {
      const period = project.displayPeriod ?? "—";
      const link =
        project.links[0]?.url ??
        `https://zeddrix.github.io/portfolio/projects/${project.slug}`;
      return `| ${project.name} | ${period} | [View](${link}) |`;
    })
    .join("\n");

  return `## Portfolio projects (resume periods)

| Project | Period | Link |
|---------|--------|------|
${rows}`;
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

  console.log(`Wrote exports to ${exportsDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
