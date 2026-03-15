import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | BeerBoss",
    default: "BeerBoss — Ontario Beer Price Comparison",
  },
  description:
    "Compare beer prices at The Beer Store in Ontario. Find the best value beer by cost per drink.",
  metadataBase: new URL("https://beerboss.ca"),
  openGraph: {
    siteName: "BeerBoss",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} antialiased bg-zinc-50 text-zinc-900 min-h-screen flex flex-col`}
      >
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <footer style={{ backgroundColor: "#3a4047", marginTop: "-3px" }} className="py-6 text-center text-sm text-zinc-400">
          Data from{" "}
          <a
            href="https://www.thebeerstore.ca"
            className="underline hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            thebeerstore.ca
          </a>
          . Not affiliated with The Beer Store.
        </footer>
      </body>
    </html>
  );
}
