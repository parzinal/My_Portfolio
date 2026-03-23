"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, CheckCircle2, Github, Linkedin, Mail } from "lucide-react";
import { navItems, projects, services, testimonials } from "@/data/site";
import { SceneCanvas } from "@/components/scene-canvas";
import { BackgroundCanvas } from "@/components/background-canvas";

type ContactState = "idle" | "submitting" | "success" | "error";

export function PortfolioPage() {
  const [status, setStatus] = useState<ContactState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [typedRole, setTypedRole] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const year = useMemo(() => new Date().getFullYear(), []);
  const rotatingRoles = useMemo(
    () => ["Future Software Engineer", "Creative Problem Solver", "Always Learning, Always Building"],
    []
  );

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

      <section id="work" className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl text-white md:text-4xl">Selected Projects</h2>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-300/80">Craft + Velocity</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: 0.08 * index, duration: 0.5 }}
              className="group flex h-full flex-col rounded-3xl border border-slate-200/15 bg-slate-900/52 p-6 shadow-card backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">{project.category}</p>
              <h3 className="mt-3 font-[family-name:var(--font-syne)] text-2xl text-white">{project.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-200/80">{project.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-200/15 bg-slate-950/55 px-3 py-1 text-xs font-semibold tracking-wide text-slate-100/90">
                    {tag}
                  </span>
                ))}
              </div>
              <a href={project.link} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-clay">
                Case Study
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </motion.article>
          ))}
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

      <section id="about" className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200/15 bg-slate-900/52 p-7">
            <h2 className="font-[family-name:var(--font-syne)] text-3xl text-white">Why clients call me back</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
              I combine high craft with practical execution. Teams work with me because they get strategic thinking, clean implementation, and a product that feels premium.
            </p>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200/15 bg-slate-900/52 p-7">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.name} className="border-l-2 border-sky-300/70 pl-4">
                <p className="text-sm leading-relaxed text-slate-200/80">&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300/90">
                  {testimonial.name} · {testimonial.role}
                </footer>
              </blockquote>
            ))}
          </div>
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

        <footer className="border-t border-slate-200/15 px-6 py-8 text-center text-sm text-slate-300/85">
          {year} KimDev Portfolio
        </footer>
      </div>
    </main>
  );
}
