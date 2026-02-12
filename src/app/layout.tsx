import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import "prismjs/themes/prism-okaidia.css";

const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.coffeedevs.com"),
  title: "Café de por medio - CoffeeDevs",
  description: "Tutoriales, guías y experiencias sobre desarrollo de Software. Laravel, Vue, performance, servidores y más!",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Café de por medio - Un blog de CoffeeDevs",
    description: "Tutoriales, guías y experiencias sobre desarrollo de Software. Laravel, Vue, performance, servidores y más!",
    url: "https://blog.coffeedevs.com/",
    siteName: "Café de por medio",
    images: [
      {
        url: "https://blog.coffeedevs.com/content/images/2018/06/background.jpg",
        width: 1920,
        height: 1280,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Café de por medio - Un blog de CoffeeDevs",
    description: "Tutoriales, guías y experiencias sobre desarrollo de Software. Laravel, Vue, performance, servidores y más!",
    images: ["https://blog.coffeedevs.com/content/images/2018/06/background.jpg"],
    site: "@coffeedevs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CoffeeDevs",
    url: "https://coffeedevs.com",
    logo: "https://blog.coffeedevs.com/content/images/size/w100/2020/07/JhjFSCA5_400x400.jpg",
    sameAs: [
      "https://blog.coffeedevs.com",
      "https://www.facebook.com/coffeedevs",
      "https://twitter.com/coffeedevs",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Café de por medio",
    url: "https://blog.coffeedevs.com",
    publisher: {
      "@type": "Organization",
      name: "CoffeeDevs",
      url: "https://coffeedevs.com",
    },
    inLanguage: "es",
  };

  return (
    <html lang="es" className={sourceSans.className}>
      <body className="home-template">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
