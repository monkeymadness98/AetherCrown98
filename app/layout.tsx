import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AetherCrown98 - Autonomous AI-Driven Business Empire",
  description: "Experience the future of AI-powered business automation with cutting-edge AI agents, real-time analytics, and enterprise-grade automation.",
  keywords: ["AI automation", "business intelligence", "analytics", "AI agents", "enterprise automation"],
  authors: [{ name: "AetherCrown98" }],
  openGraph: {
    title: "AetherCrown98 - Autonomous AI-Driven Business Empire",
    description: "Experience the future of AI-powered business automation",
    url: "https://aethercrown98.vercel.app",
    siteName: "AetherCrown98",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AetherCrown98",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AetherCrown98 - AI-Driven Business Empire",
    description: "Experience the future of AI-powered business automation",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
