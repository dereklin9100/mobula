import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "../../apps/web/src/**/*.{js,ts,jsx,tsx}",
    "../../apps/dashboard/src/**/*.{js,ts,jsx,tsx}",
    "../../apps/login/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
};

export default config;