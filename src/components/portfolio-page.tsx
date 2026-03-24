"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Github,
  Linkedin,
  Mail,
  ChevronLeft,
  ChevronRight,
  MapPin,
  GraduationCap,
  BadgeCheck,
  MessageCircle,
  Send,
  X
} from "lucide-react";
import {
  SiPhp,
  SiPython,
  SiLaravel,
  SiDjango,
  SiMysql,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGithub,
  SiVscodium,
  SiLaragon
} from "react-icons/si";
import { navItems, projects, services } from "@/data/site";
import { SceneCanvas } from "@/components/scene-canvas";
import { BackgroundCanvas } from "@/components/background-canvas";

type ContactState = "idle" | "submitting" | "success" | "error";
type ChatSender = "user" | "bot";

type ChatMessage = {
  id: number;
  sender: ChatSender;
  text: string;
};

export function PortfolioPage() {
  const [status, setStatus] = useState<ContactState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [typedRole, setTypedRole] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSystemFilter, setSelectedSystemFilter] = useState("All Systems");
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeProjectImageIndex, setActiveProjectImageIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: Date.now(),
      sender: "bot",
      text: "Hi, I am KimDev Assistant. Ask me about Kim, projects, skills, services, or system types in this portfolio."
    }
  ]);

  const year = useMemo(() => new Date().getFullYear(), []);
  const rotatingRoles = useMemo(
    () => ["Future Software Engineer", "Creative Problem Solver", "Always Learning, Always Building"],
    []
  );
  const systemFilters = useMemo(
    () => [
      "All Systems",
      "Business System",
      "Academic System",
      "Service Management",
      "Collection / Game",
      "Web Application"
    ],
    []
  );

  const systemFilterMap = useMemo<Record<string, string[]>>(
    () => ({
      "Business System": [
        "POS (Point of Sale)",
        "Payroll System",
        "HR Management System",
        "Inventory Management System",
        "Service Management System"
      ],
      "Academic System": ["Enrollment System", "Library System", "Grade System"],
      "Service Management": ["Service Management System"],
      "Collection / Game": ["Collection System", "Game System"],
      "Web Application": ["Web Application"]
    }),
    []
  );

  const availableSystemTypes = useMemo(
    () => Array.from(new Set(projects.flatMap((project) => project.systemTypes))).sort((a, b) => a.localeCompare(b)),
    []
  );

  const quickPrompts = useMemo(
    () => [
      "Who is Kim?",
      "What systems do you have?",
      "Suggest system for clinic",
      "What services do you offer?"
    ],
    []
  );

  const filteredProjects = useMemo(() => {
    if (selectedSystemFilter === "All Systems") {
      return projects;
    }

    const mappedTypes = systemFilterMap[selectedSystemFilter] ?? [selectedSystemFilter];

    return projects.filter((project) =>
      project.systemTypes.some((systemType) => mappedTypes.includes(systemType))
    );
  }, [selectedSystemFilter, systemFilterMap]);

  const activeProject = filteredProjects[activeProjectIndex];

  useEffect(() => {
    setActiveProjectIndex(0);
    setActiveProjectImageIndex(0);
  }, [selectedSystemFilter]);

  useEffect(() => {
    if (activeProjectIndex >= filteredProjects.length) {
      setActiveProjectIndex(0);
      setActiveProjectImageIndex(0);
    }
  }, [activeProjectIndex, filteredProjects.length]);

  function showPreviousProject() {
    if (filteredProjects.length <= 1) {
      return;
    }

    setActiveProjectIndex((current) => (current - 1 + filteredProjects.length) % filteredProjects.length);
    setActiveProjectImageIndex(0);
  }

  function showNextProject() {
    if (filteredProjects.length <= 1) {
      return;
    }

    setActiveProjectIndex((current) => (current + 1) % filteredProjects.length);
    setActiveProjectImageIndex(0);
  }

  function showPreviousImage() {
    if (!activeProject || activeProject.images.length <= 1) {
      return;
    }

    setActiveProjectImageIndex((current) => {
      const total = activeProject.images.length;
      return (current - 1 + total) % total;
    });
  }

  function showNextImage() {
    if (!activeProject || activeProject.images.length <= 1) {
      return;
    }

    setActiveProjectImageIndex((current) => {
      const total = activeProject.images.length;
      return (current + 1) % total;
    });
  }

  useEffect(() => {
    const activeRole = rotatingRoles[roleIndex % rotatingRoles.length];

    let timeoutMs = isDeleting ? 45 : 90;

    if (!isDeleting && typedRole === activeRole) {
      timeoutMs = 1100;
    } else if (isDeleting && typedRole.length === 0) {
      timeoutMs = 220;
    }

    const timeoutId = window.setTimeout(() => {
      if (!isDeleting && typedRole === activeRole) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && typedRole.length === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % rotatingRoles.length);
        return;
      }

      const nextText = isDeleting
        ? activeRole.slice(0, Math.max(0, typedRole.length - 1))
        : activeRole.slice(0, typedRole.length + 1);

      setTypedRole(nextText);
    }, timeoutMs);

    return () => window.clearTimeout(timeoutId);
  }, [isDeleting, roleIndex, rotatingRoles, typedRole]);

  useEffect(() => {
    if (!chatScrollRef.current) {
      return;
    }

    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chatMessages, isBotTyping, isChatOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      message: String(formData.get("message") || "")
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Unable to send your message right now.");
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  function getChatbotReply(rawPrompt: string) {
    const prompt = rawPrompt.toLowerCase().trim();
    const compactPrompt = prompt.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

    const portfolioScopeKeywords = [
      "kim",
      "portfolio",
      "project",
      "projects",
      "system",
      "systems",
      "cabms",
      "payroll",
      "kpokedex",
      "sipa",
      "pogs",
      "cleanmoto",
      "service",
      "services",
      "skills",
      "tech",
      "technology",
      "contact",
      "email",
      "who am i",
      "who is kim"
    ];

    const hasPortfolioSignal = portfolioScopeKeywords.some((keyword) => compactPrompt.includes(keyword));

    if (compactPrompt === "hi" || compactPrompt === "hello" || compactPrompt === "hey") {
      return "Hi. You can ask about Kim, system types, projects, services, tech stack, or contact details from this portfolio.";
    }

    if (compactPrompt.includes("help") || compactPrompt.includes("what can you do")) {
      return "I can answer portfolio-only questions about Kim, project summaries, system types, available filters, skills, services, and contact details.";
    }

    const systemAliasMap: Array<{ aliases: string[]; systemType: string }> = [
      { aliases: ["pos", "point of sale"], systemType: "POS (Point of Sale)" },
      { aliases: ["payroll"], systemType: "Payroll System" },
      { aliases: ["hr", "human resources"], systemType: "HR Management System" },
      { aliases: ["inventory"], systemType: "Inventory Management System" },
      { aliases: ["service"], systemType: "Service Management System" },
      { aliases: ["collection"], systemType: "Collection System" },
      { aliases: ["game"], systemType: "Game System" },
      { aliases: ["web app", "web application", "website"], systemType: "Web Application" }
    ];

    const isSystemAvailabilityQuestion =
      compactPrompt.includes("did he have") ||
      compactPrompt.includes("does he have") ||
      compactPrompt.includes("do you have") ||
      compactPrompt.includes("meron") ||
      compactPrompt.includes("mayroon") ||
      compactPrompt.includes("have you built") ||
      compactPrompt.includes("is there");

    const matchedAliases = systemAliasMap.filter(({ aliases }) =>
      aliases.some((alias) => compactPrompt.includes(alias))
    );

    if (isSystemAvailabilityQuestion && matchedAliases.length > 0) {
      const responses = matchedAliases.map(({ systemType }) => {
        const matchedProjects = projects
          .filter((project) => project.systemTypes.includes(systemType))
          .map((project) => project.title);

        if (matchedProjects.length > 0) {
          return `Yes, Kim has ${systemType} in ${matchedProjects.join(", ")}.`;
        }

        return `Not yet for ${systemType}, but Kim can build it based on your requirements.`;
      });

      return responses.join(" ");
    }

    if (compactPrompt.includes("recommend") || compactPrompt.includes("suggest me") || compactPrompt.includes("what system")) {
      if (
        compactPrompt.includes("clinic") ||
        compactPrompt.includes("animal bite") ||
        compactPrompt.includes("vaccination") ||
        compactPrompt.includes("health")
      ) {
        return "For clinic and vaccination workflows, CABMS is the best fit in this portfolio. It handles incidents, patient records, schedules, and follow-ups.";
      }

      if (
        compactPrompt.includes("salary") ||
        compactPrompt.includes("dtr") ||
        compactPrompt.includes("employee") ||
        compactPrompt.includes("payroll")
      ) {
        return "For employee salary and timekeeping workflows, TB5 Payroll System is the best fit in this portfolio.";
      }

      if (compactPrompt.includes("helmet") || compactPrompt.includes("booking") || compactPrompt.includes("service")) {
        return "For service booking and operations flow, CleanMoto is the recommended system in this portfolio.";
      }

      if (compactPrompt.includes("pokemon")) {
        return "For collection-style and game-inspired features, Kpokedex is the recommended project in this portfolio.";
      }

      if (compactPrompt.includes("arcade") || compactPrompt.includes("mini game") || compactPrompt.includes("game")) {
        return "For simple game systems, Sipa Game and Pogs Game are the relevant projects in this portfolio.";
      }
    }

    if (compactPrompt.includes("system type") || compactPrompt.includes("type of system")) {
      const projectMatch = projects.find((project) =>
        compactPrompt.includes(project.title.toLowerCase()) ||
        project.title
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, " ")
          .split(" ")
          .filter(Boolean)
          .some((token) => token.length > 2 && compactPrompt.includes(token))
      );

      if (projectMatch) {
        return `${projectMatch.title} has system types: ${projectMatch.systemTypes.join(", ")}.`;
      }
    }

    if (
      compactPrompt.includes("filter") ||
      compactPrompt.includes("suggest") ||
      compactPrompt.includes("what systems do you have") ||
      compactPrompt.includes("available systems")
    ) {
      const filterList = systemFilters.join(", ");
      const systemList = availableSystemTypes.join(", ");
      return `You can filter projects using: ${filterList}. Available system types in this portfolio are: ${systemList}.`;
    }

    if (compactPrompt.includes("services") || compactPrompt.includes("what services")) {
      return `Kim offers: ${services.map((service) => service.title).join(", ")}.`;
    }

    if (
      prompt.includes("who am i") ||
      prompt.includes("who is kim") ||
      prompt.includes("about kim") ||
      prompt.includes("about you") ||
      prompt.includes("introduce")
    ) {
      return "You are viewing Kim Yamamoto's portfolio: a Future Software Engineer from Calauan, Laguna, Philippines, focused on building clean and functional web applications using PHP, Laravel, and modern frontend tools.";
    }

    if (prompt.includes("skills") || prompt.includes("tech") || prompt.includes("technology")) {
      return "Kim works with PHP, Laravel, Python, Django, MySQL, JavaScript, TypeScript, React, Next.js, and Tailwind CSS.";
    }

    if (prompt.includes("project") || prompt.includes("work")) {
      return "Kim has built systems like payroll management, game projects, and healthcare-related tracking tools such as CABMS.";
    }

    if (prompt.includes("what is cabms") || prompt.includes("about cabms")) {
      return "CABMS is a multi-branch, role-based system for managing animal bite incidents, patient records, vaccination schedules, and follow-up appointments across clinics.";
    }

    if (
      prompt.includes("system") ||
      prompt.includes("cabms") ||
      prompt.includes("payroll") ||
      prompt.includes("kpokedex") ||
      prompt.includes("sipa") ||
      prompt.includes("pogs") ||
      prompt.includes("cleanmoto")
    ) {
      return "Kim builds practical web systems including CABMS (animal bite monitoring), TB5 Payroll System, Kpokedex, Sipa Game, Pogs Game, and CleanMoto service management.";
    }

    if (prompt.includes("contact") || prompt.includes("email")) {
      return "You can contact Kim at yamamotokim4@gmail.com.";
    }

    if (!hasPortfolioSignal) {
      return "I can only answer questions related to this portfolio and Kim's work. Please ask about profile, projects, systems, skills, services, or contact details.";
    }

    return "I can help with portfolio topics. Try asking: who is Kim, what systems are available, did he build POS, suggest a system type, what services do you offer, or contact.";
  }

  function submitChatPrompt(input: string) {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedInput
    };

    setChatMessages((current) => [...current, userMessage]);
    setChatInput("");
    setIsBotTyping(true);

    window.setTimeout(() => {
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: getChatbotReply(trimmedInput)
      };

      setChatMessages((current) => [...current, botMessage]);
      setIsBotTyping(false);
    }, 750);
  }

  function handleChatSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitChatPrompt(chatInput);
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-transparent text-slate-100">
      <BackgroundCanvas />

      <div className="relative z-10">

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <p className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight text-white">Kim Yamamoto</p>
        <div className="flex items-center gap-6">
          <nav className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300 transition hover:text-white">
              {item}
            </a>
          ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-300/30 bg-slate-900/45 p-2 text-slate-200 transition hover:border-sky-300/50 hover:text-white"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-300/30 bg-slate-900/45 p-2 text-slate-200 transition hover:border-sky-300/50 hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@kimdev.dev"
              className="rounded-full border border-slate-300/30 bg-slate-900/45 p-2 text-slate-200 transition hover:border-sky-300/50 hover:text-white"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-20 pt-6 md:grid-cols-2 md:px-10 md:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/25 bg-slate-900/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-100">
            <Sparkles className="h-4 w-4 text-clay" />
            Future Software Engineer
          </div>

          <h1 className="font-[family-name:var(--font-syne)] text-5xl leading-[1.02] text-white md:text-7xl">
            I&apos;m Kim Yamamoto
          </h1>

          <p className="font-mono text-sm uppercase tracking-[0.18em] text-sky-300">
            {typedRole}
            <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-sky-200 align-middle" />
          </p>

          <p className="max-w-xl text-base leading-relaxed text-slate-200/88 md:text-lg">
            Future Software Engineer based in Laguna, Philippines with a passion for building clean, functional web applications. I design and develop robust systems using Laravel and PHP, turning ideas into real, working products. Currently leveling up my skills and eager to contribute to meaningful projects that make an impact.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#work" className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-950 transition hover:-translate-y-0.5 hover:bg-sky-300">
              Explore Work
            </a>
            <a href="#contact" className="rounded-full border border-slate-300/35 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-100 transition hover:border-sky-200">
              Start a Project
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          <SceneCanvas />
        </motion.div>
      </section>

      <section id="about" className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
        <div className="mb-8 text-center">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl text-white md:text-4xl">About Me</h2>
          <div className="mx-auto mt-4 h-px w-20 bg-sky-300/70" />
        </div>

        <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200/20 bg-slate-900/45 p-7 backdrop-blur md:p-8">
          <h3 className="font-[family-name:var(--font-syne)] text-3xl text-white">Who I Am</h3>
          <p className="mt-4 text-base leading-relaxed text-slate-200/85">
            I&apos;m a Future Software Engineer from Calauan, Laguna, studying at PUP Calauan Campus. I build web applications that solve real problems not just ones that look good. Clean code, clear thinking, and a hunger to keep growing.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200/10 bg-slate-950/35 p-4">
            <div className="grid gap-3 text-sm text-slate-200/90 sm:grid-cols-[140px_1fr] sm:items-center">
              <p className="inline-flex items-center gap-2 font-semibold text-white">
                <Mail className="h-4 w-4 text-sky-200" />
                Email
              </p>
              <a className="text-slate-200 hover:text-sky-200" href="mailto:yamamotokim4@gmail.com">yamamotokim4@gmail.com</a>

              <p className="inline-flex items-center gap-2 font-semibold text-white">
                <MapPin className="h-4 w-4 text-sky-200" />
                Location
              </p>
              <p>Calauan, Laguna, Philippines</p>

              <p className="inline-flex items-center gap-2 font-semibold text-white">
                <GraduationCap className="h-4 w-4 text-sky-200" />
                Education
              </p>
              <p>PUP Calauan Campus, Laguna</p>

              <p className="inline-flex items-center gap-2 font-semibold text-white">
                <BadgeCheck className="h-4 w-4 text-sky-200" />
                Status
              </p>
              <p>Open to Opportunities</p>

              <p className="inline-flex items-center gap-2 font-semibold text-white">
                <Github className="h-4 w-4 text-sky-200" />
                GitHub
              </p>
              <a
                href="https://github.com/parzinal"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-1 text-sky-200 transition hover:text-sky-100"
              >
                github.com/parzinal
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl text-white md:text-4xl">Selected Projects</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={showPreviousProject}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/20 bg-slate-900/55 text-slate-100 transition hover:border-sky-300/55 hover:text-sky-300"
              aria-label="Previous project"
              disabled={filteredProjects.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={showNextProject}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/20 bg-slate-900/55 text-slate-100 transition hover:border-sky-300/55 hover:text-sky-300"
              aria-label="Next project"
              disabled={filteredProjects.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {systemFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedSystemFilter(filter)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition ${
                selectedSystemFilter === filter
                  ? "border-sky-300/70 bg-sky-300/25 text-white"
                  : "border-slate-200/20 bg-slate-900/45 text-slate-200 hover:border-sky-300/45"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/15 bg-slate-900/52 p-6 text-slate-200/85">
            No projects found for this filter yet.
          </div>
        ) : (

        <motion.article
          key={activeProject.title}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid gap-6 rounded-3xl border border-slate-200/15 bg-slate-900/52 p-5 shadow-card backdrop-blur md:grid-cols-[1.2fr_1fr] md:p-6"
        >
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/10 bg-slate-950/55">
            <div className="relative h-[240px] w-full md:h-[330px]">
              <Image
                src={activeProject.images[activeProjectImageIndex]}
                alt={`${activeProject.title} screenshot ${activeProjectImageIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>

            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/25 bg-slate-900/70 text-slate-100 transition hover:border-sky-300/65 hover:text-sky-300"
              aria-label="Previous project image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/25 bg-slate-900/70 text-slate-100 transition hover:border-sky-300/65 hover:text-sky-300"
              aria-label="Next project image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900/65 px-3 py-1">
              {activeProject.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveProjectImageIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    index === activeProjectImageIndex ? "bg-sky-300" : "bg-slate-300/45 hover:bg-slate-200/75"
                  }`}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">{activeProject.category}</p>
            <h3 className="mt-3 font-[family-name:var(--font-syne)] text-3xl text-white">{activeProject.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-200/82">{activeProject.summary}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {activeProject.stack.map((tag) => (
                <span key={tag} className="rounded-full border border-slate-200/15 bg-slate-950/55 px-3 py-1 text-xs font-semibold tracking-wide text-slate-100/90">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-300/70">
                Project {activeProjectIndex + 1} of {filteredProjects.length}
              </p>
              <a href={activeProject.link} className="inline-flex items-center gap-1 text-sm font-semibold text-clay">
                Open Project
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.article>
        )}
      </section>

      <section id="technology" className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
        <h2 className="font-[family-name:var(--font-syne)] text-3xl text-white md:text-4xl">Technologies &amp; Tools</h2>
        <div className="mt-7 rounded-3xl border border-slate-200/15 bg-slate-900/52 p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300/75">What I Work With</p>

          <div className="mt-6 border-t border-slate-200/10 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300/80">Backend</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { name: "PHP", type: "Language", Icon: SiPhp, iconClass: "text-[#777BB4]" },
                { name: "Python", type: "Language", Icon: SiPython, iconClass: "text-[#3776AB]" },
                { name: "Laravel", type: "Framework", Icon: SiLaravel, iconClass: "text-[#FF2D20]" },
                { name: "Django", type: "Framework", Icon: SiDjango, iconClass: "text-[#44B78B]" },
                { name: "MySQL", type: "Database", Icon: SiMysql, iconClass: "text-[#4479A1]" }
              ].map(({ name, type, Icon, iconClass }) => (
                <div
                  key={name}
                  className="rounded-xl border border-slate-200/15 bg-slate-950/55 px-4 py-3 transition hover:border-sky-300/45 hover:bg-slate-900/70 hover:shadow-[0_0_22px_rgba(56,189,248,0.2)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/85">
                      <Icon className={`h-4 w-4 ${iconClass}`} />
                    </div>
                    <div>
                      <p className="text-base font-semibold leading-tight text-white">{name}</p>
                      <p className="text-xs text-slate-300/75">{type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-slate-200/10 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300/80">Frontend</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-7">
              {[
                { name: "HTML", type: "Markup", Icon: SiHtml5, iconClass: "text-[#E34F26]" },
                { name: "CSS", type: "Styling", Icon: SiCss, iconClass: "text-[#1572B6]" },
                { name: "JavaScript", type: "Language", Icon: SiJavascript, iconClass: "text-[#F7DF1E]" },
                { name: "TypeScript", type: "Language", Icon: SiTypescript, iconClass: "text-[#3178C6]" },
                { name: "React", type: "Library", Icon: SiReact, iconClass: "text-[#61DAFB]" },
                { name: "Next.js", type: "Framework", Icon: SiNextdotjs, iconClass: "text-white" },
                { name: "Tailwind CSS", type: "CSS Framework", Icon: SiTailwindcss, iconClass: "text-[#06B6D4]" }
              ].map(({ name, type, Icon, iconClass }) => (
                <div
                  key={name}
                  className="rounded-xl border border-slate-200/15 bg-slate-950/55 px-4 py-3 transition hover:border-sky-300/45 hover:bg-slate-900/70 hover:shadow-[0_0_22px_rgba(56,189,248,0.2)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/85">
                      <Icon className={`h-4 w-4 ${iconClass}`} />
                    </div>
                    <div>
                      <p className="text-base font-semibold leading-tight text-white">{name}</p>
                      <p className="text-xs text-slate-300/75">{type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-slate-200/10 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300/80">Tools &amp; Environment</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "GitHub", type: "Version Control", Icon: SiGithub, iconClass: "text-white" },
                { name: "VS Code", type: "Editor", Icon: SiVscodium, iconClass: "text-[#24BFA5]" },
                { name: "Laragon", type: "Local Server", Icon: SiLaragon, iconClass: "text-[#0E83CD]" }
              ].map(({ name, type, Icon, iconClass }) => (
                <div
                  key={name}
                  className="rounded-xl border border-slate-200/15 bg-slate-950/55 px-4 py-3 transition hover:border-sky-300/45 hover:bg-slate-900/70 hover:shadow-[0_0_22px_rgba(56,189,248,0.2)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/85">
                      <Icon className={`h-4 w-4 ${iconClass}`} />
                    </div>
                    <div>
                      <p className="text-base font-semibold leading-tight text-white">{name}</p>
                      <p className="text-xs text-slate-300/75">{type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
        <h2 className="font-[family-name:var(--font-syne)] text-3xl text-white md:text-4xl">Services</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-slate-200/15 bg-slate-900/52 p-6"
            >
              <h3 className="font-[family-name:var(--font-syne)] text-2xl text-white">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-200/80">{service.details}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-4xl px-6 pb-24 md:px-10">
        <div className="rounded-[2rem] border border-slate-200/15 bg-slate-900/58 p-7 shadow-card md:p-10">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl text-white md:text-4xl">Let us build something unforgettable.</h2>
          <p className="mt-3 text-sm text-slate-200/80">Send a message and I will reply with scope, timeline, and next steps.</p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              required
              placeholder="Your Name"
              className="rounded-2xl border border-slate-200/20 bg-slate-950/45 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-300/65 focus:border-sky-300"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="rounded-2xl border border-slate-200/20 bg-slate-950/45 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-300/65 focus:border-sky-300"
            />
            <textarea
              name="message"
              required
              placeholder="Tell me about your project"
              rows={6}
              className="rounded-2xl border border-slate-200/20 bg-slate-950/45 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-300/65 focus:border-sky-300"
            />

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-950 transition hover:-translate-y-0.5 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                <CheckCircle2 className="h-4 w-4" />
                Message sent successfully.
              </p>
            )}

            {status === "error" && <p className="text-sm font-semibold text-clay">{errorMessage}</p>}
          </form>
        </div>
      </section>

        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 md:bottom-7 md:right-7">
          {isChatOpen && (
            <div className="w-[min(93vw,390px)] overflow-hidden rounded-[1.35rem] border border-cyan-200/25 bg-slate-950/90 shadow-[0_20px_70px_rgba(8,47,73,0.55)] backdrop-blur-xl">
              <div className="border-b border-slate-200/15 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.28),transparent_56%),linear-gradient(130deg,rgba(10,20,45,0.95),rgba(7,28,65,0.92))] px-4 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">KimDev Assistant</p>
                    <p className="mt-0.5 text-xs text-cyan-100/85">Portfolio guide and system matcher</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/35 bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      Online
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsChatOpen(false)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/25 bg-slate-900/50 text-slate-200 transition hover:border-cyan-300/70 hover:text-cyan-100"
                      aria-label="Close chatbot"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div
                ref={chatScrollRef}
                className="chat-scroll max-h-80 space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_85%_8%,rgba(34,211,238,0.07),transparent_40%)] px-4 py-4"
              >
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      message.sender === "user"
                        ? "ml-auto rounded-br-md border border-cyan-200/20 bg-gradient-to-br from-cyan-300 to-sky-400 text-slate-950 shadow-[0_8px_24px_rgba(56,189,248,0.35)]"
                        : "rounded-bl-md border border-slate-200/12 bg-slate-800/82 text-slate-100"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}

                {isBotTyping && (
                  <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-slate-200/12 bg-slate-800/82 px-3 py-2 text-sm text-slate-100">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-sky-300" />
                      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-sky-300 [animation-delay:150ms]" />
                      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-sky-300 [animation-delay:300ms]" />
                      KimDev Assistant is typing...
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-200/10 px-3 pt-3">
                {quickPrompts.map((quickPrompt) => (
                  <button
                    key={quickPrompt}
                    type="button"
                    onClick={() => submitChatPrompt(quickPrompt)}
                    disabled={isBotTyping}
                    className="rounded-full border border-cyan-200/30 bg-slate-900/55 px-3 py-1.5 text-xs font-medium text-cyan-100 transition hover:border-cyan-300/75 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {quickPrompt}
                  </button>
                ))}
              </div>

              <form onSubmit={handleChatSubmit} className="flex items-center gap-2 px-3 pb-3 pt-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Ask about Kim, systems, projects, or services"
                  className="h-10 flex-1 rounded-xl border border-cyan-200/35 bg-slate-900/80 px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.2)]"
                />
                <button
                  type="submit"
                  disabled={isBotTyping}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200/25 bg-gradient-to-br from-cyan-300 to-sky-400 text-slate-950 shadow-[0_8px_20px_rgba(56,189,248,0.35)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                  aria-label="Send chat message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsChatOpen((current) => !current)}
            className="group inline-flex items-center gap-2 rounded-full border border-cyan-200/35 bg-gradient-to-br from-cyan-300 to-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.4)] transition hover:-translate-y-0.5 hover:brightness-105"
            aria-label="Open portfolio chatbot"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/15">
              <MessageCircle className="h-4 w-4" />
            </span>
            <span>{isChatOpen ? "Close K'Ai" : "Ask K'Ai"}</span>
          </button>
        </div>

        <footer className="border-t border-slate-200/15 px-6 py-8 text-center text-sm text-slate-300/85">
          {year} KimDev Portfolio
        </footer>
      </div>
    </main>
  );
}
