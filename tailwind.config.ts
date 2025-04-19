import type { Config } from "tailwindcss";
import * as defaultTheme from "tailwindcss/defaultTheme";

const {
  fontFamily: { mono },
} = defaultTheme;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./writings/*.html"],
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
    },
    fontFamily: {
      menlo: ["Menlo", ...mono],
    },
  },
  plugins: [],
};
export default config;
