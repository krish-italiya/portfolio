export type Project = {
  id: "foundry" | "instacv" | "airbnb" | "ipl";
  number: string;
  name: string;
  category: string;
  description: string;
  stack: string[];
  source: string;
  live?: string;
};

export const profile = {
  name: "Krish Italiya",
  role: "Software Engineer",
  currentRole: "Software Engineer · Associate 2",
  company: "State Street Corporation",
  location: "Hyderabad, India",
  email: "krishitaliya11@gmail.com",
  github: "https://github.com/krish-italiya",
  linkedin: "https://www.linkedin.com/in/krishitaliya/",
  tagline: "I build reliable, user-focused software across frontend, backend, and cloud.",
  introduction: "Currently at State Street, working on production applications and secure workflows. I enjoy taking problems from interface details through APIs, data, and the systems that support them.",
  about: "I’m a software engineer who enjoys understanding products end to end: how an interface behaves, how APIs and data layers support it, and how software gets built and operated. I like solving practical problems, learning how systems fit together, and turning ideas into useful, maintainable products.",
  interests: ["Product engineering", "Backend systems", "Cloud infrastructure", "Problem solving"]
};

export const experience = [
  {
    company: "State Street Corporation",
    period: "JAN 2025 — PRESENT",
    location: "Hyderabad, India",
    roles: [
      { title: "Software Engineer · Associate 2", period: "JUL 2025 — PRESENT" },
      { title: "Software Engineer Intern", period: "JAN 2025 — JUL 2025" }
    ],
    summary: "Contributing to enterprise applications across React, TypeScript, Spring Boot, and Oracle, with a focus on modernization, access control, and production reliability.",
    highlights: [
      "Modernized three production applications: Create React App to Vite, React 17 to 19, and MUI 5 to 7.",
      "Upgraded AG Grid 21 to 36 and built a custom date-picker to standardize regional date handling.",
      "Built reusable RBAC and Target-Based Access Control hooks backed by database-driven Spring Boot permissions.",
      "Worked on frontend encryption/decryption flows and supporting Spring Boot endpoints and Oracle SQL.",
      "Resolved production regressions across UI, filtering, and authorization; supported UAT and releases."
    ],
    stack: ["React", "TypeScript", "Spring Boot", "Oracle", "AG Grid", "Vite", "Jenkins"]
  },
  {
    company: "D360 Tech",
    period: "JUN 2024 — JUL 2024",
    location: "Surat, India",
    roles: [{ title: "Software Development Engineer Intern", period: "JUN 2024 — JUL 2024" }],
    summary: "Built Python serverless functions on Google Cloud and improved retrieval for large-file workflows.",
    highlights: [
      "Developed Python/Flask serverless functions on Google Cloud Functions.",
      "Reduced measured end-to-end response time by 40.79% using pattern-based file partitioning and hash-based lookups."
    ],
    stack: ["Python", "Flask", "Google Cloud Functions"]
  }
];

export const projects: Project[] = [
  { id: "foundry", number: "01", name: "Foundry", category: "DEVELOPER PLATFORM", description: "An educational, production-inspired developer platform exploring project registration, build orchestration, deployment lifecycle, local runtimes, logs, and health checks. It is currently a local prototype, not a public multi-tenant PaaS; repository execution is not sandboxed.", stack: ["Java", "Spring Boot", "React", "TypeScript", "Docker"], source: "https://github.com/krish-italiya/Foundry" },
  { id: "instacv", number: "02", name: "InstaCV", category: "PRODUCT ENGINEERING", description: "A resume builder with split-pane editing, real-time preview, and persistent editing state.", stack: ["React", "TypeScript", "Redux Toolkit", "Tailwind CSS"], source: "https://github.com/krish-italiya/instacv", live: "https://instacv-makeresume.netlify.app/" },
  { id: "airbnb", number: "03", name: "Airbnb Clone", category: "FULL-STACK APPLICATION", description: "A full-stack accommodation platform covering authentication, property listings, search, bookings, reviews, and user profiles.", stack: ["React", "Node.js", "Express", "MongoDB"], source: "https://github.com/krish-italiya/Airbnb-Clone" },
  { id: "ipl", number: "04", name: "IPL Data Analysis", category: "DATA EXPLORATION", description: "A data-analysis project exploring IPL match and ball-by-ball datasets through team and player statistics and visualizations.", stack: ["Python", "Pandas", "NumPy", "Matplotlib", "Streamlit"], source: "https://github.com/krish-italiya/IPL-Data-Analysis" }
];

export const skills = [
  { group: "LANGUAGES", items: ["Java", "C++", "JavaScript", "TypeScript", "Python", "SQL"] },
  { group: "FRONTEND", items: ["React", "Redux Toolkit", "MUI", "AG Grid", "Vite", "Tailwind CSS"] },
  { group: "BACKEND & DATA", items: ["Spring Boot", "REST APIs", "Oracle", "MySQL", "MongoDB"] },
  { group: "CLOUD & TOOLS", items: ["Google Cloud", "Docker", "Jenkins", "Git", "Bitbucket", "Jira"] }
];

export const achievements = [
  { value: "2052", label: "LeetCode peak", detail: "Knight · top 2%" },
  { value: "1536", label: "Codeforces peak", detail: "Specialist" },
  { value: "1804", label: "Google Kick Start", detail: "Global rank · Round H, 2022" },
  { value: "2,000+", label: "Problems solved", detail: "Across competitive-programming platforms" }
];

export const education = {
  degree: "B.Tech · Computer Science and Engineering",
  institution: "Institute of Technology, Nirma University",
  period: "2021 — 2025",
  result: "8.31 / 10",
  location: "Ahmedabad, Gujarat, India"
};

export const leadership = {
  role: "Technical Head",
  organization: "Computer Society of India · Nirma University",
  period: "SEP 2023 — NOV 2024",
  detail: "Helped organize the 36-hour HackNUthon 5.0 with 700+ participants and designed/tested DSA and competitive-programming problems for Codeforces and Unstop."
};
