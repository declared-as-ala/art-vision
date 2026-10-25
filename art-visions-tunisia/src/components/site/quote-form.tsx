"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, type QuoteInput } from "@/lib/validation/quote";
import { SERVICES } from "@/content/services";
import { DICT, type Locale } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const select =
  "h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30";

export function QuoteForm({ locale }: { locale: Locale }) {
  const f = DICT[locale].form;
  const params = useSearchParams();
  const presetSlug = params.get("service") ?? "";
  const preset = SERVICES.find((s) => s.slugs.fr === presetSlug || s.slugs.ar === presetSlug)?.id ?? "";
  const brief = params.get("brief") ?? "";
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { service: preset, message: brief },
  });

  async function onSubmit(values: QuoteInput) {
    setState("idle");
    const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    if (res.ok) return setState("sent");
    const body = await res.json().catch(() => ({}));
    setErrorMsg(res.status === 429 || res.status === 503 ? body.error : f.errGeneric);
    setState("error");
  }

  if (state === "sent") {
    return (
      <div role="status" className="rounded-3xl bg-indigo p-10 text-white">
        <h2 className="text-3xl font-semibold">{f.thanks}</h2>
        <p className="mt-3 text-white/70">{f.thanksSub}</p>
      </div>
    );
  }

  const err = (m?: string) => m && <span className="text-xs text-brand-ink">{m}</span>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 rounded-3xl border border-line bg-white p-6 sm:p-8">
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register("website")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="name">{f.name}</Label>
          <Input id="name" autoComplete="name" {...register("name")} />
          {err(errors.name && f.errName)}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">{f.email}</Label>
          <Input id="email" type="email" dir="ltr" autoComplete="email" {...register("email")} />
          {err(errors.email && f.errEmail)}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">{f.phone}</Label>
          <Input id="phone" type="tel" dir="ltr" autoComplete="tel" {...register("phone")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="company">{f.company}</Label>
          <Input id="company" autoComplete="organization" {...register("company")} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="service">{f.service}</Label>
        <select id="service" className={select} {...register("service")}>
          <option value="">{f.serviceUndefined}</option>
          {SERVICES.map((s) => (<option key={s.id} value={s.id}>{s[locale].name}</option>))}
        </select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="message">{f.message}</Label>
        <Textarea id="message" rows={6} {...register("message")} />
        {err(errors.message && f.errMessage)}
      </div>
      {state === "error" && <p role="alert" className="text-sm text-brand-ink">{errorMsg}</p>}
      <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 justify-self-start rounded-full bg-brand px-8 text-white hover:bg-brand-ink">
        {isSubmitting ? f.sending : f.send}
      </Button>
    </form>
  );
}
