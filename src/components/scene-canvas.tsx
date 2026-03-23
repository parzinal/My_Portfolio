"use client";

import Image from "next/image";

export function SceneCanvas() {
  return (
    <div className="h-[340px] w-full overflow-hidden rounded-3xl border border-ink/10 bg-white/55 p-4 shadow-card backdrop-blur-sm md:h-[420px] md:p-5">
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-white">
        <Image
          src="/images/cv-kim-yamamoto.png"
          alt="Kim Yamamoto portrait"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 45vw"
        />
      </div>
    </div>
  );
}
