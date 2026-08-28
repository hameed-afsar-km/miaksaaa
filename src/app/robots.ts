import type { MetadataRoute } from "next";

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

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/cart",
          "/checkout",
          "/orders",
          "/orders/*",
          "/profile",
          "/profile/*",
          "/wishlist",
          "/login",
          "/register",
          "/online-payment",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
