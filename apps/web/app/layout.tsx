import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Flights, Hotels, Tours & Visa Assistance`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Dellics Travels is a Ghana-based IATA-certified travel agency offering flights, hotels, tours, airport transfers and visa assistance worldwide.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/Favicon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col antialiased" suppressHydrationWarning>
        <AuthProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}

