import type { Metadata } from "next";
import RegistrationForm from "@/components/RegistrationForm";

export const metadata: Metadata = {
  title: "Registrati",
  description: "Entra a far parte del circuito Places of Italy.",
};

export default function RegistratiPage() {
  return (
    <div className="mx-auto max-w-lg px-6 pb-16 pt-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-50">
        Registrati
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Entra a far parte di Places of Italy
      </h1>
      <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Crea il tuo account come viaggiatore o come partner del circuito.
      </p>

      <div className="mt-10">
        <RegistrationForm />
      </div>
    </div>
  );
}
