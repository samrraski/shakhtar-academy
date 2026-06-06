import type { Metadata } from "next";
import "./globals.css";
import { ACADEMY } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(ACADEMY.siteUrl),
  title: {
    default: "Shakhtar Academy Calgary | Youth Soccer Development",
    template: "%s | Shakhtar Academy Calgary",
  },
  description:
    "Shakhtar Academy Calgary is a youth soccer academy offering structured training programs for players ages 6–18. Expert coaching, competitive pathways, and a supportive club community in Calgary, AB.",
  keywords: [
    "Shakhtar Academy Calgary",
    "youth soccer Calgary",
    "soccer academy Calgary",
    "kids soccer training Calgary",
    "youth football academy Alberta",
    "competitive soccer Calgary",
    "soccer programs Calgary",
    "Calgary soccer club",
  ],
  authors: [{ name: "Shakhtar Academy Calgary" }],
  creator: "Shakhtar Academy Calgary",
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Shakhtar Academy Calgary",
    title: "Shakhtar Academy Calgary | Youth Soccer Development",
    description:
      "Structured training programs for players ages 6–18 — expert coaching, competitive pathways, and a supportive club community in Calgary, AB.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Shakhtar Academy Calgary youth soccer training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shakhtar Academy Calgary | Youth Soccer Development",
    description:
      "Structured training programs for players ages 6–18 — expert coaching and competitive pathways in Calgary, AB.",
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
};

const sportsClubSchema = {
  "@context": "https://schema.org",
  "@type": ["SportsActivityLocation", "LocalBusiness"],
  name: ACADEMY.name,
  description:
    "Youth soccer academy in Calgary offering structured training programs for players ages 6–18, expert coaching, and competitive pathways.",
  url: ACADEMY.siteUrl,
  telephone: `+1-${ACADEMY.phone}`,
  email: ACADEMY.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Calgary",
    addressRegion: "AB",
    postalCode: "T3A",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "51.0447",
    longitude: "-114.0719",
  },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: "51.0447",
      longitude: "-114.0719",
    },
    geoRadius: "60000",
  },
  sport: "Soccer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsClubSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
