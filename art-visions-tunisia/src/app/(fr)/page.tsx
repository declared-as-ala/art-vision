import type { Metadata } from "next";
import { Home } from "@/components/site/home";
import { dbMetadata, DbPageView } from "@/components/site/db-page";
import { getLive } from "@/lib/pages";
import { alternates } from "@/lib/seo";

// A published builder version of the homepage (slug "home") takes over; otherwise the code version shows.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return (await dbMetadata("page", "fr", "home")) ?? { alternates: alternates({ fr: "/", ar: "/ar" }, "fr") };
}

export default async function Page() {
  if (await getLive("page", "fr", "home")) return <DbPageView kind="page" lang="fr" slug="home" />;
  return <Home locale="fr" />;
}
