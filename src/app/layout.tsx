import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne"
});

export const metadata: Metadata = {
  title: "Kim Yamamoto - Future Software Engineer",
  description: "Portfolio of Kim Yamamoto, Future Software Engineer.",
  icons: {
    icon: "/images/KY_LOGO.png",
    shortcut: "/images/KY_LOGO.png",
    apple: "/images/KY_LOGO.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${syne.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
