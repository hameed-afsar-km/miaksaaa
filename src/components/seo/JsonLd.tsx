import React from "react";

export function JsonLd() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://miaksaaa.vercel.app").replace(/\/$/, "");
  const canonical = "https://miaksaaa.vercel.app";

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${canonical}/#website`,
        name: "MIAKSAAA",
        alternateName: "miaksaaa",
        url: `${canonical}/`,
        publisher: {
          "@id": `${canonical}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${canonical}/products?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${canonical}/#organization`,
        name: "MIAKSAAA",
        url: `${canonical}/`,
        logo: {
          "@type": "ImageObject",
          url: `${canonical}/logo2.png`,
          caption: "MIAKSAAA Logo",
        },
        image: `${canonical}/logo2.png`,
        sameAs: [
          "https://www.instagram.com/miaksaaa_collections/",
          "https://wa.me/917292070080",
        ],
      },
    ],
  };

  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "SiteNavigationElement",
        position: 1,
        name: "Shop All Products",
        description: "Explore premium fashion and lifestyle collections at MIAKSAAA",
        url: `${canonical}/products`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Hot Wheels & Diecast Collectibles",
        description: "Rare and exclusive Hot Wheels diecast models at MIAKSAAA",
        url: `${canonical}/hotwheels`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "Custom Display Frames",
        description: "Handcrafted 3D shadow box frames for Hot Wheels and collectibles",
        url: `${canonical}/hotwheels/frames`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "Customer Reviews",
        description: "Verified customer reviews and feedback on MIAKSAAA",
        url: `${canonical}/reviews`,
      },
    ],
  };

  // Suppress unused variable warning - baseUrl kept for potential env override future use
  void baseUrl;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
      />
    </>
  );
}
