export type Project = {
  id: string;
  number: string;
  name: string;
  category: string;
  status: string;
  featured?: boolean;
  summary: string;
  description: string;
  proof: string[];
  architecture: string[];
  stack: string[];
  links: { label: string; url: string }[];
  note?: string;
};

export const profile = {
  name: "Krish Italiya",
  role: "Software Engineer",
  location: "Hyderabad, India",
  email: "krishitaliya11@gmail.com",
  github: "https://github.com/krish-italiya",
  linkedin: "https://www.linkedin.com/in/krishitaliya/",
  tagline: "I build interfaces, systems, and the connective tissue between them.",
  intro:
    "Software engineer working across React, TypeScript, Java, Spring Boot, and cloud infrastructure. I care about the details users feel and the engineering decisions they never have to think about.",
  currentFocus: ["Developer platforms", "UI systems", "Cloud infrastructure"]
};

export const signals = [
  { value: "3", label: "production apps modernized", detail: "CRA → Vite · React 17 → 19 · MUI 5 → 7" },
  { value: "40.79%", label: "response-time reduction", detail: "Measured during the D360 Tech internship" },
  { value: "700+", label: "HackNUthon participants", detail: "36-hour university hackathon" },
  { value: "2,000+", label: "programming problems solved", detail: "Across Codeforces, LeetCode, CSES and GFG" }
];

export const experience = [
  {
    period: "JUL 2025 — PRESENT",
    role: "Software Engineer · Associate 2",
    company: "State Street Corporation",
    location: "Hyderabad, India",
    description:
      "Modernizing production frontend applications and building secure, permission-aware workflows across React, Spring Boot, and Oracle.",
    highlights: [
      "Modernized 3 production applications: Create React App to Vite, React 17 to 19, and MUI 5 to 7.",
      "Upgraded AG Grid 21 to 36 and built a custom date-picker to enforce consistent date formatting across regions.",
      "Built reusable RBAC and Target-Based Access Control hooks driven by Spring Boot permissions.",
      "Implemented frontend encryption/decryption flows and supporting Spring Boot endpoints and Oracle SQL.",
      "Resolved production regressions across UI, AG Grid filtering, and authorization; supported UAT and production releases."
    ],
    stack: ["React", "TypeScript", "Spring Boot", "Oracle", "AG Grid", "Vite"]
  },
  {
    period: "JAN 2025 — JUL 2025",
    role: "Software Engineer Intern",
    company: "State Street Corporation",
    location: "Bengaluru, India",
    description:
      "Worked on production UI functionality, defect resolution, code reviews, and release activities.",
    highlights: [
      "Developed and enhanced production UI functionality using React.js and Redux Toolkit.",
      "Contributed to reviews and release activities using Jira, Bitbucket, and Jenkins."
    ],
    stack: ["React", "Redux Toolkit", "Jira", "Bitbucket", "Jenkins"]
  },
  {
    period: "JUN 2024 — JUL 2024",
    role: "Software Development Engineer Intern",
    company: "D360 Tech",
    location: "Surat, India",
    description:
      "Built Python serverless functions on Google Cloud and improved the way large files were retrieved and searched.",
    highlights: [
      "Developed Python/Flask serverless functions on Google Cloud Functions.",
      "Reduced measured end-to-end response time by 40.79% using pattern-based file partitioning and hash-based lookups."
    ],
    stack: ["Python", "Flask", "Google Cloud Functions"]
  }
];

export const projects: Project[] = [
  {
    id: "foundry",
    number: "01",
    name: "Foundry",
    category: "PLATFORM ENGINEERING",
    status: "IN ACTIVE DEVELOPMENT",
    featured: true,
    summary: "A developer platform that turns a source repository into a deployed, observable, manageable application.",
    description:
      "An educational, production-inspired Internal Developer Platform. The current implementation explores the control plane, deployment lifecycle, build orchestration, local runtime adapters, logs, and health checks.",
    proof: [
      "React + TypeScript dashboard with project registration, deployment requests, history, logs, and application URLs.",
      "Spring Boot APIs for projects, deployments, lifecycle state, and cursor-paginated logs.",
      "An opt-in build worker and local runtime adapter for trusted sample workloads.",
      "Runtime reconciliation detects exited processes as CRASHED and successful records whose process is no longer tracked after an API restart as INTERRUPTED.",
      "A local ingress filter provides stable deployment-id.localhost URLs and forwards requests to private loopback ports."
    ],
    architecture: ["React dashboard", "Spring Boot control plane", "Opt-in build worker", "Local runtime adapter", "Application + health checks"],
    stack: ["Java", "Spring Boot", "React", "TypeScript", "Docker", "GCP"],
    links: [{ label: "Inspect source", url: "https://github.com/krish-italiya/Foundry" }],
    note:
      "Scope boundary: Foundry is currently a local, educational platform, not a public multi-tenant PaaS. Repository builds execute scripts on the local host and are not sandboxed. Do not expose the runner or execute untrusted repositories publicly until isolated workers, credential boundaries, resource limits, authentication, and access controls exist. The local ingress is not Internet ingress."
  },
  {
    id: "instacv",
    number: "02",
    name: "InstaCV",
    category: "FRONTEND ENGINEERING",
    status: "LIVE PROJECT",
    summary: "A resume builder with live preview, persistent editing state, and reusable TypeScript components.",
    description:
      "A split-pane resume creation experience focused on keeping editing state and rendered output in sync.",
    proof: [
      "Real-time resume preview.",
      "Persistent state with Redux Toolkit and Redux Persist.",
      "Interactive split-pane editing and modular React/TypeScript components."
    ],
    architecture: ["React + TypeScript", "Redux Toolkit", "Persistent state", "Live resume preview"],
    stack: ["React", "TypeScript", "Redux Toolkit", "Tailwind CSS"],
    links: [
      { label: "Source code", url: "https://github.com/krish-italiya/instacv" },
      { label: "Open live app", url: "https://instacv-makeresume.netlify.app/" }
    ]
  },
  {
    id: "airbnb",
    number: "03",
    name: "Airbnb Clone",
    category: "FULL-STACK DEVELOPMENT",
    status: "REPOSITORY",
    summary: "A full-stack accommodation platform covering listings, search, bookings, reviews, and profiles.",
    description:
      "A React application connected to Node/Express APIs and MongoDB-backed workflows.",
    proof: [
      "Authentication and authorization.",
      "Property listing and search functionality.",
      "Booking management, reviews, and user profiles."
    ],
    architecture: ["React client", "Express REST API", "MongoDB data layer"],
    stack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    links: [{ label: "Source code", url: "https://github.com/krish-italiya/Airbnb-Clone" }]
  },
  {
    id: "ipl",
    number: "04",
    name: "IPL Data Analysis",
    category: "DATA EXPLORATION",
    status: "REPOSITORY",
    summary: "Exploratory analysis of IPL match and ball-by-ball data using Python and Streamlit.",
    description:
      "A data-analysis project using match and delivery datasets to explore team and player performance.",
    proof: [
      "Loaded and cleaned match and delivery datasets.",
      "Explored team and player performance with summary statistics and visualizations.",
      "Used Pandas, NumPy, Matplotlib, and Streamlit."
    ],
    architecture: ["Kaggle datasets", "Pandas / NumPy", "Exploratory analysis", "Streamlit visualizations"],
    stack: ["Python", "Pandas", "NumPy", "Matplotlib", "Streamlit"],
    links: [{ label: "Source code", url: "https://github.com/krish-italiya/IPL-Data-Analysis" }]
  }
];

export const achievements = [
  { value: "2052", label: "LeetCode peak", detail: "Knight · top 2% (resume figure)" },
  { value: "1536", label: "Codeforces peak", detail: "Specialist (resume figure)" },
  { value: "1804", label: "Google Kick Start", detail: "Global rank · Round H, 2022" }
];

export const leadership = {
  role: "Technical Head",
  organization: "Computer Society of India · Nirma University",
  period: "SEP 2023 — NOV 2024",
  detail:
    "Organized the 36-hour HackNUthon 5.0 with 700+ participants and designed/tested DSA and competitive-programming problems for Codeforces and Unstop."
};

export const education = {
  degree: "B.Tech · Computer Science and Engineering",
  institution: "Institute of Technology, Nirma University",
  period: "2021 — 2025",
  result: "8.31",
  location: "Ahmedabad, Gujarat, India"
};

export const skills = [
  { group: "LANGUAGES", items: ["Java", "C++", "JavaScript", "TypeScript", "Python", "SQL"] },
  { group: "FRONTEND", items: ["React", "Redux Toolkit", "MUI", "AG Grid", "Vite", "Tailwind CSS"] },
  { group: "BACKEND & DATA", items: ["Spring Boot", "REST APIs", "Oracle", "MySQL", "MongoDB"] },
  { group: "TOOLS & CLOUD", items: ["Git", "GitHub", "Jenkins", "Bitbucket", "Jira", "Google Cloud Platform"] }
];
