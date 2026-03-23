"use client";

import dynamic from "next/dynamic";

const PortfolioPage = dynamic(
  () => import("@/components/portfolio-page").then((mod) => mod.PortfolioPage),
  { ssr: false }
);

export function PortfolioPageNoSSR() {
  return <PortfolioPage />;
}
