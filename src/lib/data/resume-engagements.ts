import type { ResumeEngagement, WorkExperience } from "$lib/types/portfolio";

export const resumeEngagements: ResumeEngagement[] = [
  {
    id: "independent-queue",
    projectSlug: "queue",
    title: "Sole builder — Queue",
    company: "Independent products",
    location: "Philippines · Remote",
    startDate: "2026-01",
    kind: "independent",
    bullets: [
      "Shipped queue.place MVP+ PWA for walk-ins, bookings, operations, billing, and owner/admin tooling with Supabase and Cloudflare.",
    ],
  },
  {
    id: "codefrost-manatal-2026",
    projectSlug: "manatal-coop",
    title: "Full-stack contributor — Manatal Cooperative",
    company: "Codefrost",
    contextLabel: "client",
    location: "Philippines · Remote",
    startDate: "2026-06",
    kind: "client",
    bullets: [
      "Returned to extend Manatal Cooperative member PWA and Django API delivery flows for production cooperative operations.",
    ],
  },
  {
    id: "independent-merns-modernization",
    projectSlug: "merns-shop",
    title: "Sole builder — MERN's Shop (modernization)",
    company: "Independent products",
    location: "Philippines · Remote",
    startDate: "2026-06",
    kind: "independent",
    bullets: [
      "Modernized the 2021 Udemy storefront with TypeScript, Express 5, React 19, PayPal checkout, guest/registered order flows, ATDD (Playwright/Vitest), PWA, CI, and Render deployment.",
    ],
  },
  {
    id: "codefrost-adverio",
    projectSlug: "adverio-tools",
    title: "Full-stack contributor — Adverio Tools",
    company: "Codefrost",
    contextLabel: "client",
    location: "Philippines · Remote",
    startDate: "2025-08",
    endDate: "2026-05",
    kind: "client",
    bullets: [
      "Delivered Angular and Django tooling for Adverio client workflows with Docker, Stripe, and Redis-backed integrations.",
    ],
  },
  {
    id: "codefrost-bolt",
    projectSlug: "bolt-to-github",
    title: "Full-stack contributor — Bolt to GitHub",
    company: "Codefrost",
    location: "Philippines · Remote",
    startDate: "2025-09",
    endDate: "2025-12",
    kind: "employment",
    bullets: [
      "Built Bolt to GitHub automation for Codefrost product workflows alongside parallel client deliveries.",
    ],
  },
  {
    id: "independent-answeriq",
    projectSlug: "answeriq",
    title: "Full-stack contributor — AnswerIQ",
    company: "Independent products",
    contextLabel: "personal client",
    location: "Philippines · Remote",
    startDate: "2025-09",
    endDate: "2025-10",
    kind: "independent",
    bullets: [
      "Contributed to AnswerIQ multi-tenant SaaS: Shopify FAQ pipeline, Stripe billing, workspace RBAC, and admin audit console.",
    ],
  },
  {
    id: "codefrost-usedelight",
    projectSlug: "usedelight",
    title: "Full-stack contributor — UseDelight",
    company: "Codefrost",
    contextLabel: "client",
    location: "Philippines · Remote",
    startDate: "2025-01",
    endDate: "2025-07",
    kind: "client",
    bullets: [
      "Shipped SvelteKit and Django features for UseDelight client PWA flows with Stripe billing integration.",
    ],
  },
  {
    id: "codefrost-articulearn",
    projectSlug: "articulearn",
    title: "Full-stack contributor — ArticuLearn",
    company: "Codefrost",
    location: "Philippines · Remote",
    startDate: "2024-07",
    endDate: "2024-12",
    kind: "employment",
    bullets: [
      "Extended ArticuLearn language-learning PWA with production features across frontend and backend surfaces.",
    ],
  },
  {
    id: "codefrost-trulyhappy",
    projectSlug: "trulyhappy",
    title: "Full-stack contributor — TrulyHappy",
    company: "Codefrost",
    location: "Philippines · Remote",
    startDate: "2024-01",
    endDate: "2024-06",
    kind: "employment",
    bullets: [
      "Resumed production development on TrulyHappy PWA after returning from a career break in early 2024.",
    ],
  },
  {
    id: "independent-jwtabs",
    projectSlug: "jw-tabs",
    title: "Sole builder — JW Tabs",
    company: "Independent products",
    location: "Philippines · Remote",
    startDate: "2021-05",
    endDate: "2021-10",
    kind: "independent",
    bullets: [
      "Shipped jwtabs.app MVP for guitar and ukulele tablature with community workflows, billing, and admin moderation.",
    ],
  },
  {
    id: "codefrost-manatal-2021",
    projectSlug: "manatal-coop",
    title: "Full-stack contributor — Manatal Cooperative",
    company: "Codefrost",
    contextLabel: "client",
    location: "Philippines · Remote",
    startDate: "2021-11",
    endDate: "2021-12",
    kind: "client",
    bullets: [
      "Delivered Manatal Cooperative member PWA and Django API financial request flows as first production client work.",
    ],
  },
  {
    id: "codefrost-student-intern",
    title: "Student Web Developer",
    company: "Codefrost",
    employmentType: "Internship",
    location: "Cavite, Calabarzon, Philippines · On-site",
    startDate: "2018-03",
    endDate: "2021-12",
    kind: "employment",
    bullets: [
      "Grew from internship into sustained production web development across Codefrost company products and client deliveries.",
    ],
  },
];

export function getPlanOrderedEngagements(
  engagements: ResumeEngagement[] = resumeEngagements,
): ResumeEngagement[] {
  const planOrder = new Map(
    resumeEngagements.map((engagement, index) => [engagement.id, index]),
  );

  return [...engagements].sort(
    (left, right) =>
      (planOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
      (planOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER),
  );
}

/** @deprecated Prefer getPlanOrderedEngagements — resume display uses locked plan order. */
export function sortEngagementsChronologically(
  engagements: ResumeEngagement[],
): ResumeEngagement[] {
  return getPlanOrderedEngagements(engagements);
}

export function engagementToWorkExperience(
  engagement: ResumeEngagement,
): WorkExperience {
  let company = engagement.company;
  if (engagement.contextLabel) {
    company = `${engagement.company} · ${engagement.contextLabel}`;
  }

  return {
    id: engagement.id,
    company,
    title: engagement.title,
    employmentType: engagement.employmentType,
    location: engagement.location,
    startDate: engagement.startDate,
    endDate: engagement.endDate,
    bullets: engagement.bullets,
  };
}

export function engagementsToWorkExperience(
  engagements: ResumeEngagement[] = resumeEngagements,
): WorkExperience[] {
  return getPlanOrderedEngagements(engagements).map(engagementToWorkExperience);
}

export const sortedResumeEngagements =
  getPlanOrderedEngagements(resumeEngagements);

export const workExperience = engagementsToWorkExperience();
