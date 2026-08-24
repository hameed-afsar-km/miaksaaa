import React from "react";
import { Product, FrameProduct } from "@/lib/types";

interface ProductJsonLdProps {
  product: Product | FrameProduct;
  canonicalUrl?: string;
}

export function ProductJsonLd({ product, canonicalUrl }: ProductJsonLdProps) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://miaksaaa.com").replace(/\/$/, "");
  
  const isFrame = "basePrice" in product;
  const price = isFrame ? (product.discountedPrice || product.basePrice) : (product.discountedPrice || product.price);
  const images = product.images && product.images.length > 0 ? product.images : [`${baseUrl}/logo2.png`];
  const url = canonicalUrl || `${baseUrl}/products/${product.id}`;
  const inStock = (product.stock ?? 1) > 0;

  const schema: Record<string, any> = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: images,
    description: product.description || `Buy ${product.title} from MIAKSAAA Luxury Store.`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "MIAKSAAA",
    },
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: "INR",
      price: price.toString(),
      priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "MIAKSAAA",
      },
    },
  };

  if ("rating" in product && product.rating && product.reviewCount && product.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
      bestRating: "5",
      worstRating: "1",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
