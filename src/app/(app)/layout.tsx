import type { Metadata } from "next";
import "../globals.css";
import I18nProvider from "@/components/i18n-provider";

export const metadata: Metadata = {
  title: "Health Check Kiosk",
  description: "Advanced health assessment kiosk application",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
