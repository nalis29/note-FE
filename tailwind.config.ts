import type { Config } from "tailwindcss"

export default {
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        text: "var(--color-text)",

        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        border: "var(--border)",

        danger: "var(--danger)",
      },
    },
  },
} satisfies Config
