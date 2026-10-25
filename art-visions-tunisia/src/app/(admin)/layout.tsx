import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Admin | Art Visions", template: "%s | Admin Art Visions" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="fr" dir="ltr" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
