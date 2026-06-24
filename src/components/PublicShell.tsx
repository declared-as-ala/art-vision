"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import CookieConsent from "@/components/CookieConsent";
import PageViewTracker from "@/components/PageViewTracker";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin pages: render children directly — no public nav/footer
    return <>{children}</>;
  }

  return (
    <>
      <PageViewTracker />
      <AnalyticsTracker />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <CookieConsent />
    </>
  );
}
