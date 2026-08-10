# Places of Italy

Portale turistico dedicato alle 20 regioni italiane, pensato per raccontare
ogni regione e dare visibilità ai canali social che la promuovono.

## Struttura

- `/` — home con panoramica e griglia delle 20 regioni
- `/[regione]` — pagina dedicata a ciascuna regione (es. `/abruzzo`, `/campania`)
- `/tools` — area partner (non indicizzata, non presente nella navigazione
  principale) con kit social media, elenco canali per regione, linee guida
  per collaboratori e contatto per entrare nel circuito

I dati delle regioni (descrizioni, punti di interesse, canali social) sono
in `lib/regions.ts`. I canali social sono opzionali: finché non vengono
aggiunti, la pagina regione mostra "canale in fase di attivazione".

## Registrazione utenti

`/registrati` permette di creare un account come **viaggiatore** o come
**partner** (chi gestisce un canale social regionale). L'autenticazione usa
[Supabase](https://supabase.com):

1. Crea un progetto su supabase.com.
2. Esegui `supabase/schema.sql` nell'SQL editor del progetto: crea la tabella
   `profiles` e il trigger che la popola alla registrazione.
3. Copia `.env.local.example` in `.env.local` e imposta `NEXT_PUBLIC_SUPABASE_URL`
   e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API).
4. In Authentication → URL Configuration, imposta la Site URL e aggiungi
   `/auth/confirm` tra i redirect URL consentiti.
5. In Authentication → Email Templates → "Confirm signup", sostituisci il
   link generato con:
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
   (necessario perché la conferma viene gestita dalla route
   `app/auth/confirm/route.ts` invece che dal dominio di Supabase).
6. In Authentication → Email Templates → "Reset Password", sostituisci il
   link generato con:
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/recupera-password/nuova`

`/accedi` gestisce il login, `/recupera-password` l'invio del link di
recupero e `/recupera-password/nuova` l'inserimento della nuova password
dopo aver aperto il link ricevuto via email.

Se dopo aver fatto tutto questo la registrazione o il login rispondono
ancora con un errore generico, controlla i log della function su Vercel
(Project → Deployments → Functions): l'errore reale di Supabase viene
loggato lì con `console.error`, senza essere mostrato all'utente.

## Like e classifiche

Gli utenti registrati possono mettere like ai contenuti. I like **salgono a
cascata**: un like su un luogo fa crescere il punteggio del suo comune, della
provincia e della regione.

Il modello è già predisposto per province, comuni, luoghi ed eventi anche se
oggi esistono solo le regioni: tutti i livelli vivono nella stessa tabella
`entities`, e un contenuto si aggancia all'antenato più vicino che esiste. Il
giorno in cui arriveranno i comuni basterà cambiare `parent_id`, senza rifare
né lo schema né i conteggi.

Ogni territorio mostra due numeri, che misurano cose diverse:

- **Like totali** — la somma di tutti i like del territorio e dei suoi
  contenuti. È la classifica di popolarità: le regioni grandi tendono a
  vincere, ed è corretto così.
- **Media per contenuto** — i like divisi per il numero di contenuti, con una
  correzione statistica che impedisce a un contenuto con pochissimi voti di
  schizzare in cima. Serve a confrontare territori di dimensioni molto diverse.

Finché le regioni non avranno contenuti figli i due numeri coincidono: è
atteso, non è un errore di calcolo.

Chi si registra come **partner** ottiene automaticamente una pagina votabile
(il proprio canale social), collegata alla sua regione, creata alla conferma
dell'email. La pubblicazione si può disattivare in ogni momento da `/profilo`.

## Modifiche allo schema del database

`supabase/schema.sql` è il bootstrap di un progetto vuoto e **non va più
modificato**: non è rieseguibile. Ogni modifica successiva è un file numerato
in `supabase/migrations/`, da eseguire in ordine nell'SQL editor:

```
supabase/migrations/001_rating_schema.sql   sistema di like (tabelle, trigger, RLS)
supabase/migrations/002_seed_entities.sql   le 20 regioni come entità votabili
```

Ogni file è scritto per essere **idempotente**: eseguirlo due volte non produce
errori né duplicati. Chi aggiunge nuove migrazioni deve mantenere questa
proprietà (`create table if not exists`, `create or replace function`,
`drop policy if exists` prima di ogni `create policy`, seed con
`on conflict do update`).

Se aggiungi una regione a `lib/regions.ts`, ricordati di aggiungerla anche a
`002_seed_entities.sql`: il sito non si rompe se te ne dimentichi (la regione
semplicemente non riceve like), e in sviluppo la console avvisa del
disallineamento.

## Sviluppo

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Note

- L'indirizzo email nella pagina `/tools` (`collabora@placesofitaly.it`) è un
  placeholder: sostituiscilo con un indirizzo reale prima del lancio.
- I canali social ufficiali per regione vanno aggiunti manualmente in
  `lib/regions.ts` (campo `social`) man mano che vengono raccolti.
