import type {
  ApplicationResumeLayout,
  ApplicationResumeLayoutConfig,
} from "../application-resume-config.js";
import type {
  CertificateSnapshot,
  ExperienceSnapshot,
  ProfileSnapshot,
  ProjectSnapshot,
} from "../resume-content.js";

export interface ApplicationResumeBuildContext {
  layout: ApplicationResumeLayout;
  config: ApplicationResumeLayoutConfig;
  profile: ProfileSnapshot["profile"];
  certificates: CertificateSnapshot[];
  toolStripGroups: ProfileSnapshot["toolStripGroups"];
  summary: string;
  experience: ExperienceSnapshot[];
  firstPageExperience: ExperienceSnapshot[];
  secondPageExperience: ExperienceSnapshot[];
  selectedProjects: ProjectSnapshot[];
  additionalProjects: ProjectSnapshot[];
  onePageProjects: ProjectSnapshot[];
  fontCss: string;
}
