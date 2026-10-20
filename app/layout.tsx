import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IconDefinitions } from "@/components/layout/IconDefinitions";
import { StructuredData } from "@/components/layout/StructuredData";
import { LoadingIntro } from "@/components/experience/LoadingIntro";
import { ContactDialog } from "@/components/experience/ContactDialog";
import { ExperienceRuntime } from "@/components/experience/ExperienceRuntime";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | RIGAT" },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  icons: { icon: "/assets/rigat-logo.svg" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [
      {
        url: "/assets/rigat-banner-product.png",
        width: 1254,
        height: 1254,
        alt: "Rideau métallique RIGAT sur mesure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/assets/rigat-banner-product.png"],
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0753ff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="preload"
          href="/assets/inter-variable.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/rigat-banner-product.png"
          as="image"
        />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <StructuredData />
        <LoadingIntro />
        <noscript>
          <style>{`.brand-intro{display:none}`}</style>
        </noscript>
        <IconDefinitions />
        <Header />
        <main>{children}</main>
        <Footer />
        <ContactDialog />
        <ExperienceRuntime />
      </body>
    </html>
  );
}
