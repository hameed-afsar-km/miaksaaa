import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: { default: "MIAKSAAA — Premium Luxury Store", template: "%s | MIAKSAAA" },
  description:
    "Discover premium products at MIAKSAAA — your luxury shopping destination with exclusive collections and unmatched quality.",
  keywords: ["MIAKSAAA", "luxury", "premium", "shopping", "fashion", "exclusive"],
  authors: [{ name: "MIAKSAAA" }],
  creator: "MIAKSAAA",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "MIAKSAAA",
    title: "MIAKSAAA — Premium Luxury Store",
    description: "Discover premium products at MIAKSAAA.",
  },
  twitter: { card: "summary_large_image", title: "MIAKSAAA", description: "Premium Luxury Store" },
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico", apple: "/apple-icon.png" },
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
      </body>
    </html>
  );
}
