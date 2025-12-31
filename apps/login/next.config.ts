import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/tailwind-config"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
