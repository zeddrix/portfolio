export type ApplicationResumeLayout =
  | "refined-lorna"
  | "executive"
  | "portfolio-led";

export type SkillsBandMode = "sidebar" | "full" | "inline";

export const DEFAULT_APPLICATION_RESUME_LAYOUT: ApplicationResumeLayout =
  "refined-lorna";

export const APPLICATION_RESUME_LAYOUTS: ApplicationResumeLayout[] = [
  "refined-lorna",
  "executive",
  "portfolio-led",
];

export interface ApplicationResumeLayoutConfig {
  targetPageCount: 1 | 2;
  firstPageExperienceCount: number;
  pageOneBulletCount: 1 | 2;
  skillsBandMode: SkillsBandMode;
  onePageProjectSlugs?: readonly string[];
}

export const APPLICATION_RESUME_LAYOUT_CONFIG: Record<
  ApplicationResumeLayout,
  ApplicationResumeLayoutConfig
> = {
  "refined-lorna": {
    targetPageCount: 2,
    firstPageExperienceCount: 8,
    pageOneBulletCount: 1,
    skillsBandMode: "sidebar",
  },
  executive: {
    targetPageCount: 2,
    firstPageExperienceCount: 8,
    pageOneBulletCount: 2,
    skillsBandMode: "full",
  },
  "portfolio-led": {
    targetPageCount: 1,
    firstPageExperienceCount: 6,
    pageOneBulletCount: 1,
    skillsBandMode: "inline",
    onePageProjectSlugs: ["adverio-tools", "usedelight", "merns-shop", "queue"],
  },
};

export function getExpectedPageCount(layout: ApplicationResumeLayout): number {
  return APPLICATION_RESUME_LAYOUT_CONFIG[layout].targetPageCount;
}
