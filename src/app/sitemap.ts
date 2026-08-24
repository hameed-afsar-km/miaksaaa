import type { MetadataRoute } from "next";
import { getAllProducts, getCollectibleProducts, getVisibleFrameProducts } from "@/lib/firebase/firestore";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://miaksaaa.com").replace(/\/$/, "");

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hotwheels`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hotwheels/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hotwheels/frames`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Fetch dynamic products safely with catch
  try {
    const [standardProducts, collectibleProducts, frameProducts] = await Promise.all([
      getAllProducts().catch(() => []),
      getCollectibleProducts().catch(() => []),
      getVisibleFrameProducts().catch(() => []),
    ]);

    const productRoutes: MetadataRoute.Sitemap = standardProducts.map((p) => {
      let lastMod = new Date();
      if (p.updatedAt) {
        const millis = typeof p.updatedAt.toMillis === "function" ? p.updatedAt.toMillis() : (p.updatedAt as any)?.seconds ? (p.updatedAt as any).seconds * 1000 : null;
        if (millis) lastMod = new Date(millis);
      }
      return {
        url: `${baseUrl}/products/${p.id}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: 0.8,
      };
    });

    const collectibleRoutes: MetadataRoute.Sitemap = collectibleProducts.map((p) => {
      let lastMod = new Date();
      if (p.updatedAt) {
        const millis = typeof p.updatedAt.toMillis === "function" ? p.updatedAt.toMillis() : (p.updatedAt as any)?.seconds ? (p.updatedAt as any).seconds * 1000 : null;
        if (millis) lastMod = new Date(millis);
      }
      return {
        url: `${baseUrl}/hotwheels/products/${p.id}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: 0.8,
      };
    });

    const frameRoutes: MetadataRoute.Sitemap = frameProducts.map((f) => {
      let lastMod = new Date();
      if (f.updatedAt) {
        const millis = typeof f.updatedAt.toMillis === "function" ? f.updatedAt.toMillis() : (f.updatedAt as any)?.seconds ? (f.updatedAt as any).seconds * 1000 : null;
        if (millis) lastMod = new Date(millis);
      }
      return {
        url: `${baseUrl}/hotwheels/frames/${f.id}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: 0.8,
      };
    });

    return [...staticRoutes, ...productRoutes, ...collectibleRoutes, ...frameRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap routes:", error);
    return staticRoutes;
  }
}
