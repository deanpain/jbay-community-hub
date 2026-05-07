import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "J-Bay Community Hub — Admin",
  description: "Admin dashboard for J-Bay Community Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
