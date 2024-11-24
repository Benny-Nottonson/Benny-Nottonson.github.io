import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fade-in 2.5s ease-in-out forwards",
        "title": "title 2.5s ease-out forwards", 
        "fade-left": "fade-left 2.5s ease-in-out forwards",
        "fade-right": "fade-right 2.5s ease-in-out forwards"
      }
    },
  },
  plugins: [],
} satisfies Config;
