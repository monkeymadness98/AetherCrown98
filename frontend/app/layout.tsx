import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AetherCrown98",
  description: "Autonomous AI-driven business empire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
