"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Sends one anonymous page-view beacon per navigation. Respects Do Not Track. No cookies, no storage. */
export function Tracker() {
  const path = usePathname();
  useEffect(() => {
    if (navigator.doNotTrack === "1") return;
    const payload = JSON.stringify({ path, ref: document.referrer });
    try {
      navigator.sendBeacon?.("/api/track", new Blob([payload], { type: "application/json" }));
    } catch { /* ignore */ }
  }, [path]);
  return null;
}
