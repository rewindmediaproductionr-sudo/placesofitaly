-- Places of Italy — sistema di like gerarchico a cascata.
-- Da eseguire nell'SQL editor del progetto Supabase, DOPO schema.sql.
-- Questo file è idempotente: rieseguirlo non produce errori né duplicati.

-- ---------------------------------------------------------------------------
-- 1. Tipi
-- ---------------------------------------------------------------------------

-- L'ordine dei valori segue la gerarchia: un livello futuro si inserisce con
-- alter type public.entity_kind add value 'frazione' after 'comune'.
do $$ begin
  if not exists (
    select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'entity_kind' and n.nspname = 'public'
  ) then
    create type public.entity_kind as enum
      ('regione', 'provincia', 'comune', 'luogo', 'evento', 'pagina');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Tabelle
-- ---------------------------------------------------------------------------

-- Tabella unica polimorfica per ogni livello della gerarchia.
-- parent_id può puntare a QUALUNQUE livello superiore, non solo a quello
-- immediatamente precedente: è ciò che permette a un luogo di pendere oggi
-- dalla regione e domani dal comune, senza redesign.
--
-- ancestor_ids è un materialized path (ordinato dalla radice) invece di ltree:
-- gli operatori sugli array stanno in pg_catalog e restano quindi risolvibili
-- dalle funzioni con "set search_path = public", mentre gli operatori ltree
-- vivono nello schema extensions e fallirebbero silenziosamente.
create table if not exists public.entities (
  id           bigint generated always as identity primary key,
  ref          text not null unique,
  kind         public.entity_kind not null,
  slug         text not null,
  name         text not null,
  -- Volutamente SENZA on delete cascade: in un cascade le righe figlie sono
  -- rimosse nella stessa transazione e il trigger sul like non troverebbe più
  -- l'entità, lasciando i contatori degli antenati gonfiati in silenzio.
  -- La rimozione normale è is_active = false.
  parent_id    bigint references public.entities (id),
  ancestor_ids bigint[] not null default '{}',
  depth        smallint not null default 0,
  url_path     text,
  owner_id     uuid references auth.users (id) on delete set null, -- solo per 'pagina'
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists entities_parent_idx    on public.entities (parent_id);
create index if not exists entities_kind_idx      on public.entities (kind) where is_active;
create index if not exists entities_ancestors_idx on public.entities using gin (ancestor_ids);

-- La primary key composta È il vincolo "un like per persona per contenuto":
-- niente logica applicativa, niente race condition, doppio click innocuo.
create table if not exists public.entity_likes (
  entity_id  bigint not null references public.entities (id) on delete cascade,
  user_id    uuid   not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (entity_id, user_id)
);

create index if not exists entity_likes_user_idx on public.entity_likes (user_id);

-- Parametro di smoothing dell'indice di gradimento, modificabile senza deploy.
create table if not exists public.rating_params (
  id           int primary key default 1 check (id = 1),
  prior_weight numeric not null default 10
);

insert into public.rating_params (id) values (1) on conflict (id) do nothing;

-- Solo accumulatori additivi: l'unico tipo di grandezza che un trigger può
-- mantenere in modo incrementale corretto. Tutto il resto è calcolato nella
-- vista, perché dipende da prior_weight.
create table if not exists public.entity_stats (
  entity_id        bigint primary key references public.entities (id) on delete cascade,
  direct_likes     integer not null default 0,
  subtree_likes    integer not null default 0,
  subtree_entities integer not null default 1,
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. Gerarchia: calcolo e manutenzione del path
-- ---------------------------------------------------------------------------

create or replace function public.entities_set_path()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_anc bigint[];
begin
  if new.parent_id is null then
    new.ancestor_ids := '{}'::bigint[];
  else
    select e.ancestor_ids || e.id into v_anc
      from public.entities e where e.id = new.parent_id;
    if v_anc is null then
      raise exception 'Entità genitore % inesistente', new.parent_id;
    end if;
    if new.id = any (v_anc) then
      raise exception 'Ciclo nella gerarchia delle entità (id %)', new.id;
    end if;
    new.ancestor_ids := v_anc;
  end if;
  new.depth := cardinality(new.ancestor_ids);
  return new;
end $$;

-- new.id è già valorizzato in un BEFORE INSERT: le identity column ricevono il
-- default prima dei trigger BEFORE.
drop trigger if exists entities_set_path on public.entities;
create trigger entities_set_path
  before insert or update of parent_id on public.entities
  for each row execute function public.entities_set_path();

-- Riscrive i path dell'intero sottoalbero dopo un re-parenting.
create or replace function public.rebuild_subtree_paths(p_root bigint)
returns void language plpgsql security definer set search_path = public as $$
begin
  with recursive t as (
    select e.id, e.ancestor_ids from public.entities e where e.id = p_root
    union all
    select c.id, t.ancestor_ids || t.id
      from public.entities c join t on c.parent_id = t.id
  )
  update public.entities e
     set ancestor_ids = t.ancestor_ids,
         depth        = cardinality(t.ancestor_ids)
    from t
   where e.id = t.id and e.id <> p_root;
end $$;

-- ---------------------------------------------------------------------------
-- 4. Aggregati: inizializzazione e cascata
-- ---------------------------------------------------------------------------

-- La riga di stats nasce insieme all'entità e incrementa il conteggio contenuti
-- di tutti gli antenati, così il trigger sul like resta una UPDATE pura.
create or replace function public.entities_init_stats()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.entity_stats (entity_id) values (new.id) on conflict do nothing;
  if cardinality(new.ancestor_ids) > 0 then
    update public.entity_stats
       set subtree_entities = subtree_entities + 1, updated_at = now()
     where entity_id = any (new.ancestor_ids);
  end if;
  return null;
end $$;

drop trigger if exists entities_init_stats on public.entities;
create trigger entities_init_stats
  after insert on public.entities
  for each row execute function public.entities_init_stats();

-- LA CASCATA. Il like vale 1 e non c'è smorzamento per livello, quindi
-- aggiornare tutti gli antenati è una sola UPDATE con "= any(...)".
create or replace function public.apply_like_delta(p_entity_id bigint, p_delta int)
returns void language plpgsql security definer set search_path = public as $$
declare v_anc bigint[];
begin
  select ancestor_ids into v_anc from public.entities where id = p_entity_id;
  if not found then return; end if;

  update public.entity_stats
     set direct_likes  = direct_likes  + p_delta,
         subtree_likes = subtree_likes + p_delta,
         updated_at    = now()
   where entity_id = p_entity_id;

  if cardinality(v_anc) > 0 then
    update public.entity_stats
       set subtree_likes = subtree_likes + p_delta, updated_at = now()
     where entity_id = any (v_anc);
  end if;
end $$;

-- security definer è necessario: entity_stats non ha policy di scrittura,
-- quindi un trigger eseguito come "authenticated" verrebbe bloccato dalla RLS.
create or replace function public.entity_likes_apply()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    perform public.apply_like_delta(new.entity_id, 1);
    return new;
  else
    perform public.apply_like_delta(old.entity_id, -1);
    return old;
  end if;
end $$;

drop trigger if exists entity_likes_apply on public.entity_likes;
create trigger entity_likes_apply
  after insert or delete on public.entity_likes
  for each row execute function public.entity_likes_apply();

-- Rete di sicurezza: ricalcola tutto da zero. Da eseguire dopo un re-parenting
-- o dopo una cancellazione hard di entità.
create or replace function public.recompute_all_stats()
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.entity_stats
     set direct_likes = 0, subtree_likes = 0, subtree_entities = 1;

  update public.entity_stats es
     set subtree_entities = 1 + coalesce(d.c, 0)
    from (
      select anc_id, count(*) as c
        from public.entities e
        cross join lateral unnest(e.ancestor_ids) as anc_id
       group by anc_id
    ) d
   where es.entity_id = d.anc_id;

  update public.entity_stats es
     set direct_likes = d.c, subtree_likes = d.c
    from (select entity_id, count(*) c from public.entity_likes group by 1) d
   where es.entity_id = d.entity_id;

  update public.entity_stats es
     set subtree_likes = es.subtree_likes + d.c
    from (
      select anc_id, count(*) as c
        from public.entity_likes l
        join public.entities e on e.id = l.entity_id
        cross join lateral unnest(e.ancestor_ids) as anc_id
       group by anc_id
    ) d
   where es.entity_id = d.anc_id;

  update public.entity_stats set updated_at = now();
end $$;

create or replace function public.entities_cascade_paths()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.rebuild_subtree_paths(new.id);
  perform public.recompute_all_stats();
  return null;
end $$;

-- Nessuna ricorsione infinita: rebuild_subtree_paths tocca solo ancestor_ids e
-- depth, mentre questo trigger reagisce a "update OF parent_id".
drop trigger if exists entities_cascade_paths on public.entities;
create trigger entities_cascade_paths
  after update of parent_id on public.entities
  for each row when (new.parent_id is distinct from old.parent_id)
  execute function public.entities_cascade_paths();

-- ---------------------------------------------------------------------------
-- 5. Pagina partner: creazione automatica alla conferma dell'email
-- ---------------------------------------------------------------------------

-- Agganciata alla CONFERMA e non all'inserimento in auth.users: agganciarla
-- alla registrazione permetterebbe di creare entità pubbliche con email finte.
create or replace function public.handle_partner_page()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_profile   public.profiles;
  v_region_id bigint;
begin
  if new.email_confirmed_at is null or old.email_confirmed_at is not null then
    return null;
  end if;

  select * into v_profile from public.profiles where id = new.id;
  if not found or v_profile.user_type <> 'partner' or v_profile.region_slug is null then
    return null;
  end if;

  select id into v_region_id
    from public.entities where ref = 'regione:' || v_profile.region_slug;
  if v_region_id is null then return null; end if;

  insert into public.entities (ref, kind, slug, name, parent_id, url_path, owner_id)
  values ('pagina:partner/' || new.id,
          'pagina',
          'partner-' || new.id,
          v_profile.full_name,
          v_region_id,
          v_profile.social_link,
          new.id)
  on conflict (ref) do nothing;

  return null;
end $$;

drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
  after update of email_confirmed_at on auth.users
  for each row execute function public.handle_partner_page();

-- ---------------------------------------------------------------------------
-- 6. Viste pubbliche
-- ---------------------------------------------------------------------------

-- security_invoker = on è OBBLIGATORIO: senza, la vista girerebbe con i
-- privilegi del proprietario scavalcando la RLS delle tabelle sottostanti
-- (è ciò che il linter Supabase segnala come security_definer_view).
create or replace view public.entity_rankings
with (security_invoker = on) as
with g as (
  select coalesce(sum(direct_likes), 0)::numeric as tot_likes,
         greatest(count(*), 1)::numeric          as tot_entities
    from public.entity_stats
)
select e.id as entity_id,
       e.ref,
       e.kind,
       e.slug,
       e.name,
       e.url_path,
       s.direct_likes,
       s.subtree_likes,
       s.subtree_entities,
       round(
         (s.subtree_likes + p.prior_weight * (g.tot_likes / g.tot_entities))
         / (s.subtree_entities + p.prior_weight)
       , 2) as indice_gradimento
  from public.entities e
  join public.entity_stats s on s.entity_id = e.id
 cross join public.rating_params p
 cross join g
 where p.id = 1 and e.is_active;

-- Evita di propagare gli id numerici al browser; la RLS su entity_likes la
-- restringe da sola ai like del chiamante.
create or replace view public.my_entity_likes
with (security_invoker = on) as
select e.ref, e.id as entity_id, l.created_at
  from public.entity_likes l
  join public.entities e on e.id = l.entity_id;

-- ---------------------------------------------------------------------------
-- 7. RLS
-- ---------------------------------------------------------------------------

alter table public.entities      enable row level security;
alter table public.entity_stats  enable row level security;
alter table public.entity_likes  enable row level security;
alter table public.rating_params enable row level security;

-- Contenuti e contatori sono pubblici: senza lettura anonima i numeri non
-- comparirebbero ai visitatori. Nessun dato personale è esposto qui.
-- Il "or owner_id = auth.uid()" non è un dettaglio: senza, un partner che
-- nasconde la propria pagina non riuscirebbe più a leggerla, e quindi nemmeno
-- a ripubblicarla.
drop policy if exists "Le entità sono pubbliche" on public.entities;
create policy "Le entità sono pubbliche"
  on public.entities for select to anon, authenticated
  using (is_active or owner_id = auth.uid());

drop policy if exists "Gli aggregati sono pubblici" on public.entity_stats;
create policy "Gli aggregati sono pubblici"
  on public.entity_stats for select to anon, authenticated using (true);

drop policy if exists "I parametri sono pubblici" on public.rating_params;
create policy "I parametri sono pubblici"
  on public.rating_params for select to anon, authenticated using (true);

-- Unica scrittura ammessa su entities: il partner disattiva la PROPRIA pagina.
drop policy if exists "Il partner gestisce la propria pagina" on public.entities;
create policy "Il partner gestisce la propria pagina"
  on public.entities for update to authenticated
  using      (kind = 'pagina' and owner_id = auth.uid())
  with check (kind = 'pagina' and owner_id = auth.uid());

-- I like sono privati: ognuno vede e gestisce solo i propri.
-- Il "with check" sull'insert è ciò che impedisce di votare a nome altrui.
drop policy if exists "Ognuno legge i propri like" on public.entity_likes;
create policy "Ognuno legge i propri like"
  on public.entity_likes for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Ognuno mette i propri like" on public.entity_likes;
create policy "Ognuno mette i propri like"
  on public.entity_likes for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Ognuno toglie i propri like" on public.entity_likes;
create policy "Ognuno toglie i propri like"
  on public.entity_likes for delete to authenticated
  using (auth.uid() = user_id);

grant select on public.entity_rankings to anon, authenticated;
grant select on public.my_entity_likes to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 8. Chiusura delle funzioni interne — NON RIMUOVERE
-- ---------------------------------------------------------------------------

-- Postgres concede EXECUTE a PUBLIC di default su ogni funzione, e PostgREST
-- espone come /rpc/<nome> ogni funzione dello schema public. Senza queste
-- revoche un anonimo potrebbe chiamare apply_like_delta(id, 999999) e
-- falsificare l'intera classifica con una singola richiesta HTTP.
-- I trigger continuano a funzionare: la revoca non riguarda l'invocazione da
-- parte del motore dei trigger.
revoke all on function public.apply_like_delta(bigint, int)  from public, anon, authenticated;
revoke all on function public.entity_likes_apply()           from public, anon, authenticated;
revoke all on function public.entities_set_path()            from public, anon, authenticated;
revoke all on function public.entities_init_stats()          from public, anon, authenticated;
revoke all on function public.entities_cascade_paths()       from public, anon, authenticated;
revoke all on function public.rebuild_subtree_paths(bigint)  from public, anon, authenticated;
revoke all on function public.recompute_all_stats()          from public, anon, authenticated;
revoke all on function public.handle_partner_page()          from public, anon, authenticated;
