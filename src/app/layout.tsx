import type { Metadata } from "next";
import { Poppins, Rubik } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { siteConfig } from "./page";
const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-poppins",
});
const rubik = Rubik({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - Software Engineer`,
  },
  description: siteConfig.description,
  keywords: [
    "md",
    "benny",
    "nottonson",
    "Md",
    "MD",
    "BENNY",
    "Benny",
    "Nottonson",
    "benny nottonson",
    "Benny Nottonson",
    "Bennynottonson",
    "portfolio",
    "web developer",
    "web",
    "web dev",
    "developer",
    "PROGRAMMER ",
    "programmer ",
    "BENNY NOTTONSON ",
    "website",
    "@Bennynottonson",
    "Bennynottonson",
    "benny developer",
  ],
  authors: [
    {
      name: "Benny Nottonson",
      url: "https://github.com/Benny-Nottonson",
    },
  ],
  creator: "Benny Nottonson",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@bennynottonson",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${rubik.variable}`}>
        <main
          className={cn(
            "flex  relative break-words h-dvh min-h-screen items-center justify-between pt-24 pb-4 px-40 max-md:p-4 bg-transparent max-sm:pt-20 bg-[radial-gradient(#2f7df4_0px,transparent_1px)] [background-size:8px_8px]",
            { "bg-white": "#282A36" },
          )}
        >
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
