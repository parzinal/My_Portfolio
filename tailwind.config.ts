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
        paper: "#f8fbff",
        ink: "#0b1220",
        clay: "#2563eb",
        ember: "#60a5fa",
        pine: "#1e3a8a"
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
