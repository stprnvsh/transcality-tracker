import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0D9488",
          light: "#5EEAD4",
          dark: "#0F766E"
        }
      }
    }
  },
  plugins: []
};

export default config;
