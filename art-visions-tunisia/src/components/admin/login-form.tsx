"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/(admin)/admin/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {} as { error?: string; email?: string });
  return (
    <form action={action} className="mt-6 grid gap-4">
      <div className="grid gap-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="username" defaultValue={state.email} key={state.email} required /></div>
      <div className="grid gap-1.5"><Label htmlFor="password">Mot de passe</Label><Input id="password" name="password" type="password" autoComplete="current-password" required /></div>
      {state.error && <p role="alert" className="text-sm text-brand-ink">{state.error}</p>}
      <Button type="submit" disabled={pending} className="h-11 rounded-full bg-indigo text-white hover:bg-brand">{pending ? "Connexion…" : "Se connecter"}</Button>
    </form>
  );
}
