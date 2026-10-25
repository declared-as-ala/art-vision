import type { Metadata } from "next";
import { ServicesIndex } from "@/components/site/services-pages";
import { alternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "خدمات التصميم الجرافيكي والرقمي في تونس | Art Visions",
  description: "تصميم شعارات وهوية بصرية ومطبوعات ومواقع إلكترونية للشركات التونسية. اكتشفوا خدماتنا واطلبوا عرض سعر.",
  alternates: alternates({ fr: "/services", ar: "/ar/services" }, "ar"),
};

export default function Page() {
  return <ServicesIndex locale="ar" />;
}
