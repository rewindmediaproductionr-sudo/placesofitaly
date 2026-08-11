-- Places of Italy — estende la gerarchia con Provincia e Comune, e rende le
-- pagine "Influencer" (kind = 'pagina') agganciabili a qualunque livello:
-- Regione, Provincia o Comune. Da eseguire DOPO 001 e 002.
--
-- Fuori scopo per questa migration (volutamente):
--   - nessun elenco completo delle 107 province o dei ~7900 comuni italiani
--     (andrà importato da una fonte ufficiale, es. ISTAT, in un secondo momento);
--   - nessuna pagina pubblica /provincia o /comune;
--   - nessuna modifica al form di iscrizione influencer.
-- Qui si prepara solo la struttura dati, con un capoluogo di provincia per
-- regione come dato di prova per verificare che la gerarchia a tre livelli
-- e l'aggancio multi-livello funzionino.
--
-- Idempotente: rieseguirlo non produce errori né duplicati.

do $$ begin
  if to_regclass('public.entities') is null then
    raise exception
      'Esegui prima supabase/migrations/001_rating_schema.sql: la tabella public.entities non esiste.';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 1. Dati di prova: un capoluogo di provincia per regione
-- ---------------------------------------------------------------------------
-- entity_kind include già 'provincia' e 'comune' fin da 001 (l'enum è stato
-- disegnato apposta per accogliere livelli futuri). Qui il capoluogo di
-- ciascuna regione (già presente come "capital" in lib/regions.ts) diventa
-- sia la provincia campione sia il comune campione, cioè due entità reali
-- ma con nomi semplificati ("Provincia di X" anche dove il nome ufficiale è
-- diverso, es. Roma, Trento, Aosta): sufficiente per collaudare la gerarchia,
-- non per rappresentarla in modo amministrativamente accurato.

insert into public.entities (ref, kind, slug, name, parent_id)
select 'provincia:' || v.slug, 'provincia', v.slug, 'Provincia di ' || v.name, r.id
  from (values
    ('abruzzo',               'l-aquila',   'L''Aquila'),
    ('basilicata',            'potenza',    'Potenza'),
    ('calabria',               'catanzaro',  'Catanzaro'),
    ('campania',               'napoli',     'Napoli'),
    ('emilia-romagna',         'bologna',    'Bologna'),
    ('friuli-venezia-giulia',  'trieste',    'Trieste'),
    ('lazio',                  'roma',       'Roma'),
    ('liguria',                'genova',     'Genova'),
    ('lombardia',              'milano',     'Milano'),
    ('marche',                 'ancona',     'Ancona'),
    ('molise',                 'campobasso', 'Campobasso'),
    ('piemonte',               'torino',     'Torino'),
    ('puglia',                 'bari',       'Bari'),
    ('sardegna',               'cagliari',   'Cagliari'),
    ('sicilia',                'palermo',    'Palermo'),
    ('toscana',                'firenze',    'Firenze'),
    ('trentino-alto-adige',    'trento',     'Trento'),
    ('umbria',                 'perugia',    'Perugia'),
    ('valle-d-aosta',          'aosta',      'Aosta'),
    ('veneto',                 'venezia',    'Venezia')
  ) as v(region_slug, slug, name)
  join public.entities r on r.ref = 'regione:' || v.region_slug
on conflict (ref) do update
  set name      = excluded.name,
      parent_id = excluded.parent_id,
      is_active = true;

insert into public.entities (ref, kind, slug, name, parent_id)
select 'comune:' || v.slug, 'comune', v.slug, v.name, p.id
  from (values
    ('l-aquila',   'L''Aquila'),
    ('potenza',    'Potenza'),
    ('catanzaro',  'Catanzaro'),
    ('napoli',     'Napoli'),
    ('bologna',    'Bologna'),
    ('trieste',    'Trieste'),
    ('roma',       'Roma'),
    ('genova',     'Genova'),
    ('milano',     'Milano'),
    ('ancona',     'Ancona'),
    ('campobasso', 'Campobasso'),
    ('torino',     'Torino'),
    ('bari',       'Bari'),
    ('cagliari',   'Cagliari'),
    ('palermo',    'Palermo'),
    ('firenze',    'Firenze'),
    ('trento',     'Trento'),
    ('perugia',    'Perugia'),
    ('aosta',      'Aosta'),
    ('venezia',    'Venezia')
  ) as v(slug, name)
  join public.entities p on p.ref = 'provincia:' || v.slug
on conflict (ref) do update
  set name      = excluded.name,
      parent_id = excluded.parent_id,
      is_active = true;

-- ---------------------------------------------------------------------------
-- 2. Profili: livello scelto dal futuro influencer
-- ---------------------------------------------------------------------------
-- Campi opzionali e additivi: region_slug resta il comportamento storico
-- (aggancio alla regione) quando i due nuovi campi sono NULL, quindi il form
-- di iscrizione attuale continua a funzionare identico a prima.

alter table public.profiles add column if not exists provincia_slug text;
alter table public.profiles add column if not exists comune_slug    text;

-- ---------------------------------------------------------------------------
-- 3. Pagina influencer: aggancio al livello più specifico indicato
-- ---------------------------------------------------------------------------
-- Ordine di priorità: comune > provincia > regione. Sostituisce la versione
-- di 001 che guardava solo region_slug.

create or replace function public.handle_partner_page()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_profile   public.profiles;
  v_parent_id bigint;
begin
  if new.email_confirmed_at is null or old.email_confirmed_at is not null then
    return null;
  end if;

  select * into v_profile from public.profiles where id = new.id;
  if not found or v_profile.user_type <> 'partner' then
    return null;
  end if;

  if v_profile.comune_slug is not null then
    select id into v_parent_id from public.entities where ref = 'comune:' || v_profile.comune_slug;
  elsif v_profile.provincia_slug is not null then
    select id into v_parent_id from public.entities where ref = 'provincia:' || v_profile.provincia_slug;
  elsif v_profile.region_slug is not null then
    select id into v_parent_id from public.entities where ref = 'regione:' || v_profile.region_slug;
  end if;

  if v_parent_id is null then return null; end if;

  insert into public.entities (ref, kind, slug, name, parent_id, url_path, owner_id)
  values ('pagina:partner/' || new.id,
          'pagina',
          'partner-' || new.id,
          v_profile.full_name,
          v_parent_id,
          v_profile.social_link,
          new.id)
  on conflict (ref) do nothing;

  return null;
end $$;

revoke all on function public.handle_partner_page() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Riallineamento aggregati e marcatore di completamento
-- ---------------------------------------------------------------------------

do $$ begin
  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where p.proname = 'recompute_all_stats' and n.nspname = 'public'
  ) then
    perform public.recompute_all_stats();
  end if;
end $$;

select 'Migration 003 completata: province e comuni di prova inseriti, pagine influencer agganciabili a qualunque livello.' as esito;
