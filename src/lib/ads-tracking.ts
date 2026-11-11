/**
 * Google Ads conversion « Demande de devis impression » (value configured at 0 EUR in Google Ads).
 * Public identifiers (they are visible in any page that loads the tag).
 */
export const ADS_TAG_ID = "AW-17859414837";
export const ADS_PRINT_QUOTE_CONVERSION = "AW-17859414837/bf-cCNDjn7YdELWWhMRC";
/** dataLayer event pushed instead of a direct gtag call when the site runs through Google Tag Manager. */
export const GTM_PRINT_QUOTE_EVENT = "print_quote_success";

export const CONSENT_STORAGE_KEY = "art_vision_cookie_consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    /** Set by <GoogleTrackers> once the loader is in place. */
    __avAdsMode?: "gtag" | "gtm";
  }
}

const fired = new Set<string>();

/**
 * Report a print quote request that was SUCCESSFULLY recorded by the server.
 *
 *  - never called on page view, form open, validation error or server error (the caller only invokes it on success);
 *  - respects the cookie banner: nothing is sent unless the visitor accepted;
 *  - one event per request id (double click, re-render, back/forward cannot fire it twice);
 *  - sends no personal data: the only parameter is the conversion destination;
 *  - never throws, so a blocked / missing tag cannot break the form.
 *
 * Returns true when an event was handed to Google (or to the GTM dataLayer).
 */
export function trackPrintQuoteConversion(requestId: string | undefined | null): boolean {
  try {
    if (typeof window === "undefined" || !requestId) return false;
    if (window.localStorage.getItem(CONSENT_STORAGE_KEY) !== "accepted") return false;

    const storageKey = `av_ads_conv_${requestId}`;
    if (fired.has(requestId)) return false;
    try {
      if (window.sessionStorage.getItem(storageKey)) return false;
    } catch {
      /* sessionStorage unavailable: the in-memory guard still applies */
    }

    let sent = false;
    if (window.__avAdsMode === "gtm") {
      // Tag Manager owns the Ads tag: hand it a trigger event, never a second direct hit
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: GTM_PRINT_QUOTE_EVENT });
      sent = true;
    } else if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", { send_to: ADS_PRINT_QUOTE_CONVERSION });
      sent = true;
    }

    if (sent) {
      fired.add(requestId);
      try {
        window.sessionStorage.setItem(storageKey, "1");
      } catch {
        /* ignore */
      }
    }
    return sent;
  } catch {
    return false;
  }
}
