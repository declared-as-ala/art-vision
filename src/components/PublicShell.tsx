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
  // The design editor is a full-screen app: no site navbar/footer/floating widgets
  const isStudioEditor = pathname?.startsWith("/studio/editor");

  if (isAdmin) {
    // Admin pages: render children directly — no public nav/footer
    return <>{children}</>;
  }

  if (isStudioEditor) {
    return (
      <>
        <PageViewTracker />
        <AnalyticsTracker />
        <main className="flex-1">{children}</main>
        <CookieConsent />
      </>
    );
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
