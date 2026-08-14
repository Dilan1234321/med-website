import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://mednational.org"),
  title: {
    default: `${content.site.name} | Professional Medical Fraternity`,
    template: `%s | ${content.site.name}`,
  },
  description: content.site.tagline,
  openGraph: {
    title: content.site.name,
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
      className={`${display.variable} ${sans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
