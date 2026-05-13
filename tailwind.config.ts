import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--c-bg)",
        "bg-2": "var(--c-bg-2)",
        "bg-card": "var(--c-bg-card)",
        fg: "var(--c-fg)",
        "fg-soft": "var(--c-fg-soft)",
        "fg-mute": "var(--c-fg-mute)",
        line: "var(--c-line)",
        "line-strong": "var(--c-line-strong)",
        accent: "var(--c-accent)",
        "accent-2": "var(--c-accent-2)",
        "accent-soft": "var(--c-accent-soft)",
        "accent-glow": "var(--c-accent-glow)",
        "btn-fg": "var(--c-btn-fg)",
        "btn-bg": "var(--c-btn-bg)",
        tg: "var(--c-tg)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
    },
  },
  plugins: [],
};
export default config;
