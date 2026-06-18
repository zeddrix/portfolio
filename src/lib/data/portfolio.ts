import type {
  CapabilityBand,
  CapabilityBandGroup,
  CapabilityBandLayoutMode,
  PortfolioProject,
  ToolStripGroup,
  ToolStripItem,
  WorkProjectFilter,
} from "$lib/types/portfolio";
import { filterProjectsByWorkFilter } from "$lib/utils/portfolio-display";

export { profile } from "$lib/data/profile";

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
    primaryImage: "/queue-1-dashboard.webp",
    galleryImages: [
      "/queue-2-analytics.webp",
      "/queue-3-events.webp",
      "/queue-4-listings.webp",
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
    resumeContext: { productOwner: "personal" },
    resumePeriod: { startDate: "2026-01" },
    displayPeriod: "Jan 2026 – present",
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
    primaryImage: "/jw-tabs-1-homepage.webp",
    galleryImages: ["/jw-tabs-2-tabspage.webp"],
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
    resumeContext: { productOwner: "personal" },
    resumePeriod: {
      startDate: "2021-05",
      endDate: "2021-10",
      note: "MVP shipped Oct 2021",
    },
    displayPeriod: "May 2021 – present (MVP Oct 2021)",
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
    primaryImage: "/merns-shop-1-homepage.webp",
    galleryImages: [
      "/merns-shop-2-product.webp",
      "/merns-shop-4-checkout.webp",
      "/merns-shop-3-admin.webp",
      "/render-dashboard-merns-shop.webp",
      "/atdd-playwright-e2e.webp",
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
    resumeContext: { productOwner: "personal" },
    resumePeriod: {
      startDate: "2026-06",
      note: "Modernization; Apr 2021 Udemy course build",
    },
    displayPeriod: "Apr 2021 (course) · Modernized Jun 2026 – present",
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
    primaryImage: "/answeriq-1-landingpage.webp",
    galleryImages: [
      "/answeriq-2-dashboard.webp",
      "/answeriq-3-articles.webp",
      "/answeriq-4-profile.webp",
      "/answeriq-5-settings.webp",
      "/answeriq-6-admin-dashboard.webp",
      "/answeriq-7-admin-users.webp",
      "/answeriq-8-admin-workspaces.webp",
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
    resumeContext: {
      productOwner: "client",
      clientBrand: "AnswerIQ",
    },
    resumePeriod: { startDate: "2025-09", endDate: "2025-10" },
    displayPeriod: "Sep–Oct 2025",
  },
  {
    slug: "iaso",
    name: "Iaso",
    category: "personal",
    status: "concept",
    hiddenFromPortfolio: true,
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
    resumeContext: { productOwner: "personal" },
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
    primaryImage: "/usedelight-1-new-tab.webp",
    galleryImages: [
      "/usedelight-2-new-tab.webp",
      "/usedelight-3-new-tab.webp",
      "/usedelight-4-gallery.webp",
      "/usedelight-5-subscription.webp",
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
    resumeContext: {
      employer: "Codefrost",
      productOwner: "client",
      clientBrand: "UseDelight",
    },
    resumePeriod: { startDate: "2025-01", endDate: "2025-07" },
    displayPeriod: "Jan–Jul 2025",
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
    primaryImage: "/adverio-tools-1-overview.webp",
    galleryImages: [
      "/adverio-tools-2-forecasting.webp",
      "/adverio-tools-3-seo-audit-steps.webp",
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
    resumeContext: {
      employer: "Codefrost",
      productOwner: "client",
      clientBrand: "Adverio",
    },
    resumePeriod: { startDate: "2025-08", endDate: "2026-05" },
    displayPeriod: "Aug 2025 – May 2026",
  },
  {
    slug: "trulyhappy",
    name: "TrulyHappy",
    category: "client",
    status: "live",
    role: "Full-stack contributor",
    outcome:
      "Mental wellbeing PWA with guided habits, mood tracking, missions, and subscription-ready billing.",
    displayDomain: "trulyhappy.app",
    tagline: "Mental wellbeing PWA with guided habits and subscriptions",
    description:
      "Angular SSR PWA for happiness journeys — mood tracking, missions (timer, checklist, and text), journal, streaks, AI-generated missions (Claude), and Lemon Squeezy billing. NestJS BFF + Django API + Redis in an Nx monorepo.",
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
    primaryImage: "/trulyhappy.webp",
    galleryImages: [],
    links: [
      { label: "Website", url: "https://trulyhappy.app/", external: true },
    ],
    detailSections: [
      {
        title: "Problem",
        body: "A subscription-ready wellbeing product needed reliable mobile UX as feature demand grew across habits, mood tracking, and guided missions.",
      },
      {
        title: "Approach",
        body: "I contributed across Angular flows and backend integrations using a BFF pattern that isolates Django and Redis services from the PWA.",
      },
    ],
    resumeContext: {
      employer: "Codefrost",
      productOwner: "codefrost",
    },
    resumePeriod: { startDate: "2024-01", endDate: "2024-06" },
    displayPeriod: "Jan–Jun 2024",
  },
  {
    slug: "articulearn",
    name: "Articulearn",
    category: "client",
    status: "live",
    role: "Full-stack contributor",
    outcome:
      "Language speaking practice PWA with audio shadowing, segmented sessions, and subscription billing.",
    displayDomain: "articulearn.app",
    tagline: "AI-assisted language speaking practice PWA",
    description:
      "Angular SSR PWA for listen-and-repeat audio shadowing — segmented practice sessions, library filters (category, difficulty, voice), profile uploads, and Lemon Squeezy subscriptions. NestJS BFF + Django + Redis with WaveSurfer.js waveforms.",
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
      "WaveSurfer.js",
    ],
    primaryImage: "/articulearn.webp",
    galleryImages: [],
    links: [
      { label: "Website", url: "https://articulearn.app/", external: true },
    ],
    detailSections: [
      {
        title: "Problem",
        body: "Language learners needed a maintainable speaking-practice UX with segmented audio, library discovery, and room for rapid iteration.",
      },
      {
        title: "Approach",
        body: "I helped establish BFF-backed practice flows and waveform-driven shadowing sessions that keep product updates fast and consistent.",
      },
    ],
    resumeContext: {
      employer: "Codefrost",
      productOwner: "codefrost",
    },
    resumePeriod: { startDate: "2024-07", endDate: "2024-12" },
    displayPeriod: "Jul–Dec 2024",
  },
  {
    slug: "bolt-to-github",
    name: "Bolt to Github",
    category: "client",
    status: "live",
    role: "Full-stack contributor",
    outcome:
      "Chrome extension that intercepts Bolt.new ZIP exports and pushes projects to GitHub with PAT or App auth.",
    displayDomain: "bolt2github.com",
    tagline: "Chrome extension bridging Bolt.new exports to GitHub repos",
    description:
      "Manifest V3 Chrome extension (Svelte + TypeScript) intercepts Bolt.new ZIP downloads, extracts in-browser, and pushes to GitHub via PAT or GitHub App auth. Includes diff preview, project dashboard, issues panel, Supabase-backed premium tier, and a Vitest + Playwright test suite — published on the Chrome Web Store.",
    techStack: [
      "Svelte",
      "TypeScript",
      "Chrome Extension (MV3)",
      "Vite",
      "Supabase",
      "GitHub API",
      "Vitest",
      "Playwright",
      "Tailwind CSS",
    ],
    primaryImage: "/bolt2github.webp",
    galleryImages: [],
    links: [
      { label: "Website", url: "https://bolt2github.com/", external: true },
      {
        label: "Chrome Extension",
        url: "https://chromewebstore.google.com/detail/pikdepbilbnnpgdkdaaoeekgflljmame",
        external: true,
      },
    ],
    detailSections: [
      {
        title: "Problem",
        body: "Bolt.new exports full project ZIPs, but developers still repeat manual unzip-and-push steps before code lands in version control.",
      },
      {
        title: "Approach",
        body: "I contributed to a Manifest V3 extension that intercepts exports client-side, respects .gitignore rules, and automates GitHub pushes with diff preview and project sync.",
      },
    ],
    resumeContext: {
      employer: "Codefrost",
      productOwner: "codefrost",
    },
    resumePeriod: { startDate: "2025-09", endDate: "2025-12" },
    displayPeriod: "Sep–Dec 2025",
  },
  {
    slug: "manatal-coop",
    name: "Manatal Coop",
    category: "client",
    status: "live",
    role: "Full-stack contributor",
    outcome:
      "Cooperative member banking PWA with financial request workflows, offline caching, and push notifications.",
    displayDomain: "manatalcoop.app",
    tagline: "Member banking PWA for a Philippine credit union",
    description:
      "Production fintech platform for Manatal Cooperative — Django REST API (OAuth2, PostgreSQL, Celery, S3, FCM) and a Svelte PWA member app with account dashboards, cash withdrawal and transfer requests, loan applications, store orders, CMS content, calculators, QR/barcode tools, offline caching, and push notifications. Deployed on DigitalOcean (API) and AWS Amplify (PWA).",
    techStack: [
      "Svelte",
      "TypeScript",
      "Django",
      "Django REST Framework",
      "PostgreSQL",
      "Celery",
      "Redis",
      "OAuth2",
      "AWS S3",
      "Firebase FCM",
      "Docker",
      "AWS Amplify",
      "PWA",
    ],
    primaryImage: "/manatal-coop-homepage.webp",
    galleryImages: ["/manatal-coop-signin.webp", "/manatal-coop-chatbot.webp"],
    galleryColumns: 3,
    links: [
      {
        label: "Member app",
        url: "https://manatalcoop.app/",
        external: true,
      },
    ],
    detailSections: [
      {
        title: "Problem",
        body: "A credit union needed a mobile-first member portal for account visibility, financial requests, and policy content without forcing branch visits for routine transactions.",
      },
      {
        title: "Approach",
        body: "I contributed to the Svelte member app and Django API — wiring financial request forms (withdrawal, transfer, express loan), shared transfer-method components, and form validation UX across light and dark themes.",
      },
    ],
    resumeContext: {
      employer: "Codefrost",
      productOwner: "client",
      clientBrand: "Manatal Cooperative",
    },
    resumePeriod: {
      startDate: "2021-11",
      endDate: "2021-12",
      note: "Returned Jun 2026",
    },
    displayPeriod: "Nov–Dec 2021 · Jun 2026 – present",
  },
];

export const defaultCapabilityBandLayoutMode: CapabilityBandLayoutMode =
  "sevenBands";

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
      "manatal-coop",
    ],
    visual: {
      type: "screenshot",
      image: "/jw-tabs-1-homepage.webp",
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
      "manatal-coop",
    ],
    visual: {
      type: "screenshot",
      images: ["/pwa-queue-desktop.webp", "/pwa-queue-mobile.webp"],
      imageLayout: "split",
    },
  },
  {
    id: "billing",
    title: "Billing integration",
    description:
      "Subscription and checkout flows with Stripe, Lemon Squeezy, and PayPal across client and personal products.",
    highlights: [
      "Stripe",
      "Lemon Squeezy",
      "PayPal",
      "MERN's Shop",
      "UseDelight",
      "Queue",
      "AnswerIQ",
    ],
    relatedProjectSlugs: [
      "usedelight",
      "queue",
      "trulyhappy",
      "articulearn",
      "answeriq",
      "merns-shop",
    ],
    visual: {
      type: "hybrid",
      imageLayout: "carousel",
      icons: ["billing"],
      badges: ["Stripe", "Lemon Squeezy", "PayPal"],
      slides: [
        {
          src: "/lemonsqueezy-dashboard.webp",
          frame: "browser",
          domain: "lemonsqueezy.com",
        },
        {
          src: "/merns-shop-4-checkout.webp",
          frame: "browser",
          domain: "merns-shop.onrender.com",
        },
      ],
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
      image: "/answeriq-6-admin-dashboard.webp",
    },
  },
  {
    id: "chatbot",
    title: "Chatbot",
    description:
      "AI-assisted support and guided workflows that help users move faster without adding UI complexity.",
    highlights: ["Groq", "Anthropic Claude", "Queue", "JW Tabs", "Iaso"],
    relatedProjectSlugs: [
      "queue",
      "jw-tabs",
      "iaso",
      "trulyhappy",
      "manatal-coop",
    ],
    visual: {
      type: "hybrid",
      imageLayout: "carousel",
      icons: ["chatbot"],
      badges: ["Groq", "Anthropic Claude"],
      slides: [
        {
          src: "/manatal-coop-chatbot.webp",
          frame: "phone",
          domain: "manatalcoop.app",
        },
        {
          src: "/chatbot-placement-in-full-dashboard.webp",
          frame: "browser",
          domain: "queue.place",
        },
      ],
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
      "manatal-coop",
    ],
    visual: {
      type: "screenshot",
      image: "/docker-desktop.webp",
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
      "manatal-coop",
    ],
    visual: {
      type: "hybrid",
      imageLayout: "carousel",
      icons: ["deployment"],
      badges: ["Namecheap", "Cloudflare", "Render"],
      slides: [
        {
          src: "/namecheap-dashboard-domain.webp",
          frame: "browser",
          domain: "namecheap.com",
        },
        {
          src: "/cloudflare-dashboard.webp",
          frame: "browser",
          domain: "cloudflare.com",
        },
        {
          src: "/cloudflare-deployments.webp",
          frame: "browser",
          domain: "cloudflare.com",
        },
        {
          src: "/render-dashboard-merns-shop.webp",
          frame: "browser",
          domain: "render.com",
        },
      ],
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
      image: "/atdd-playwright-e2e.webp",
      icons: ["testing"],
      badges: ["Playwright", "Vitest"],
    },
  },
];

const pwaBandVisual = capabilityBands.find((band) => band.id === "pwa")!.visual;

export const capabilityBandGroups: CapabilityBandGroup[] = [
  {
    id: "product-foundations",
    title: "Product foundations",
    description:
      "Core product engineering from full-stack delivery to installable PWA experiences.",
    visual: pwaBandVisual,
    bands: capabilityBands.filter((band) =>
      ["fullstack", "pwa"].includes(band.id),
    ),
  },
  {
    id: "monetization-operations",
    title: "Monetization and operations",
    description:
      "Billing, admin control, and AI-assisted support built into shipped products.",
    visual: {
      type: "screenshot",
      imageLayout: "carousel",
      autoRotate: true,
      slides: [
        {
          src: "/lemonsqueezy-dashboard.webp",
          frame: "browser",
          domain: "lemonsqueezy.com",
        },
        {
          src: "/answeriq-6-admin-dashboard.webp",
          frame: "browser",
          domain: "answeriq.io",
        },
      ],
    },
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
      { id: "paypal", label: "PayPal" },
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
  "manatal-coop",
  "merns-shop",
  "jw-tabs",
  "answeriq",
] as const;

export function isPortfolioProjectVisible(project: PortfolioProject): boolean {
  return !project.hiddenFromPortfolio;
}

export const visibleProjects = projects.filter(isPortfolioProjectVisible);

export const highlightProjects = highlightProjectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is PortfolioProject => project !== undefined)
  .filter(isPortfolioProjectVisible);

const highlightSlugSet = new Set<string>(highlightProjectSlugs);

export const carouselProjects = [
  ...highlightProjects,
  ...visibleProjects.filter((project) => !highlightSlugSet.has(project.slug)),
];

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
  return filterProjectsByWorkFilter(visibleProjects, filter);
}

export function getMoreProjectsForCaseStudies(): PortfolioProject[] {
  const caseStudySet = new Set<string>(caseStudyProjectSlugs);
  return visibleProjects.filter((project) => !caseStudySet.has(project.slug));
}
