import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#DC2626",
        },
      },
    },
  },
  plugins: [],
};

export default config;
