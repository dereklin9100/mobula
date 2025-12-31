import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@repo/ui/providers/theme-provider";

export const metadata: Metadata = {
  title: "Mobula Dashboard",
  description: "Build once. Scale everywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
    </html>
  );
}
