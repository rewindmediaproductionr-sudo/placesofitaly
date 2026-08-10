-- Places of Italy — seed delle entità votabili.
-- Da eseguire nell'SQL editor DOPO 001_rating_schema.sql.
-- Idempotente: rieseguirlo aggiorna i nomi senza duplicare nulla.

-- Le 20 regioni restano contenuto editoriale versionato in lib/regions.ts:
-- qui il database ne tiene solo lo specchio identitario, per agganciare i like.
-- Chiave di join fra i due mondi: ref = 'regione:' || slug.
--
-- Aggiungendo una regione a lib/regions.ts senza aggiornare questo file il
-- sito NON si rompe: l'entità semplicemente non ha like e la UI lo dice.
-- In sviluppo, lib/ratings/queries.ts logga un avviso di disallineamento.
insert into public.entities (ref, kind, slug, name, url_path) values
  ('regione:abruzzo',               'regione', 'abruzzo',               'Abruzzo',               '/abruzzo'),
  ('regione:basilicata',            'regione', 'basilicata',            'Basilicata',            '/basilicata'),
  ('regione:calabria',              'regione', 'calabria',              'Calabria',              '/calabria'),
  ('regione:campania',              'regione', 'campania',              'Campania',              '/campania'),
  ('regione:emilia-romagna',        'regione', 'emilia-romagna',        'Emilia-Romagna',        '/emilia-romagna'),
  ('regione:friuli-venezia-giulia', 'regione', 'friuli-venezia-giulia', 'Friuli-Venezia Giulia', '/friuli-venezia-giulia'),
  ('regione:lazio',                 'regione', 'lazio',                 'Lazio',                 '/lazio'),
  ('regione:liguria',               'regione', 'liguria',               'Liguria',               '/liguria'),
  ('regione:lombardia',             'regione', 'lombardia',             'Lombardia',             '/lombardia'),
  ('regione:marche',                'regione', 'marche',                'Marche',                '/marche'),
  ('regione:molise',                'regione', 'molise',                'Molise',                '/molise'),
  ('regione:piemonte',              'regione', 'piemonte',              'Piemonte',              '/piemonte'),
  ('regione:puglia',                'regione', 'puglia',                'Puglia',                '/puglia'),
  ('regione:sardegna',              'regione', 'sardegna',              'Sardegna',              '/sardegna'),
  ('regione:sicilia',               'regione', 'sicilia',               'Sicilia',               '/sicilia'),
  ('regione:toscana',               'regione', 'toscana',               'Toscana',               '/toscana'),
  ('regione:trentino-alto-adige',   'regione', 'trentino-alto-adige',   'Trentino-Alto Adige',   '/trentino-alto-adige'),
  ('regione:umbria',                'regione', 'umbria',                'Umbria',                '/umbria'),
  ('regione:valle-d-aosta',         'regione', 'valle-d-aosta',         'Valle d''Aosta',        '/valle-d-aosta'),
  ('regione:veneto',                'regione', 'veneto',                'Veneto',                '/veneto')
on conflict (ref) do update
  set name      = excluded.name,
      url_path  = excluded.url_path,
      is_active = true;

-- Riallinea i contatori dopo il seed (necessario solo se le entità esistevano
-- già con statistiche divergenti; su un database nuovo è un no-op).
select public.recompute_all_stats();
