import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f7f2e8",
        ink: "#101010",
        clay: "#d3643b",
        ember: "#f39d3c",
        pine: "#21473f"
      },
      boxShadow: {
        card: "0 18px 48px rgba(16,16,16,0.14)"
      },
      animation: {
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "spin-slow": "spin 14s linear infinite"
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
