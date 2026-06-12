"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fires a lightweight POST to /api/track whenever the user navigates to a new
 * public page. Ignored on /admin and /api routes (also filtered server-side).
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public pages
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    // Use sendBeacon if available (non-blocking, survives page unload)
    const payload = JSON.stringify({ path: pathname });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null; // Renders nothing
}
