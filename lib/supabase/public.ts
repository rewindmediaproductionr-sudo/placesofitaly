import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client pubblico e SENZA cookie, per le sole letture di dati pubblici.
//
// Volutamente da "@supabase/supabase-js" e non da "@supabase/ssr": quest'ultimo
// passa sempre da un cookie store, e lib/supabase/server.ts chiama cookies().
// Usare quei client dentro il render di una pagina la renderebbe dinamica,
// facendo perdere la generazione statica a tutte le pagine regione e alla home.
//
// Non usarlo mai per dati dell'utente: non ha sessione.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
