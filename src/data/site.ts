import type { PortfolioProject, Service, Testimonial } from "@/lib/types";

export const navItems = ["Work", "Services", "About", "Contact"];

export const projects: PortfolioProject[] = [
   {
    title: "TB5 Payroll System",
    category: "Business Payroll Management",
    summary:
      "TheBigFive Payroll: A web-based payroll and timekeeping system for managing employees, DTRs, positions, payroll runs, payslips, and reporting includes admin and staff portals, import/export tools, backups, and notification/email support.",
    stack: ["PHP", "HTML, CSS, JavaScript", "MySQL"],
    systemTypes: ["Payroll System", "HR Management System", "Web Application"],
    images: [
      "/images/projects/payroll1.jpg",
      "/images/projects/payroll2.jpg",
      "/images/projects/payroll3.jpg"
    ],
    link: "#"
  },
  {
    title: "Kpokedex Project",
    category: "Pokemon Collection",
    summary:
      "KPokedex is a web-based Pokemon platform where trainers can register, log in with OTP security, explore the map, catch Pokemon, and build a personal collection. It also includes admin tools to manage users and update entries, delivering a nostalgic, game-inspired experience that combines fun, accessibility, and account safety for every player alike.",
    stack: ["PHP", "HTML, CSS, JavaScript", "MySQL"],
    systemTypes: ["Collection System", "Web Application"],
    images: [
      "/images/projects/kpokedex1.jpg",
      "/images/projects/kpokedex2.jpg",
      "/images/projects/kpokedex3.jpg"
    ],
    link: "#"
  },
  {
    title: "Sipa Game Project",
    category: "Filipino Arcade Game",
    summary:
      "A simple digital version of the traditional Filipino Sipa game, designed for fun and quick gameplay.",
    stack: ["PHP", "HTML, CSS, JavaScript", "MySQL"],
    systemTypes: ["Game System", "Web Application"],
    images: [
      "/images/projects/sipa-1.svg",
      "/images/projects/sipa-2.svg",
      "/images/projects/sipa-3.svg"
    ],
    link: "#"
  },
  {
    title: "Pogs Game Project",
    category: "Nostalgic Mini Game",
    summary:
      "A simple Pogs-inspired game that brings nostalgic flipping mechanics into an interactive digital format.",
    stack: ["PHP", "HTML, CSS, JavaScript", "MySQL"],
    systemTypes: ["Game System", "Web Application"],
    images: [
      "/images/projects/pogs-1.svg",
      "/images/projects/pogs-2.svg",
      "/images/projects/pogs-3.svg"
    ],
    link: "#"
  },
  {
    title: "CleanMoto",
    category: "Service Management System",
    summary:
      "A role-based motorcycle helmet service management app for bookings, scheduling, walk-ins, service tracking, notifications, account recovery, and team operations.",
    stack: ["PHP", "HTML, CSS, JavaScript", "MySQL"],
    systemTypes: [
      "Service Management System",
      "POS (Point of Sale)",
      "Inventory Management System",
      "HR Management System",
      "Payroll System",
      "Budget Tracker",
      "Web Application"
    ],
    images: [
      "/images/projects/cleanmoto1.jpg",
      "/images/projects/cleanmoto2.jpg",
      "/images/projects/cleanmoto3.jpg"
    ],
    link: "#"
  }
];

export const services: Service[] = [
  {
    title: "Web Development",
    details:
      "Building clean, responsive websites and web interfaces using HTML, CSS, JavaScript and PHP. Focused on creating pages that work well and look good."
  },
  {
    title: "Backend Development",
    details:
      "Developing server-side logic, databases, and basic APIs using PHP and Laravel. I build the parts users don't see but always depend on."
  },
  {
    title: "System Development",
    details:
      "Building functional web-based systems like management tools, dashboards, and CRUD applications. From school projects to real-world use cases."
  }
];

export const testimonials: Testimonial[] = [
  {
    name: "Sara M.",
    role: "Founder, Orbital Labs",
    quote:
      "The final product looked premium and performed perfectly. Every interaction felt intentional."
  },
  {
    name: "Darren K.",
    role: "Product Lead, Northline",
    quote:
      "Fast execution, clear thinking, and excellent taste. The quality bar was obvious from day one."
  }
];
