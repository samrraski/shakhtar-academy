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
          orange: "#FF6400",
          "orange-hover": "#E55A00",
          "orange-light": "#FFF0E6",
          black: "#2C2C2C",
          "gray-900": "#1A1A1A",
          "gray-800": "#2C2C2C",
          "gray-600": "#666666",
          "gray-400": "#9A9A9A",
          "gray-200": "#E2E2E2",
          "gray-100": "#F6F6F6",
          cream: "#F5F0E9",
        },
      },
      fontFamily: {
        sans: ["Nunito Sans", "system-ui", "sans-serif"],
        display: ["Jost", "system-ui", "sans-serif"],
        serif: ["Jost", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
