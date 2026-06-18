import type { ApplicationResumeLayout } from "../application-resume-config.js";
import type {
  CertificateSnapshot,
  ExperienceSnapshot,
  ProfileSnapshot,
  ProjectSnapshot,
} from "../resume-content.js";

export interface ApplicationResumeBuildContext {
  layout: ApplicationResumeLayout;
  profile: ProfileSnapshot["profile"];
  certificates: CertificateSnapshot[];
  toolStripGroups: ProfileSnapshot["toolStripGroups"];
  toolStripFooterNote: string;
  summary: string;
  experience: ExperienceSnapshot[];
  firstPageExperience: ExperienceSnapshot[];
  secondPageExperience: ExperienceSnapshot[];
  selectedProjects: ProjectSnapshot[];
  additionalProjects: ProjectSnapshot[];
  featuredProjects: ProjectSnapshot[];
  remainingSelectedProjects: ProjectSnapshot[];
  fontCss: string;
}
