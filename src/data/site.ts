import type { PortfolioProject, Service, Testimonial } from "@/lib/types";

export const navItems = ["Work", "Services", "About", "Contact"];

export const projects: PortfolioProject[] = [
  {
    title: "Kpokedex Project",
    category: "Pokemon Collection",
    summary:
      "A Pokemon collection system that lets users track, organize, and explore their captured Pokemon.",
    stack: ["PHP", "HTML, CSS, JavaScript", "MySQL"],
    images: [
      "/images/projects/kpokedex-1.svg",
      "/images/projects/kpokedex-2.svg",
      "/images/projects/kpokedex-3.svg"
    ],
    link: "#"
  },
  {
    title: "Sipa Game Project",
    category: "Filipino Arcade Game",
    summary:
      "A simple digital version of the traditional Filipino Sipa game, designed for fun and quick gameplay.",
    stack: ["PHP", "HTML, CSS, JavaScript", "MySQL"],
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
      "A role-based motorcycle service management app for bookings, scheduling, walk-ins, service tracking, notifications, account recovery, and team operations.",
    stack: ["PHP", "HTML, CSS, JavaScript", "MySQL"],
    images: [
      "/images/projects/cleanmoto-1.svg",
      "/images/projects/cleanmoto-2.svg",
      "/images/projects/cleanmoto-3.svg"
    ],
    link: "#"
  }
];

export const services: Service[] = [
  {
    title: "Product Design + Frontend",
    details:
      "From UX discovery to shipped interfaces with delightful interactions and strong performance."
  },
  {
    title: "Full-stack Delivery",
    details:
      "Robust APIs, auth, and data workflows powered by Supabase and secure deployment practices."
  },
  {
    title: "Motion and 3D Craft",
    details:
      "Meaningful animation systems and subtle 3D depth that support storytelling and brand identity."
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
