import type { WorkExperience } from "$lib/types/portfolio";

export const workExperience: WorkExperience[] = [
  {
    id: "codefrost-fullstack-freelance",
    company: "Codefrost",
    title: "Full Stack Developer",
    employmentType: "Freelance",
    location: "Philippines · Remote",
    startDate: "2023-12",
    bullets: [
      "Build frontend and backend features for Codefrost progressive web apps in production.",
      "Ship Django REST APIs, SASS-based UI, and SvelteKit surfaces for client-facing products.",
    ],
  },
  {
    id: "codefrost-student-intern",
    company: "Codefrost",
    title: "Student Web Developer",
    employmentType: "Internship",
    location: "Cavite, Calabarzon, Philippines · On-site",
    startDate: "2018-03",
    endDate: "2023-12",
    bullets: [
      "Grew from internship into sustained production web development across company products.",
      "Delivered SvelteKit and SASS implementations while learning full product delivery workflows.",
    ],
  },
];
