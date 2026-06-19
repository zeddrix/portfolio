export interface ApplicationResumeConfig {
  targetPageCount: 2;
  firstPageExperienceCount: number;
  pageOneBulletCount: 1 | 2;
}

export const APPLICATION_RESUME_CONFIG: ApplicationResumeConfig = {
  targetPageCount: 2,
  firstPageExperienceCount: 12,
  pageOneBulletCount: 1,
};

export const EXPECTED_APPLICATION_RESUME_PAGE_COUNT = 2;
