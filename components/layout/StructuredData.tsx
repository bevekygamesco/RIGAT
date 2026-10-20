import { site } from "@/lib/site";

export function StructuredData() {
  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    description: site.description,
    telephone: "+33 4 91 98 32 80",
    email: site.email,
    image: `${site.url}/assets/rigat-banner-product.png`,
    foundingDate: "1956",
    areaServed: "Marseille",
    address: {
      "@type": "PostalAddress",
      streetAddress: "76 avenue Alexandre Ansaldi",
      postalCode: "13013",
      addressLocality: "Marseille",
      addressCountry: "FR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(business).replace(/</g, "\\u003c"),
      }}
    />
  );
}
