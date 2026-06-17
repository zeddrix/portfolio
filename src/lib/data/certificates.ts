import type { Certificate } from "$lib/types/portfolio";

export const certificates: Certificate[] = [
  {
    slug: "modern-javascript-from-the-beginning",
    title: "Modern JavaScript From The Beginning",
    issuer: "Udemy",
    issuedAt: "2020-11-11",
    sections: 14,
    lectures: 122,
    durationLabel: "21h 42m",
    skills: [
      "JavaScript",
      "ES6+",
      "DOM",
      "OOP",
      "Async JavaScript",
      "Fetch API",
    ],
    imagePath: "/certificate-modern-javascript.webp",
    legacyZeddrixPath: "/modern-javascript-from-the-beginning-certificate/",
    summary:
      "Completed a comprehensive JavaScript fundamentals course covering ES6+, DOM manipulation, OOP, and async patterns with hands-on projects.",
  },
  {
    slug: "reactjs-front-to-back",
    title: "ReactJS Front to Back",
    issuer: "Udemy",
    issuedAt: "2021-01-06",
    sections: 13,
    lectures: 91,
    durationLabel: "13h 57m",
    skills: [
      "React.js",
      "Redux",
      "Context API",
      "React Hooks",
      "REST APIs",
      "Node.js",
    ],
    imagePath: "/certificate-reactjs-front-to-back.webp",
    legacyZeddrixPath: "/reactjs-front-to-back-certificate/",
    summary:
      "Built full-stack React applications with hooks, Context API, Redux, and backend integration through guided project work.",
  },
  {
    slug: "css-complete-guide-2021",
    title: "CSS – The Complete Guide 2021 (incl. Flexbox, Grid & Sass)",
    issuer: "Udemy",
    issuedAt: "2021-02-22",
    sections: 19,
    lectures: 297,
    durationLabel: "22h 47m",
    skills: [
      "CSS",
      "Flexbox",
      "CSS Grid",
      "SASS",
      "Responsive Design",
      "Animations",
    ],
    imagePath: "/certificate-css-complete-guide.webp",
    legacyZeddrixPath: "/css-the-complete-guide-2021-certificate/",
    summary:
      "Mastered modern CSS layout systems, Sass workflows, responsive design, and animation techniques through extensive practice.",
  },
  {
    slug: "nodejs-api-masterclass",
    title: "Node.js API Masterclass With Express & MongoDB",
    issuer: "Udemy",
    issuedAt: "2021-03-18",
    sections: 11,
    lectures: 76,
    durationLabel: "12h 3m",
    skills: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST APIs",
      "JWT",
      "Mongoose",
    ],
    imagePath: "/certificate-nodejs-api-masterclass.webp",
    legacyZeddrixPath:
      "/nodejs-api-masterclass-with-express-mongodb-certificate/",
    summary:
      "Developed production-style REST APIs with Express, MongoDB, authentication, and deployment patterns.",
  },
  {
    slug: "mern-ecommerce-from-scratch",
    title: "MERN eCommerce From Scratch",
    issuer: "Udemy",
    issuedAt: "2021-04-06",
    sections: 15,
    lectures: 91,
    durationLabel: "14h 53m",
    hours: 15,
    skills: [
      "MERN Stack",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Redux",
    ],
    imagePath: "/certificate-mern-ecommerce.webp",
    udemyCredentialId: "UC-f4253a2d-75ed-4a33-a0e1-d9c273890c15",
    legacyZeddrixPath: "/mern-ecommerce-from-scratch-certificate/",
    summary:
      "Built a complete MERN eCommerce application from scratch with product catalog, cart, checkout, and admin workflows.",
  },
];

export function getCertificateBySlug(slug: string): Certificate | undefined {
  return certificates.find((certificate) => certificate.slug === slug);
}

export function formatCertificateDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function buildCertificatePath(slug: string): string {
  return `/certificates/${slug}`;
}

const PORTFOLIO_PUBLIC_URL = "https://zeddrix.github.io/portfolio";

export function buildCertificatePublicUrl(slug: string): string {
  return `${PORTFOLIO_PUBLIC_URL}${buildCertificatePath(slug)}`;
}
