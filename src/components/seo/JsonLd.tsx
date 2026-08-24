import React from "react";

export function JsonLd() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://miaksaaa.com").replace(/\/$/, "");

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore"],
    "@id": `${baseUrl}/#organization`,
    name: "MIAKSAAA",
    alternateName: [
      "MIAKSAAA Store",
      "MIAKSAAA Collections",
      "MIAKSAAA Luxury",
      "miaksaaa",
      "MIAKSAAA India",
    ],
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/logo2.png`,
      caption: "MIAKSAAA Logo",
    },
    image: `${baseUrl}/logo2.png`,
    description:
      "MIAKSAAA is a premier luxury store offering curated fashion, exclusive Hot Wheels diecast collectibles, custom display frames, and premium lifestyle essentials.",
    sameAs: [
      "https://www.instagram.com/miaksaaa_collections/",
      "https://wa.me/917292070080",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: "https://wa.me/917292070080",
      availableLanguage: ["English", "Hindi"],
    },
    priceRange: "₹₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Credit Card, Debit Card, UPI, Net Banking",
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "MIAKSAAA",
    alternateName: ["MIAKSAAA Official Store", "MIAKSAAA Collections"],
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
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
        url: `${baseUrl}/products`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Hot Wheels & Diecast Collectibles",
        description: "Rare and exclusive Hot Wheels diecast models at MIAKSAAA",
        url: `${baseUrl}/hotwheels`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "Custom Display Frames",
        description: "Handcrafted 3D shadow box frames for Hot Wheels and collectibles",
        url: `${baseUrl}/hotwheels/frames`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "Customer Reviews",
        description: "Verified customer reviews and feedback on MIAKSAAA",
        url: `${baseUrl}/reviews`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
      />
    </>
  );
}
