import type { PortfolioProject, Service, Testimonial } from "@/lib/types";

export const navItems = ["Work", "Services", "About", "Contact"];

export const projects: PortfolioProject[] = [
  {
    title: "Atlas Commerce",
    category: "Ecommerce Platform",
    summary:
      "Built a conversion-focused storefront with personalized recommendations and fast edge rendering.",
    stack: ["Next.js", "Supabase", "Stripe", "Tailwind"],
    link: "#"
  },
  {
    title: "Lumen Studio",
    category: "Creative Agency",
    summary:
      "Designed an immersive case study experience with playful transitions and dynamic filtering.",
    stack: ["React Three Fiber", "Framer Motion", "Next.js"],
    link: "#"
  },
  {
    title: "Pulse Board",
    category: "SaaS Dashboard",
    summary:
      "Shipped a high-density analytics workspace with custom data visualizations and role-based access.",
    stack: ["TypeScript", "Supabase", "PostgreSQL"],
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
