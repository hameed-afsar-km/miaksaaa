import type { MetadataRoute } from "next";
import {
  getAllProducts,
  getCollectibleProducts,
  getVisibleFrameProducts,
  getCategories,
} from "@/lib/firebase/firestore";

// Revalidate sitemap every 1 hour (ISR) for fast responses and fresh SEO indexing
export const revalidate = 3600;

function getBaseUrl(): string {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "https://miaksaaa.vercel.app";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url.replace(/\/+$/, "");
}

function parseDate(val: unknown): Date {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if (typeof val === "object" && val !== null) {
    if ("toDate" in val && typeof (val as { toDate?: () => Date }).toDate === "function") {
      try {
        return (val as { toDate: () => Date }).toDate();
      } catch {
        // ignore and fallback
      }
    }
    if ("toMillis" in val && typeof (val as { toMillis?: () => number }).toMillis === "function") {
      try {
        return new Date((val as { toMillis: () => number }).toMillis());
      } catch {
        // ignore and fallback
      }
    }
    if ("seconds" in val && typeof (val as { seconds?: number }).seconds === "number") {
      return new Date((val as { seconds: number }).seconds * 1000);
    }
  }
  if (typeof val === "string" || typeof val === "number") {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}

function formatImageUrls(images: unknown, baseUrl: string): string[] {
  if (!Array.isArray(images)) return [];
  const validUrls: string[] = [];

  for (const item of images) {
    if (typeof item === "string" && item.trim()) {
      const trimmed = item.trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        validUrls.push(trimmed);
      } else if (trimmed.startsWith("/")) {
        validUrls.push(`${baseUrl}${trimmed}`);
      } else {
        validUrls.push(`${baseUrl}/${trimmed}`);
      }
    }
  }

  return validUrls.slice(0, 8); // Google supports up to 1000 images per URL; 8 is fast & optimal
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  // 1. Static high-level marketing & catalog routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hotwheels`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hotwheels/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/hotwheels/frames`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // 2. Fetch dynamic routes safely in parallel
  try {
    const [standardProducts, collectibleProducts, frameProducts, categories] = await Promise.all([
      getAllProducts().catch((err) => {
        console.error("Sitemap: Failed to load standard products:", err);
        return [];
      }),
      getCollectibleProducts().catch((err) => {
        console.error("Sitemap: Failed to load collectible products:", err);
        return [];
      }),
      getVisibleFrameProducts().catch((err) => {
        console.error("Sitemap: Failed to load frame products:", err);
        return [];
      }),
      getCategories().catch((err) => {
        console.error("Sitemap: Failed to load categories:", err);
        return [];
      }),
    ]);

    // Product routes (Standard shop products)
    const productRoutes: MetadataRoute.Sitemap = standardProducts
      .filter((p) => p && p.id && p.isVisible !== false)
      .map((p) => {
        const lastMod = parseDate(p.updatedAt || p.createdAt);
        const images = formatImageUrls(p.images, baseUrl);
        return {
          url: `${baseUrl}/products/${p.id}`,
          lastModified: lastMod,
          changeFrequency: "weekly",
          priority: 0.8,
          ...(images.length > 0 ? { images } : {}),
        };
      });

    // Collectible Hot Wheels routes
    const collectibleRoutes: MetadataRoute.Sitemap = collectibleProducts
      .filter((p) => p && p.id && p.isVisible !== false)
      .map((p) => {
        const lastMod = parseDate(p.updatedAt || p.createdAt);
        const images = formatImageUrls(p.images, baseUrl);
        return {
          url: `${baseUrl}/hotwheels/products/${p.id}`,
          lastModified: lastMod,
          changeFrequency: "weekly",
          priority: 0.8,
          ...(images.length > 0 ? { images } : {}),
        };
      });

    // Custom Frame routes
    const frameRoutes: MetadataRoute.Sitemap = frameProducts
      .filter((f) => f && f.id && f.isVisible !== false)
      .map((f) => {
        const lastMod = parseDate(f.updatedAt || f.createdAt);
        const images = formatImageUrls(f.images, baseUrl);
        return {
          url: `${baseUrl}/hotwheels/frames/${f.id}`,
          lastModified: lastMod,
          changeFrequency: "weekly",
          priority: 0.8,
          ...(images.length > 0 ? { images } : {}),
        };
      });

    // Active Category routes
    const categoryRoutes: MetadataRoute.Sitemap = categories
      .filter((c) => c && c.isActive && (c.slug || c.name))
      .map((c) => {
        const categoryKey = c.slug || c.name;
        return {
          url: `${baseUrl}/products?category=${encodeURIComponent(categoryKey)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.75,
        };
      });

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...productRoutes,
      ...collectibleRoutes,
      ...frameRoutes,
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}
