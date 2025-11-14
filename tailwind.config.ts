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
        street: {
          ink: "var(--street-ink)",
          carbon: "var(--street-carbon)",
          graphite: "var(--street-graphite)",
          ash: "var(--street-ash)",
          sand: "var(--street-sand)",
          bone: "var(--street-bone)",
          lime: "var(--street-lime)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-body)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        brand: "0 20px 60px rgba(0, 0, 0, 0.45)",
        neon: "0 0 25px rgba(229, 9, 20, 0.6)",
      },
      backgroundImage: {
        "grid-sheen":
          "radial-gradient(circle at 10% 20%, rgba(229, 9, 20, 0.25), transparent 45%), radial-gradient(circle at 90% 10%, rgba(221, 255, 61, 0.12), transparent 55%), linear-gradient(120deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 70%)",
      },
      animation: {
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
export default config;
