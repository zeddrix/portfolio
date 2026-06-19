import type { ApplicationResumeConfig } from "../application-resume-config.js";
import type {
  CertificateSnapshot,
  ExperienceSnapshot,
  ProfileSnapshot,
  ProjectSnapshot,
} from "../resume-content.js";

export interface ApplicationResumeBuildContext {
  config: ApplicationResumeConfig;
  profile: ProfileSnapshot["profile"];
  certificates: CertificateSnapshot[];
  toolStripGroups: ProfileSnapshot["toolStripGroups"];
  summary: string;
  firstPageExperience: ExperienceSnapshot[];
  clientProjects: ProjectSnapshot[];
  personalProjects: ProjectSnapshot[];
  fontCss: string;
}
