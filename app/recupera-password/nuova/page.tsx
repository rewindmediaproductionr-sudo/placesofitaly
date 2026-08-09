import type { Metadata } from "next";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Nuova password",
  description: "Scegli una nuova password per il tuo account Places of Italy.",
};

export default function NuovaPasswordPage() {
  return (
    <div className="mx-auto max-w-lg px-6 pb-16 pt-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-50">
        Recupera password
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Scegli una nuova password
      </h1>

      <div className="mt-10">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
