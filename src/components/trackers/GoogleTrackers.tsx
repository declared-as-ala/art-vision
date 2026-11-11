"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { ADS_TAG_ID, CONSENT_STORAGE_KEY } from "@/lib/ads-tracking";

interface GoogleTrackersProps {
  gaId?: string;
  gtmId?: string;
}

// Consent Mode v2 signals granted by « Tout accepter » (the banner covers analytics and audience measurement).
// Ad personalisation / user-data sharing stay denied: the banner does not ask for them.
const CONSENT_GRANTED = "{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'denied',ad_personalization:'denied'}";
const CONSENT_DENIED = "{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'}";

export default function GoogleTrackers({ gaId, gtmId }: GoogleTrackersProps) {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const granted = localStorage.getItem(CONSENT_STORAGE_KEY) === "accepted";
      setConsentGranted(granted);
      // Visitor withdrew / refused after tags were loaded: tell Google right away
      if (!granted && typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          ad_storage: "denied",
          analytics_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }
    };

    // Initial check
    checkConsent();

    // Listen to changes
    window.addEventListener("cookie-consent-changed", checkConsent);
    return () => window.removeEventListener("cookie-consent-changed", checkConsent);
  }, []);

  // Nothing is loaded before the visitor accepts (stricter than a Consent Mode "denied by default" load)
  if (!consentGranted) return null;

  // Existing behaviour is kept (GA4 direct when an id is set, Tag Manager when an id is set).
  // The Google Ads tag is added to the existing integration — never loaded twice:
  //  - with Tag Manager: the Ads tag/conversion live in the container (we only push a trigger event);
  //  - otherwise: the same single gtag.js used for GA4 also carries the Ads destination
  //    (and is loaded with the Ads id when there is no GA4 id).
  const useGtm = Boolean(gtmId);
  const showGtag = Boolean(gaId) || !useGtm;
  const gtagLoaderId = gaId || ADS_TAG_ID;

  return (
    <>
      {showGtag && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagLoaderId}`} strategy="afterInteractive" />
          <Script id="google-gtag" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              ${useGtm ? "" : `gtag('consent', 'default', ${CONSENT_DENIED});`}
              gtag('js', new Date());
              ${useGtm ? "" : `gtag('consent', 'update', ${CONSENT_GRANTED});`}
              ${gaId ? `gtag('config', '${gaId}', { page_path: window.location.pathname });` : ""}
              ${useGtm ? "" : `gtag('config', '${ADS_TAG_ID}'); window.__avAdsMode = 'gtag';`}
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager (GTM): the Google Ads tag/conversion is configured inside the container */}
      {useGtm && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('consent', 'default', ${CONSENT_DENIED});
            gtag('consent', 'update', ${CONSENT_GRANTED});
            window.__avAdsMode = 'gtm';
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}
    </>
  );
}
