import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dellics Travels",
  description: "Travel agency website — rebuild in progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
