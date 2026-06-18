export type ApplicationResumeLayout =
  | "refined-lorna"
  | "executive"
  | "portfolio-led";

export const DEFAULT_APPLICATION_RESUME_LAYOUT: ApplicationResumeLayout =
  "refined-lorna";

export const APPLICATION_RESUME_LAYOUTS: ApplicationResumeLayout[] = [
  "refined-lorna",
  "executive",
  "portfolio-led",
];

export interface ApplicationResumeLayoutConfig {
  firstPageExperienceCount: number;
  featuredProjectCount: number;
}

export const APPLICATION_RESUME_LAYOUT_CONFIG: Record<
  ApplicationResumeLayout,
  ApplicationResumeLayoutConfig
> = {
  "refined-lorna": {
    firstPageExperienceCount: 6,
    featuredProjectCount: 0,
  },
  executive: {
    firstPageExperienceCount: 7,
    featuredProjectCount: 0,
  },
  "portfolio-led": {
    firstPageExperienceCount: 5,
    featuredProjectCount: 2,
  },
};
