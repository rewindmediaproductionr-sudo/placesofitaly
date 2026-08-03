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
