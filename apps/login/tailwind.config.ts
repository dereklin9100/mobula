import tailwindConfig from "@repo/tailwind-config/tailwind.config";
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [tailwindConfig],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
};

export default config;