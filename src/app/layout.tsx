import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const turkeyIcon = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦃</text></svg>";

export const metadata: Metadata = {
  title: "Thanksgiving Bingo",
  description: "Bingo for your holidays. Like journaling, but with confetti.",
  icons: {
    icon: turkeyIcon,
  },
  openGraph: {
    title: "Thanksgiving Bingo",
    description: "Bingo for your holidays. Like journaling, but with confetti.",
    type: "website",
    siteName: "Thanksgiving Bingo",
    images: [turkeyIcon],
  },
  twitter: {
    card: "summary",
    title: "Thanksgiving Bingo",
    description: "Bingo for your holidays. Like journaling, but with confetti.",
    images: [turkeyIcon],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
