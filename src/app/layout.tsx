import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import PendoInitializer from "@/components/PendoInitializer";
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
        <Script id="pendo-install" strategy="beforeInteractive">
          {`(function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
    v=['initialize','identify','updateOptions','pageLoad','track','trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m){
    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
})('96f4a812-3f0d-45d4-b2f1-48da9d7bc0d9');`}
        </Script>
        <PendoInitializer />
        {children}
      </body>
    </html>
  );
}
