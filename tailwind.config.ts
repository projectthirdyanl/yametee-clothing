import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yametee: {
          black: "var(--yametee-black)",
          red: "var(--yametee-red)",
          white: "var(--yametee-white)",
          dark: "var(--yametee-dark)",
          gray: "var(--yametee-gray)",
          lightGray: "var(--yametee-light-gray)",
          bg: "var(--yametee-bg)",
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
export default config;
