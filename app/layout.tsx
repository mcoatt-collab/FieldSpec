import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://fieldspec.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "FieldSpec | AI Drone Survey Report Builder",
    template: "%s | FieldSpec",
  },
  description:
    "Upload drone images, analyze with AI, and generate professional inspection reports. Streamline aerial surveys for agriculture, construction, and infrastructure.",
  keywords: [
    "drone survey software",
    "AI report generator",
    "aerial inspection tools",
    "agriculture analysis",
    "field inspection reports",
    "drone mapping",
    "crop health analysis",
    "infrastructure inspection",
    "professional reports",
    "automated analysis",
  ],
  authors: [{ name: "FieldSpec" }],
  creator: "FieldSpec",
  publisher: "FieldSpec",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "FieldSpec",
    title: "FieldSpec | AI Drone Survey Report Builder",
    description:
      "Upload drone images, analyze with AI, and generate professional inspection reports. Streamline aerial surveys for agriculture, construction, and infrastructure.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FieldSpec - AI-Powered Drone Survey Reports",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FieldSpec | AI Drone Survey Report Builder",
    description:
      "Upload drone images, analyze with AI, and generate professional inspection reports.",
    images: ["/og-image.png"],
    creator: "@fieldspec",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#315f9b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <style>{`.material-icons { font-family: 'Material Symbols Outlined'; font-size: 24px; }`}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
