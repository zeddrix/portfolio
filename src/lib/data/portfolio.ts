import type {
  CapabilityCard,
  PortfolioProfile,
  PortfolioProject,
} from "$lib/types/portfolio";

export const profile: PortfolioProfile = {
  name: "Zeddrix Fabian",
  motto: "I like to work smart, not hard.",
  heroTitle: "Hello, I'm Zeddrix Fabian",
  heroSubtitle:
    "Junior developer and AI Agentic Developer building practical products fast with modern web tooling.",
  about: [
    "I have been developing since 2018 and I enjoy turning complex requirements into simple user experiences with reliable engineering underneath.",
    "I work as an AI Agentic Developer using Cursor IDE and Claude Code to move quickly without sacrificing quality. I specialize in SvelteKit, Angular, and React while staying adaptable to product needs.",
  ],
  experienceSince: "2018",
  specialization: "SvelteKit, Angular, React",
  contactEmail: "zeddrix.fabian@gmail.com",
  websiteUrl: "https://github.com/zeddrix",
};

export const projects: PortfolioProject[] = [
  {
    slug: "queue",
    name: "Queue",
    category: "personal",
    tagline: "PWA for walk-ins, bookings, and operations",
    description:
      "PWA dedicated for walk-in queueing, pre-ordering, reservations, event bookings, reviews, reporting, billing integration, owner/admin dashboards, and chatbot support.",
    techStack: [
      "SvelteKit",
      "TypeScript",
      "Supabase",
      "Cloudflare",
      "Docker",
      "Resend",
      "Groq",
      "Lemon Squeezy",
    ],
    primaryImage: "/queue-1-dashboard.png",
    galleryImages: [
      "/queue-2-analytics.png",
      "/queue-3-events.png",
      "/queue-4-listings.png",
    ],
    links: [],
    detailSections: [
      {
        title: "Problem",
        body: "Small businesses need one workflow for queueing, reservations, pre-orders, and event handling without juggling multiple tools.",
      },
      {
        title: "Approach",
        body: "I designed a modular PWA architecture with shared scheduling, billing, and messaging capabilities so each business mode can grow independently.",
      },
    ],
  },
  {
    slug: "jw-tabs",
    name: "JW Tabs",
    category: "personal",
    tagline: "Tablature platform for guitar and ukulele players",
    description:
      "PWA for rendering guitar and ukulele melody/fingerstyle tabs with commenting, reporting, billing integration, chatbot support, and an admin dashboard.",
    techStack: [
      "SvelteKit",
      "TypeScript",
      "Python",
      "Supabase",
      "Cloudflare",
      "Docker",
      "Resend",
      "Groq",
      "Lemon Squeezy",
    ],
    primaryImage: "/jw-tabs-1-homepage.png",
    galleryImages: ["/jw-tabs-2-tabspage.png"],
    links: [],
    detailSections: [
      {
        title: "Problem",
        body: "Music learners need accessible tablature tools that make discovery, feedback, and monetization straightforward for creators.",
      },
      {
        title: "Approach",
        body: "I focused on rendering performance and moderation workflows while integrating billing and admin controls for sustainable growth.",
      },
    ],
  },
  {
    slug: "iaso",
    name: "Iaso",
    category: "personal",
    tagline: "AI-powered health assistant concept",
    description:
      "AI-powered PWA concept focused on home-based diagnostics guidance, symptom assistance, and healthcare support workflows.",
    techStack: [
      "SvelteKit",
      "TypeScript",
      "Supabase",
      "Cloudflare",
      "Docker",
      "Resend",
      "Groq",
      "Lemon Squeezy",
    ],
    galleryImages: [],
    links: [],
    detailSections: [
      {
        title: "Problem",
        body: "People need immediate guidance before they can reach doctors, but many products are difficult to navigate during urgent moments.",
      },
      {
        title: "Approach",
        body: "I explored a guided diagnostic flow that balances confidence and safety while keeping interface complexity low.",
      },
    ],
  },
  {
    slug: "usedelight",
    name: "UseDelight",
    category: "client",
    tagline: "Landing site and browser extension ecosystem",
    imageFocus: "top",
    description:
      "Live tab page experience with nature media, weather, games, and more, delivered through website and Chrome extension surfaces.",
    techStack: ["SvelteKit", "Node.js", "Django", "Stripe"],
    primaryImage: "/usedelight-1-new-tab.png",
    galleryImages: [
      "/usedelight-2-new-tab.png",
      "/usedelight-3-gallery.png",
      "/usedelight-4-subscription.png",
    ],
    links: [
      { label: "Website", url: "https://usedelight.com/", external: true },
      {
        label: "Chrome Extension",
        url: "https://chromewebstore.google.com/detail/Nature%20Wallpapers%20HD%20video%20New%20Tab%20background/hehbgjdnbibkndghdlilefececadokpb",
        external: true,
      },
    ],
    detailSections: [
      {
        title: "Problem",
        body: "The product needed consistent UX across web and extension contexts while supporting monetization and content discovery.",
      },
      {
        title: "Approach",
        body: "I delivered reusable UI patterns and backend-friendly integration points to keep the ecosystem maintainable.",
      },
    ],
  },
  {
    slug: "adverio-tools",
    name: "Adverio Tools",
    category: "client",
    tagline: "AI-assisted Amazon brand tooling suite",
    imageFocus: "right",
    description:
      "Suite includes ASIN scraper, listing/image analyzer, proposal generation, forecasting, and brand operations tooling for Amazon sellers.",
    techStack: [
      "Angular",
      "Node.js",
      "Python",
      "Django",
      "Docker",
      "Stripe",
      "Redis",
    ],
    primaryImage: "/adverio-tools-1-overview.png",
    galleryImages: [
      "/adverio-tools-2-forecasting.png",
      "/adverio-tools-3-seo-audit-steps.png",
    ],
    links: [
      { label: "Website", url: "https://tools.adverio.io/", external: true },
      {
        label: "Proposal Sample",
        url: "https://proposals.adverio.io/proposals/view/VU8JA16E/",
        external: true,
      },
    ],
    detailSections: [
      {
        title: "Problem",
        body: "Amazon-focused teams needed faster analysis and proposal cycles without moving data between disconnected tools.",
      },
      {
        title: "Approach",
        body: "I helped shape workflows that combine scraping, AI analysis, forecasting, and proposal output in one system.",
      },
    ],
  },
  {
    slug: "trulyhappy",
    name: "TrulyHappy",
    category: "client",
    tagline: "PWA with BFF-oriented architecture",
    description:
      "PWA platform delivered with billing, Redis-backed services, and Backend for Frontend architecture.",
    techStack: [
      "Angular",
      "Node.js",
      "Python",
      "Django",
      "Docker",
      "LemonSqueezy",
      "Redis",
      "BFF",
    ],
    primaryImage: "/trulyhappy.png",
    galleryImages: [],
    links: [
      { label: "Website", url: "https://trulyhappy.app/", external: true },
    ],
    detailSections: [
      {
        title: "Problem",
        body: "The product needed a responsive, subscription-ready experience that remains reliable as feature demand changes.",
      },
      {
        title: "Approach",
        body: "I contributed to implementation decisions across frontend flows and backend integrations to support scaling.",
      },
    ],
  },
  {
    slug: "articulearn",
    name: "Articulearn",
    category: "client",
    tagline: "Learning-focused PWA platform",
    description:
      "PWA project delivered with billing integrations, Redis, and a BFF architecture pattern.",
    techStack: [
      "Angular",
      "Node.js",
      "Python",
      "Django",
      "Docker",
      "LemonSqueezy",
      "Redis",
      "BFF",
    ],
    primaryImage: "/articulearn.png",
    galleryImages: [],
    links: [
      { label: "Website", url: "https://articulearn.app/", external: true },
    ],
    detailSections: [
      {
        title: "Problem",
        body: "The product required a maintainable learning UX with room for rapid feature iteration.",
      },
      {
        title: "Approach",
        body: "I helped establish implementation patterns that keep product updates fast and consistent.",
      },
    ],
  },
  {
    slug: "bolt-to-github",
    name: "Bolt to Github",
    category: "personal",
    tagline: "Tooling workflow for shipping from idea to repo",
    description:
      "Workflow concept focused on accelerating project creation and delivery from rapid prototyping to production-ready GitHub repositories.",
    techStack: ["TypeScript", "Automation Workflows", "GitHub"],
    primaryImage: "/bolt2github.png",
    galleryImages: [],
    links: [],
    detailSections: [
      {
        title: "Problem",
        body: "Early-stage project setup can be repetitive and slow, especially when context-switching across tooling.",
      },
      {
        title: "Approach",
        body: "I use AI-assisted automation to streamline repetitive setup and focus on product-critical decisions.",
      },
    ],
  },
];

export const capabilityCards: CapabilityCard[] = [
  {
    id: "fullstack",
    title: "Full-stack product development",
    description:
      "I ship production-ready features from UI to backend logic with a bias for maintainability and measurable outcomes.",
    highlights: ["SvelteKit", "TypeScript", "Angular", "React", "Github"],
  },
  {
    id: "deployment",
    title: "Deployment and infrastructure",
    description:
      "I work on shipping pipelines and cloud deployment concerns so features reach users quickly and safely.",
    highlights: [
      "Cloudflare",
      "Supabase",
      "Docker Containerization",
      "NodeJS",
      "Python",
    ],
  },
  {
    id: "ai-workflow",
    title: "AI-assisted workflows",
    description:
      "I leverage AI tools for rapid iteration, but I keep engineering decisions grounded in testing, type safety, and delivery quality.",
    highlights: ["Cursor IDE", "Claude Code", "AI Agentic Developer"],
  },
];

export const highlightProjectSlugs = [
  "usedelight",
  "adverio-tools",
  "queue",
  "jw-tabs",
  "iaso",
] as const;

export const highlightProjects = highlightProjectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is PortfolioProject => project !== undefined);

export const personalProjects = projects.filter(
  (project) => project.category === "personal",
);
export const clientProjects = projects.filter(
  (project) => project.category === "client",
);

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return projects.find((project) => project.slug === slug);
}
