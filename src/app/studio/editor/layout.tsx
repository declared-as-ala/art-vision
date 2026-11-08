import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Éditeur de création | Studio Art Vision",
  robots: { index: false, follow: false },
};

export default function StudioEditorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
