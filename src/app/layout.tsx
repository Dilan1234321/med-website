import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mu Epsilon Delta | National Pre-Health Fraternity",
  description:
    "Mu Epsilon Delta (ΜΕΔ) is a national co-educational pre-health professional fraternity preparing members through scholarship, brotherhood, and service. Est. 1965.",
  keywords: [
    "Mu Epsilon Delta",
    "MED",
    "pre-med fraternity",
    "pre-health",
    "professional fraternity",
  ],
  openGraph: {
    title: "Mu Epsilon Delta | National Pre-Health Fraternity",
    description:
      "Preparing brothers for careers in healthcare through scholarship, service, and lifelong fraternity.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
