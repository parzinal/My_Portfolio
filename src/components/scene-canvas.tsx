"use client";

import Image from "next/image";

export function SceneCanvas() {
  return (
    <div className="relative mx-auto w-full max-w-[430px] rounded-[1.85rem] border border-sky-200/20 bg-slate-900/55 p-3 shadow-[0_16px_60px_rgba(7,14,35,0.5)]">
      <div className="pointer-events-none absolute -left-4 top-10 h-16 w-16 rounded-full bg-sky-300/15 blur-2xl" />
      <div className="pointer-events-none absolute -right-4 bottom-10 h-16 w-16 rounded-full bg-blue-300/15 blur-2xl" />

      <div className="relative rounded-[1.45rem] border border-slate-200/20 bg-slate-950/45 p-2.5">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.1rem] border border-slate-200/20 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
          <Image
            src="/images/cv-kim-yamamoto.png"
            alt="Kim Yamamoto portrait"
            fill
            priority
            className="object-contain p-1"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
      </div>
    </div>
  );
}
