import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
