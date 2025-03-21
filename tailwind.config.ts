import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./contents/**/*.html"],
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
    },
    fontFamily: {
      sans: ["var(--font-geist-sans)"],
    },
  },
  plugins: [],
};
export default config;
