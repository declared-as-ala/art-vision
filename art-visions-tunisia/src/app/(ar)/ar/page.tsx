import type { Metadata } from "next";
import { Home } from "@/components/site/home";
import { dbMetadata, DbPageView } from "@/components/site/db-page";
import { getLive } from "@/lib/pages";
import { alternates } from "@/lib/seo";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return (await dbMetadata("page", "ar", "home")) ?? { alternates: alternates({ fr: "/", ar: "/ar" }, "ar") };
}

export default async function Page() {
  if (await getLive("page", "ar", "home")) return <DbPageView kind="page" lang="ar" slug="home" />;
  return <Home locale="ar" />;
}
