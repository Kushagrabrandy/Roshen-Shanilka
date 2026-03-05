import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Roshen Shanilka | Digital Portfolio",
  description: "Roshen Shanilka – IT Coordinator, Graphic Designer & Web Developer. Explore my projects in IT infrastructure, design, and social media management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
