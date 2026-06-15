import type {
  CapabilityBand,
  CapabilityBandGroup,
  CapabilityBandLayoutMode,
  PortfolioProfile,
  PortfolioProject,
  ToolStripGroup,
  ToolStripItem,
  WorkSectionLayoutMode,
  WorkProjectFilter,
} from "$lib/types/portfolio";
import { filterProjectsByWorkFilter } from "$lib/utils/portfolio-display";

export const profile: PortfolioProfile = {
  name: "Zeddrix Fabian",
  motto: "I like to work smart, not hard.",
  heroTitle: "Hello, I'm Zeddrix Fabian",
  heroSubtitle:
    "Full-stack web app developer shipping production apps with AI-accelerated workflows.",
  heroProof: "10",
  about: [
    "I have been developing since 2018 and I enjoy turning complex requirements into simple user experiences with reliable engineering underneath.",
    "I like to work smart, not hard. So now I utilize AI tools such as Cursor and Claude Code to move quickly without sacrificing quality, using the Acceptance Test-Driven Development (ATDD) approach.",
    "I specialize in SvelteKit, React, and Angular while staying adaptable to product needs. With AI tools, I think it's not an exaggeration to say that I can work on any development project 'til shipped.",
  ],
  experienceSince: "2018",
  specialization: "SvelteKit, React, Angular",
  contactEmail: "zeddrix.fabian@gmail.com",
  websiteUrl: "https://github.com/zeddrix",
};

export const projects: PortfolioProject[] = [
  {
    slug: "queue",
    name: "Queue",
    category: "personal",
    status: "live",
    role: "Sole builder",
    outcome:
      "Unified walk-in, booking, and operations flows in one installable PWA with billing and admin tooling.",
    displayDomain: "queue.place",
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
      "/chatbot-start.png",
      "/chatbot-placement-in-full-dashboard.png",
    ],
    links: [],
    detailSections: [
      {
        title: "Problem",
        body: "Small businesses need one workflow for queueing, reservations, pre-orders, and event handling without juggling multiple tools.",
      },
      {
        title: "Approach",
        body: "I designed a modular PWA architecture with shared scheduling, billing, and messaging capabilities so each business mode can grow independently. Embedded Support Chat uses Groq-backed guidance to answer owner questions in context without leaving the dashboard.",
      },
    ],
  },
  {
    slug: "jw-tabs",
    name: "JW Tabs",
    category: "personal",
    status: "live",
    role: "Sole builder",
    outcome:
      "Tablature rendering and community workflows with billing, moderation, and admin controls in one product surface.",
    displayDomain: "jwtabs.app",
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
    slug: "merns-shop",
    name: "MERN's Shop",
    category: "personal",
    status: "live",
    role: "Sole builder",
    outcome:
      "Live electronics e-commerce with ~170 products, PayPal checkout, admin ops, installable PWA, and 100+ automated tests.",
    displayDomain: "merns-shop.onrender.com",
    tagline: "Full-stack MERN e-commerce with PWA and ATDD",
    description:
      "Production-style electronics store for phones, tablets, TVs, and consoles — catalog browsing with variants and filters, guest and registered checkout via PayPal sandbox, admin panel for products/orders/users, installable PWA with web push, SEO for crawlers, and ATDD with Playwright + Vitest. Modernized from a 2021 Udemy exercise to a 2026 portfolio centerpiece on MongoDB Atlas and Render.",
    techStack: [
      "React",
      "TypeScript",
      "Express",
      "MongoDB",
      "Redux Toolkit",
      "Vite",
      "Mongoose",
      "PayPal",
      "PWA",
      "Playwright",
      "Vitest",
      "Docker",
      "Render",
    ],
    primaryImage: "/merns-shop-1-homepage.png",
    galleryImages: [
      "/merns-shop-2-product.png",
      "/merns-shop-4-checkout.png",
      "/merns-shop-3-admin.png",
      "/render-dashboard-merns-shop.png",
      "/atdd-playwright-e2e.png",
    ],
    links: [
      {
        label: "Live demo",
        url: "https://merns-shop.onrender.com/",
        external: true,
      },
      {
        label: "Source",
        url: "https://github.com/zeddrix/merns-shop",
        external: true,
      },
    ],
    detailSections: [
      {
        title: "Problem",
        body: "Portfolio e-commerce demos often stop at basic CRUD. Real stores need variant catalogs, payment flows, admin operations, mobile UX, SEO, and test coverage that catches regressions across the stack.",
      },
      {
        title: "Approach",
        body: "I built a deployable MERN app with a rich gadget catalog, PayPal checkout, httpOnly cookie auth, admin workflows, PWA + push notifications, and ATDD — acceptance tests first, then integration and unit layers, with CI gates on every push.",
      },
    ],
  },
  {
    slug: "answeriq",
    name: "AnswerIQ",
    category: "client",
    status: "live",
    role: "Full-stack contributor",
    outcome:
      "Live multi-tenant SaaS that turns PAA queries into SEO FAQ articles, publishes to Shopify, bills via Stripe, and ships an admin console with audit logs — backed by Playwright, Jest, and Vitest ATDD.",
    displayDomain: "answeriq.io",
    tagline: "AI-powered FAQ generation SaaS for Shopify SEO",
    description:
      "Production SaaS for Shopify merchants: SerpAPI pulls People Also Ask questions, GPT-4.1 generates 400–600 word FAQ articles, and a review workflow publishes to Shopify blogs with SEO meta, tags, and sitemap updates. Includes LLMs.txt generation for AI-readable store docs, workspace RBAC with PostgreSQL row-level security, encrypted API credentials, Stripe subscriptions with trials and usage credits, and a full admin console for users, workspaces, billing sync, and audit logs — deployed on AWS EC2 with PM2.",
    techStack: [
      "React",
      "TypeScript",
      "Express",
      "PostgreSQL",
      "Vite",
      "Tailwind CSS",
      "OpenAI",
      "SerpAPI",
      "Shopify",
      "Stripe",
      "JWT",
      "Playwright",
      "Jest",
      "Vitest",
      "Docker",
      "Recharts",
      "AWS EC2",
      "PM2",
    ],
    primaryImage: "/answeriq-1-dashboard.png",
    galleryImages: [
      "/answeriq-2-articles.png",
      "/answeriq-3-profile.png",
      "/answeriq-4-settings.png",
      "/answeriq-5-admin-dashboard.png",
      "/answeriq-6-admin-users.png",
      "/answeriq-7-admin-subscriptions.png",
      "/answeriq-8-admin-workspaces.png",
      "/answeriq-9-admin-system-settings.png",
    ],
    links: [
      {
        label: "Live demo",
        url: "https://answeriq.io/",
        external: true,
      },
    ],
    detailSections: [
      {
        title: "Problem",
        body: "Shopify stores miss long-tail SEO traffic from People Also Ask queries, and manual FAQ content creation is slow. Stores also lack AI-readable discovery files that help LLM crawlers understand their catalog.",
      },
      {
        title: "Approach",
        body: "I contributed to the end-to-end SaaS across workspace isolation, the keyword-to-publish pipeline, Stripe billing, and the admin console — with Playwright journeys, integration tests, and unit coverage.",
      },
    ],
  },
  {
    slug: "iaso",
    name: "Iaso",
    category: "personal",
    status: "concept",
    role: "Sole builder",
    outcome:
      "Explored a guided diagnostic UX that balances safety and clarity for at-home health assistance.",
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
    status: "live",
    role: "Full-stack contributor",
    outcome:
      "Consistent web and Chrome extension experiences with subscription flows and content discovery.",
    displayDomain: "usedelight.com",
    tagline: "Landing site and browser extension ecosystem",
    imageFocus: "top",
    description:
      "Live tab page experience with nature media, weather, games, and more, delivered through website and Chrome extension surfaces.",
    techStack: ["SvelteKit", "Node.js", "Django", "Stripe"],
    primaryImage: "/usedelight-1-new-tab.png",
    galleryImages: [
      "/usedelight-2-new-tab.png",
      "/usedelight-3-new-tab.png",
      "/usedelight-4-gallery.png",
      "/usedelight-5-subscription.png",
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
    status: "live",
    role: "Full-stack contributor",
    outcome:
      "Connected scraping, AI analysis, forecasting, and proposal generation in one Amazon seller toolkit.",
    displayDomain: "tools.adverio.io",
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
    status: "live",
    role: "Full-stack contributor",
    outcome:
      "Subscription-ready PWA with Redis-backed services and a maintainable BFF architecture.",
    displayDomain: "trulyhappy.app",
    tagline: "PWA with BFF-oriented architecture",
    description:
      "PWA platform delivered with billing, Redis-backed services, and Backend for Frontend architecture.",
    techStack: [
      "Angular",
      "NestJS",
      "TypeScript",
      "Python",
      "Django",
      "BFF",
      "PostgreSQL",
      "Redis",
      "Firebase",
      "Strapi",
      "Docker",
      "nginx",
      "Nx",
      "GitHub Actions",
      "DigitalOcean",
      "AWS S3",
      "Lemon Squeezy",
      "Anthropic Claude",
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
    status: "live",
    role: "Full-stack contributor",
    outcome:
      "Learning UX patterns that support rapid iteration with billing and BFF integrations.",
    displayDomain: "articulearn.app",
    tagline: "Learning-focused PWA platform",
    description:
      "PWA project delivered with billing integrations, Redis, and a BFF architecture pattern.",
    techStack: [
      "Angular",
      "NestJS",
      "TypeScript",
      "Python",
      "Django",
      "BFF",
      "PostgreSQL",
      "Redis",
      "Firebase",
      "Strapi",
      "Docker",
      "nginx",
      "Nx",
      "GitHub Actions",
      "DigitalOcean",
      "AWS S3",
      "Lemon Squeezy",
      "Anthropic Claude",
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
    category: "client",
    status: "live",
    role: "Full-stack contributor",
    outcome:
      "Shipped a live workflow that moves prototypes to production-ready GitHub repositories with AI-assisted automation.",
    tagline: "Live tooling workflow for shipping from idea to repo",
    description:
      "Live client workflow for accelerating project creation and delivery from rapid prototyping to production-ready GitHub repositories.",
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

export const defaultCapabilityBandLayoutMode: CapabilityBandLayoutMode =
  "groupedBands";

export const defaultWorkSectionLayoutMode: WorkSectionLayoutMode =
  "featuredGrid";

export const caseStudyProjectSlugs = [
  "usedelight",
  "adverio-tools",
  "queue",
  "merns-shop",
  "answeriq",
] as const;

export const capabilityBands: CapabilityBand[] = [
  {
    id: "fullstack",
    title: "Full-stack development",
    description:
      "End-to-end product work across frontend UX and backend logic, from API design to polished interfaces.",
    highlights: [
      "SvelteKit",
      "TypeScript",
      "Angular",
      "React",
      "Express",
      "MongoDB",
      "Node.js",
      "Python",
      "NestJS",
      "Strapi",
      "AnswerIQ",
    ],
    relatedProjectSlugs: [
      "jw-tabs",
      "queue",
      "merns-shop",
      "answeriq",
      "adverio-tools",
      "trulyhappy",
      "articulearn",
    ],
    visual: {
      type: "screenshot",
      image: "/jw-tabs-1-homepage.png",
    },
  },
  {
    id: "pwa",
    title: "PWA",
    description:
      "Installable progressive web apps with responsive flows built for real-world mobile and desktop usage.",
    highlights: [
      "Queue",
      "JW Tabs",
      "MERN's Shop",
      "TrulyHappy",
      "Articulearn",
      "Angular SSR",
    ],
    relatedProjectSlugs: [
      "queue",
      "jw-tabs",
      "merns-shop",
      "trulyhappy",
      "articulearn",
    ],
    visual: {
      type: "screenshot",
      images: ["/pwa-queue-desktop.png", "/pwa-queue-mobile.png"],
      imageLayout: "split",
    },
  },
  {
    id: "billing",
    title: "Billing integration",
    description:
      "Subscription flows with Stripe and Lemon Squeezy across client and personal products.",
    highlights: ["Stripe", "Lemon Squeezy", "UseDelight", "Queue", "AnswerIQ"],
    relatedProjectSlugs: [
      "usedelight",
      "queue",
      "trulyhappy",
      "articulearn",
      "answeriq",
    ],
    visual: {
      type: "hybrid",
      image: "/lemonsqueezy-dashboard.png",
      icons: ["billing"],
      badges: ["Stripe", "Lemon Squeezy"],
    },
  },
  {
    id: "admin-dashboard",
    title: "Admin Dashboard",
    description:
      "Owner and admin dashboards for operations, analytics, moderation, and day-to-day product control.",
    highlights: [
      "Queue",
      "JW Tabs",
      "MERN's Shop",
      "Adverio Tools",
      "AnswerIQ",
    ],
    relatedProjectSlugs: [
      "queue",
      "jw-tabs",
      "merns-shop",
      "adverio-tools",
      "answeriq",
    ],
    visual: {
      type: "screenshot",
      image: "/answeriq-5-admin-dashboard.png",
    },
  },
  {
    id: "chatbot",
    title: "Chatbot",
    description:
      "AI-assisted support and guided workflows that help users move faster without adding UI complexity.",
    highlights: ["Groq", "Anthropic Claude", "Queue", "JW Tabs", "Iaso"],
    relatedProjectSlugs: ["queue", "jw-tabs", "iaso", "trulyhappy"],
    visual: {
      type: "hybrid",
      images: [
        "/chatbot-start.png",
        "/chatbot-placement-in-full-dashboard.png",
      ],
      imageLayout: "carousel",
      icons: ["chatbot"],
      badges: ["Groq", "Anthropic Claude"],
    },
  },
  {
    id: "docker",
    title: "Docker Containerization",
    description:
      "Containerized services and repeatable environments for safer local development and production delivery.",
    highlights: ["Docker", "Node.js", "Python", "Django", "Nx", "nginx"],
    relatedProjectSlugs: [
      "queue",
      "merns-shop",
      "answeriq",
      "adverio-tools",
      "trulyhappy",
      "articulearn",
    ],
    visual: {
      type: "screenshot",
      image: "/docker-desktop.png",
    },
  },
  {
    id: "deployment",
    title: "Website Domain and Deployment",
    description:
      "Domain setup, hosting, and production rollout on Cloudflare and modern web deployment stacks.",
    highlights: [
      "Namecheap",
      "Cloudflare",
      "Render",
      "AWS EC2",
      "AnswerIQ",
      "Custom domains",
      "DigitalOcean",
      "GitHub Actions",
      "AWS S3",
    ],
    relatedProjectSlugs: [
      "usedelight",
      "queue",
      "merns-shop",
      "answeriq",
      "trulyhappy",
      "articulearn",
    ],
    visual: {
      type: "hybrid",
      images: [
        "/namecheap-dashboard-domain.png",
        "/cloudflare-dashboard.png",
        "/cloudflare-deployments.png",
        "/render-dashboard-merns-shop.png",
      ],
      imageLayout: "carousel",
      icons: ["deployment"],
      badges: ["Namecheap", "Cloudflare", "Render"],
    },
  },
  {
    id: "atdd",
    title: "Acceptance-test-driven development (ATDD)",
    description:
      "I define critical user journeys in focused end-to-end tests first, then layer integration and unit tests so each release ships with clear behavior and fewer regressions.",
    highlights: [
      "MERN's Shop",
      "AnswerIQ",
      "Playwright journeys",
      "End-to-end tests",
      "Integration tests",
      "Unit tests",
      "User journeys",
    ],
    relatedProjectSlugs: ["merns-shop", "answeriq"],
    visual: {
      type: "hybrid",
      image: "/atdd-playwright-e2e.png",
      icons: ["testing"],
      badges: ["Playwright", "Vitest"],
    },
  },
];

export const capabilityBandGroups: CapabilityBandGroup[] = [
  {
    id: "product-foundations",
    title: "Product foundations",
    description:
      "Core product engineering from full-stack delivery to installable PWA experiences.",
    bands: capabilityBands.filter((band) =>
      ["fullstack", "pwa"].includes(band.id),
    ),
  },
  {
    id: "monetization-operations",
    title: "Monetization and operations",
    description:
      "Billing, admin control, and AI-assisted support built into shipped products.",
    bands: capabilityBands.filter((band) =>
      ["billing", "admin-dashboard", "chatbot"].includes(band.id),
    ),
  },
  {
    id: "shipping-infra",
    title: "Shipping and infrastructure",
    description:
      "Containerized delivery, domain setup, and production deployment workflows.",
    bands: capabilityBands.filter((band) =>
      ["deployment", "docker"].includes(band.id),
    ),
  },
  {
    id: "quality-atdd",
    title: "Testing & ATDD",
    description:
      "Quality built from the user journey down—focused E2E specs, integration tests, and unit tests.",
    bands: capabilityBands.filter((band) => band.id === "atdd"),
  },
];

export const toolStripGroups: ToolStripGroup[] = [
  {
    id: "ai-delivery",
    title: "AI-accelerated delivery",
    items: [
      { id: "cursor", label: "Cursor IDE" },
      { id: "claude", label: "Claude Code" },
      { id: "anthropic-claude", label: "Anthropic Claude" },
    ],
  },
  {
    id: "frontend-frameworks",
    title: "Frontend frameworks",
    items: [
      { id: "svelte", label: "Svelte" },
      { id: "sveltekit", label: "SvelteKit" },
      { id: "react", label: "React" },
      { id: "react-native", label: "React Native" },
      { id: "nextjs", label: "Next.js" },
      { id: "angular", label: "Angular" },
      { id: "angular-ssr-pwa", label: "Angular SSR & PWA" },
    ],
  },
  {
    id: "frontend-libraries",
    title: "Frontend libraries & patterns",
    items: [
      { id: "redux", label: "Redux" },
      { id: "context-api", label: "Context API" },
      { id: "rxjs", label: "RxJS" },
      { id: "ng-bootstrap", label: "ng-bootstrap" },
      { id: "chartjs", label: "Chart.js" },
    ],
  },
  {
    id: "languages",
    title: "Languages",
    items: [
      { id: "typescript", label: "TypeScript" },
      { id: "python", label: "Python" },
      { id: "vanilla-js", label: "Vanilla JS" },
    ],
  },
  {
    id: "backend-architecture",
    title: "Backend & architecture",
    items: [
      { id: "nodejs", label: "Node.js (Express, NestJS)" },
      { id: "nestjs", label: "NestJS" },
      { id: "django", label: "Django" },
      { id: "bff", label: "BFF" },
      { id: "strapi", label: "Strapi" },
      { id: "firebase", label: "Firebase" },
      { id: "swagger", label: "Swagger (OpenAPI)" },
      { id: "nginx", label: "nginx" },
    ],
  },
  {
    id: "data-storage",
    title: "Data & storage",
    items: [
      { id: "supabase", label: "Supabase" },
      { id: "postgresql", label: "PostgreSQL" },
      { id: "mongodb", label: "MongoDB" },
      { id: "mysql", label: "MySQL" },
      { id: "redis", label: "Redis" },
      { id: "aws-s3", label: "AWS S3" },
    ],
  },
  {
    id: "styling-ui",
    title: "Styling & UI",
    items: [
      { id: "css", label: "CSS" },
      { id: "sass", label: "SASS" },
      { id: "tailwind-css", label: "Tailwind CSS" },
      { id: "material-ui", label: "Material UI" },
      { id: "bootstrap", label: "Bootstrap" },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    items: [
      { id: "jest", label: "Jest" },
      { id: "vitest", label: "Vitest" },
      { id: "supertest", label: "Supertest" },
      { id: "react-testing-library", label: "React Testing Library" },
      { id: "cypress", label: "Cypress" },
      { id: "playwright", label: "Playwright" },
      { id: "storybook", label: "Storybook" },
    ],
  },
  {
    id: "devops-platforms",
    title: "DevOps, platforms & workflow",
    items: [
      { id: "cloudflare", label: "Cloudflare" },
      { id: "docker", label: "Docker" },
      { id: "git", label: "Git" },
      { id: "github", label: "GitHub" },
      { id: "github-actions", label: "GitHub Actions" },
      { id: "nx", label: "Nx" },
      { id: "digitalocean", label: "DigitalOcean" },
      { id: "render", label: "Render" },
      { id: "stripe", label: "Stripe" },
      { id: "aws-ec2", label: "AWS EC2" },
      { id: "lemon-squeezy", label: "Lemon Squeezy" },
      { id: "yarn", label: "Yarn" },
      { id: "wordpress", label: "WordPress" },
      { id: "namecheap", label: "Namecheap" },
    ],
  },
];

export const toolStripItems: ToolStripItem[] = toolStripGroups.flatMap(
  (group) => group.items,
);

export const highlightProjectSlugs = [
  "usedelight",
  "adverio-tools",
  "queue",
  "jw-tabs",
  "merns-shop",
  "answeriq",
  "iaso",
] as const;

export const highlightProjects = highlightProjectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is PortfolioProject => project !== undefined);

export const caseStudyProjects = caseStudyProjectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is PortfolioProject => project !== undefined);

export const personalProjects = projects.filter(
  (project) => project.category === "personal",
);
export const clientProjects = projects.filter(
  (project) => project.category === "client",
);

export const personalProjectCount = personalProjects.length;
export const clientProjectCount = clientProjects.length;

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getBandsForProject(slug: string): CapabilityBand[] {
  return capabilityBands.filter((band) =>
    band.relatedProjectSlugs.includes(slug),
  );
}

export function getProjectsForWorkFilter(
  filter: WorkProjectFilter,
): PortfolioProject[] {
  return filterProjectsByWorkFilter(projects, filter);
}

export function getMoreProjectsForCaseStudies(): PortfolioProject[] {
  const caseStudySet = new Set<string>(caseStudyProjectSlugs);
  return projects.filter((project) => !caseStudySet.has(project.slug));
}
