import type { PortfolioProfile } from "$lib/types/portfolio";
import { PORTFOLIO_PUBLIC_SITE_URL } from "$lib/data/site";

export const profile: PortfolioProfile = {
  name: "Zeddrix Fabian",
  motto: "I like to work smart, not hard.",
  heroTitle: "Hello, I'm Zeddrix Fabian",
  heroSubtitle:
    "Full-stack web app developer shipping production apps with AI-accelerated workflows.",
  heroProof: "11",
  about: [
    "I have been developing since 2018 and I enjoy turning complex requirements into simple user experiences with reliable engineering underneath.",
    "I like to work smart, not hard. So I utilize AI tools like Cursor and Claude Code to move quickly without sacrificing quality, using the Acceptance Test-Driven Development (ATDD) approach.",
    "I specialize in SvelteKit, React, and Angular while staying adaptable to product needs. With AI tools, I think it's not an exaggeration to say that I can work on any development project 'til shipped.",
  ],
  experienceSince: "2018",
  specialization: "SvelteKit, React, Angular",
  contactEmail: "zeddrix.fabian@gmail.com",
  websiteUrl: PORTFOLIO_PUBLIC_SITE_URL,
  githubUrl: "https://github.com/zeddrix",
  linkedinUrl: "https://www.linkedin.com/in/zeddrix-fabian-30a18029a/",
  resumeDownloadPath: "/resume/complete/Zeddrix-Fabian-Resume.pdf",
};
