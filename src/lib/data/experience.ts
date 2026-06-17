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
      "Contribute to Codefrost-owned PWAs (TrulyHappy, ArticuLearn, Bolt to GitHub) and client deliveries (UseDelight, Adverio, Manatal Cooperative) as a full-stack developer.",
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
      "Shipped Manatal Cooperative member PWA and Django API financial request flows (Dec 2023) as a client delivery — first production work after Udemy coursework.",
    ],
  },
];
