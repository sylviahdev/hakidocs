import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Serif display face for headlines — premium, editorial, legal-authority feel.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "HakiDocs — Justice Starts With the Right Document",
  description:
    "Describe your legal problem in English, Swahili, or Sheng and get a professional, advocate-grade legal document in seconds. AI-powered legal document generator built for Kenya.",
  keywords: [
    "legal documents Kenya",
    "demand letter",
    "tenancy",
    "Swahili legal",
    "HakiDocs",
  ],
  openGraph: {
    title: "HakiDocs — Justice Starts With the Right Document",
    description:
      "Describe your problem in English, Swahili, or Sheng and get a professional, advocate-grade legal document in seconds. Built for Kenya.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1020",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
