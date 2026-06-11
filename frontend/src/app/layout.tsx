import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusFix",
  description: "Smart campus issue tracking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-100 text-slate-950">{children}</body>
    </html>
  );
}
