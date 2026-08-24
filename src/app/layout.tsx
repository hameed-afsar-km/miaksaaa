import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { JsonLd } from "@/components/seo/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://miaksaaa.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "MIAKSAAA — Official Luxury Store | Premium Fashion & Collectibles",
    template: "%s | MIAKSAAA",
  },
  description:
    "Welcome to the official MIAKSAAA store. Discover premium luxury fashion, exclusive Hot Wheels diecast collectibles, custom 3D display frames, and handcrafted lifestyle essentials.",
  applicationName: "MIAKSAAA",
  keywords: [
    "MIAKSAAA",
    "MIAKSAAA store",
    "MIAKSAAA online shopping",
    "MIAKSAAA luxury",
    "MIAKSAAA collections",
    "MIAKSAAA official",
    "MIAKSAAA clothing",
    "Hot Wheels MIAKSAAA",
    "diecast collectibles",
    "custom frame displays",
    "luxury fashion store",
    "miaksaaa.com",
  ],
  authors: [{ name: "MIAKSAAA", url: baseUrl }],
  creator: "MIAKSAAA",
  publisher: "MIAKSAAA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "MIAKSAAA",
    title: "MIAKSAAA — Official Luxury Store | Premium Fashion & Collectibles",
    description:
      "Explore exclusive luxury collections, rare Hot Wheels diecast models, and custom wall display frames at MIAKSAAA.",
    url: baseUrl,
    images: [
      {
        url: "/logo2.png",
        width: 800,
        height: 800,
        alt: "MIAKSAAA - Official Luxury Store Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MIAKSAAA — Official Luxury Store",
    description:
      "Explore exclusive luxury collections, rare Hot Wheels diecast models, and custom display frames at MIAKSAAA.",
    images: ["/logo2.png"],
    creator: "@miaksaaa",
  },
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
  category: "ecommerce",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo2.png", sizes: "32x32", type: "image/png" },
      { url: "/logo2.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/logo2.png",
    apple: "/logo2.png",
  },
  verification: {
    google: "HtXnN71zGip4Cw4qKOPp0gjFd_y1jmEd5tqqcOOcPF4",
  },
};

export const viewport: Viewport = {
  themeColor: "#9333ea",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await import("@/lib/firebase/firestore").then((m) => m.getStoreSettings()).catch(() => null);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
        {settings?.accentColor && (
          <style>{`
            :root {
              --purple-300: ${settings.accentColor}cc;
              --purple-400: ${settings.accentColor}dd;
              --purple-500: ${settings.accentColor};
              --purple-600: ${settings.accentColor}ee;
              --gradient-purple: linear-gradient(135deg, ${settings.accentColor} 0%, #7e22ce 100%);
            }
          `}</style>
        )}
      </head>
      <body>
        <LenisProvider>
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#120a24",
                color: "#f8f4ff",
                border: "1px solid rgba(147,51,234,0.3)",
                borderRadius: "12px",
                fontSize: "0.9rem",
              },
              success: { iconTheme: { primary: "#a855f7", secondary: "#0a0614" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#0a0614" } },
            }}
          />
        </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
