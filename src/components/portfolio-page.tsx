"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";
import { navItems, projects, services, testimonials } from "@/data/site";
import { SceneCanvas } from "@/components/scene-canvas";

type ContactState = "idle" | "submitting" | "success" | "error";

export function PortfolioPage() {
  const [status, setStatus] = useState<ContactState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const year = useMemo(() => new Date().getFullYear(), []);

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
    <main className="relative min-h-screen overflow-hidden bg-paper text-ink">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_14%,rgba(243,157,60,0.36),transparent_36%),radial-gradient(circle_at_88%_10%,rgba(33,71,63,0.24),transparent_30%),radial-gradient(circle_at_68%_72%,rgba(211,100,59,0.28),transparent_34%)]" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <p className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight">Ari Dev</p>
        <nav className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/70 transition hover:text-ink">
              {item}
            </a>
          ))}
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-20 pt-6 md:grid-cols-2 md:px-10 md:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]">
            <Sparkles className="h-4 w-4 text-clay" />
            Full-stack designer and engineer
          </div>

          <h1 className="font-[family-name:var(--font-syne)] text-5xl leading-[1.02] md:text-7xl">
            Building digital products with depth, motion, and taste.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-ink/78 md:text-lg">
            I create expressive, high-performance experiences that connect design systems, robust data, and strategic storytelling.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#work" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-paper transition hover:-translate-y-0.5 hover:bg-pine">
              Explore Work
            </a>
            <a href="#contact" className="rounded-full border border-ink/35 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-ink transition hover:border-ink">
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
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl">Selected Projects</h2>
          <p className="text-sm uppercase tracking-[0.18em] text-ink/55">Craft + Velocity</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: 0.08 * index, duration: 0.5 }}
              className="group flex h-full flex-col rounded-3xl border border-ink/10 bg-white/70 p-6 shadow-card backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-pine/85">{project.category}</p>
              <h3 className="mt-3 font-[family-name:var(--font-syne)] text-2xl">{project.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{project.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tag) => (
                  <span key={tag} className="rounded-full bg-paper px-3 py-1 text-xs font-semibold tracking-wide text-ink/80">
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
        <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl">Services</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-ink/12 bg-white/75 p-6"
            >
              <h3 className="font-[family-name:var(--font-syne)] text-2xl">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{service.details}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-ink/10 bg-white/75 p-7">
            <h2 className="font-[family-name:var(--font-syne)] text-3xl">Why clients call me back</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink/72">
              I combine high craft with practical execution. Teams work with me because they get strategic thinking, clean implementation, and a product that feels premium.
            </p>
          </div>

          <div className="space-y-4 rounded-3xl border border-ink/10 bg-white/75 p-7">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.name} className="border-l-2 border-clay pl-4">
                <p className="text-sm leading-relaxed text-ink/75">&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
                  {testimonial.name} · {testimonial.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-4xl px-6 pb-24 md:px-10">
        <div className="rounded-[2rem] border border-ink/10 bg-white/80 p-7 shadow-card md:p-10">
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl">Let us build something unforgettable.</h2>
          <p className="mt-3 text-sm text-ink/72">Send a message and I will reply with scope, timeline, and next steps.</p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              required
              placeholder="Your Name"
              className="rounded-2xl border border-ink/15 bg-paper/80 px-4 py-3 text-sm outline-none transition focus:border-pine"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="rounded-2xl border border-ink/15 bg-paper/80 px-4 py-3 text-sm outline-none transition focus:border-pine"
            />
            <textarea
              name="message"
              required
              placeholder="Tell me about your project"
              rows={6}
              className="rounded-2xl border border-ink/15 bg-paper/80 px-4 py-3 text-sm outline-none transition focus:border-pine"
            />

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-paper transition hover:-translate-y-0.5 hover:bg-pine disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-pine">
                <CheckCircle2 className="h-4 w-4" />
                Message sent successfully.
              </p>
            )}

            {status === "error" && <p className="text-sm font-semibold text-clay">{errorMessage}</p>}
          </form>
        </div>
      </section>

      <footer className="border-t border-ink/10 px-6 py-8 text-center text-sm text-ink/60">
        {year} Ari Dev Portfolio
      </footer>
    </main>
  );
}
