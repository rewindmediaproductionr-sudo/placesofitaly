import type { Metadata } from "next";
import { Eczar, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const googleSans = localFont({
  variable: "--font-google-sans",
  display: "swap",
  src: [
    { path: "../public/fonts/google-sans/GoogleSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/google-sans/GoogleSans-Italic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/google-sans/GoogleSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/google-sans/GoogleSans-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../public/fonts/google-sans/GoogleSans-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/google-sans/GoogleSans-SemiBoldItalic.woff2", weight: "600", style: "italic" },
    { path: "../public/fonts/google-sans/GoogleSans-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/google-sans/GoogleSans-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
});

const eczar = Eczar({
  variable: "--font-eczar",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Places of Italy — Il portale delle 20 regioni d'Italia",
    template: "%s — Places of Italy",
  },
  description:
    "Scopri le 20 regioni d'Italia: luoghi da vedere, borghi, natura e mare, raccontati regione per regione.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${googleSans.variable} ${eczar.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-zinc-900 dark:bg-black dark:text-zinc-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
