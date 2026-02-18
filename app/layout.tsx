import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistPixel = GeistPixelSquare;

export const metadata: Metadata = {
  title: "India AI Impact Summit 2026",
  description: "Browse 679 sessions at the India AI Impact Summit 2026, Feb 16–20 at Bharat Mandapam, New Delhi. Interactive venue map, search, and filters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${geistPixel.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var s=localStorage.getItem("theme");if(s==="dark"||(!s&&matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()` }} />
        <script defer src="https://stat.sys256.com/script.js"></script>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
