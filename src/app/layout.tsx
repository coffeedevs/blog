import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import "prismjs/themes/prism-okaidia.css";

const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Café de por medio - CoffeeDevs",
  description: "Tutoriales, guías y experiencias sobre desarrollo de Software. Laravel, Vue, performance, servidores y más!",
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
  return (
    <html lang="es" className={sourceSans.className}>
      <body className="home-template">
        {children}
      </body>
    </html>
  );
}
