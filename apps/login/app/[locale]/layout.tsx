import type, { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from 'next-intl';

import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { ThemeProvider } from "@repo/ui/providers/theme-provider";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Mobula Dashboard",
  description: "Build once. Scale everywhere.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function RootLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
