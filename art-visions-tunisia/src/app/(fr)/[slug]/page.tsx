import type { Metadata } from "next";
import { dbMetadata, DbPageView } from "@/components/site/db-page";

// Resolve builder content before streaming so unknown URLs return a real 404 (not a soft 404).
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return (await dbMetadata("page", "fr", slug)) ?? { robots: { index: false } };
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  return <DbPageView kind="page" lang="fr" slug={slug} />;
}
