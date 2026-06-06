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
        brand: {
          orange: "#F36C21",
          "orange-hover": "#D85A12",
          "orange-light": "#FDEDE1",
          black: "#2C2C2C",
          "gray-900": "#1A1A1A",
          "gray-800": "#2C2C2C",
          "gray-600": "#666666",
          "gray-400": "#9A9A9A",
          "gray-200": "#E2E2E2",
          "gray-100": "#F6F6F6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
