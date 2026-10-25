import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteForm } from "@/components/site/quote-form";
import { dbMetadata, DbPageView } from "@/components/site/db-page";
import { getLive } from "@/lib/pages";
import { SITE } from "@/lib/site";
import { alternates } from "@/lib/seo";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return (
    (await dbMetadata("page", "ar", "contact")) ?? {
      title: "اطلب عرض سعر مجاني | Art Visions تونس",
      description: "صِفوا مشروعكم: شعار أو هوية بصرية أو مطبوعات أو موقع إلكتروني، وستصلكم من Art Visions رسالة بمقترح مناسب.",
      alternates: alternates({ fr: "/contact", ar: "/ar/contact" }, "ar"),
    }
  );
}

export default async function Page() {
  if (await getLive("page", "ar", "contact")) return <DbPageView kind="page" lang="ar" slug="contact" />;
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <h1 className="text-5xl font-semibold text-indigo sm:text-6xl">اطلب عرض سعر</h1>
        <p className="mt-6 text-lg text-soft">بضعة أسطر عن نشاطكم وحاجتكم تكفي للانطلاق.</p>
        <p className="mt-8 text-sm">أو راسلونا: <a dir="ltr" className="num underline decoration-brand decoration-2 underline-offset-4" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
      </div>
      <div className="lg:col-span-7"><Suspense fallback={null}><QuoteForm locale="ar" /></Suspense></div>
    </div>
  );
}
