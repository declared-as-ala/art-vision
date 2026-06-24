"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const consented = () =>
  typeof window !== "undefined" && localStorage.getItem("art_vision_cookie_consent") === "accepted";

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function visitorId() {
  let v = localStorage.getItem("av_vid");
  if (!v) { v = uid(); localStorage.setItem("av_vid", v); }
  return v;
}
function sessionId() {
  let s = sessionStorage.getItem("av_sid");
  if (!s) { s = uid(); sessionStorage.setItem("av_sid", s); }
  return s;
}

function send(eventType: string, pagePath: string) {
  if (!consented()) return;
  try {
    const body = JSON.stringify({
      eventType,
      pagePath,
      pageTitle: document.title,
      sessionId: sessionId(),
      visitorId: visitorId(),
      referrer: document.referrer || undefined,
    });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/analytics/track", new Blob([body], { type: "application/json" }));
    else fetch("/api/analytics/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  } catch { /* never break the page */ }
}

// Consent-aware anonymous analytics: page views + clicks on [data-tracking].
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const last = useRef("");

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (last.current === pathname) return;
    last.current = pathname;
    send("page_view", pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-tracking]");
      const type = el?.getAttribute("data-tracking");
      if (type) send(type, window.location.pathname);
    };
    const onConsent = () => send("page_view", window.location.pathname);
    document.addEventListener("click", onClick, true);
    window.addEventListener("cookie-consent-changed", onConsent);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("cookie-consent-changed", onConsent);
    };
  }, []);

  return null;
}
