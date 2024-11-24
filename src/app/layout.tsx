import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benny Nottonson",
  description: "A personal website for Benny Nottonson",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
