import React from "react";
import { STUDIO_FONTS_HREF } from "@/components/studio/studioUtils";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Typefaces offered in the editor (Playfair, Cinzel, Oswald, Inter, Montserrat) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={STUDIO_FONTS_HREF} />
      {children}
    </>
  );
}
