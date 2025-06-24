import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health Check Kiosk",
  description: "Advanced health assessment kiosk application",
  generator: "v0.dev",
  viewport: "width=device-width, initial-scale=1",
  robots: "noindex, nofollow", // Prevent indexing for kiosk app
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
} 