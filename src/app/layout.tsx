import type { Metadata } from "next";
import { Figtree, Fraunces, Space_Mono } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import { content } from "@/lib/content";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://medutampa.com"),
  title: {
    default: `${content.site.name} | ${content.site.university}`,
    template: `%s | ${content.site.shortName} at ${content.site.university}`,
  },
  description: content.site.tagline,
  openGraph: {
    title: `${content.site.name} — ${content.site.chapter}`,
    description: content.site.tagline,
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
