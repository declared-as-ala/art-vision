import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="hero-field grain relative grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <Image src="/brand/logo-mark.svg" alt="" width={28} height={40} className="h-10 w-auto invert" />
        <h1 className="mt-6 text-3xl font-semibold text-indigo">Connexion</h1>
        <p className="mt-1 text-sm text-soft">Espace d&apos;administration Art Visions.</p>
        <LoginForm />
      </div>
    </div>
  );
}
