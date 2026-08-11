-- Reset del sistema di like: da eseguire SOLO per ripartire da zero.
-- Non tocca public.profiles, auth.users o il resto di schema.sql: rimuove
-- esclusivamente gli oggetti creati da 001_rating_schema.sql e
-- 002_seed_entities.sql. Sicuro anche se questi oggetti non esistono ancora
-- (tutto if exists / cascade).
--
-- ATTENZIONE: cancella anche tutti i like raccolti finora.
--
-- Dopo questo script, ripartire da migrations/001_rating_schema.sql.

-- Il trigger va rimosso per primo: la funzione che chiama non si può
-- cancellare finché un trigger la referenzia ancora.
drop trigger if exists on_auth_user_confirmed on auth.users;

drop view if exists public.entity_rankings;
drop view if exists public.my_entity_likes;

drop table if exists public.entity_likes  cascade;
drop table if exists public.entity_stats  cascade;
drop table if exists public.rating_params cascade;
drop table if exists public.entities      cascade;

drop function if exists public.apply_like_delta(bigint, int);
drop function if exists public.entity_likes_apply();
drop function if exists public.entities_set_path();
drop function if exists public.entities_init_stats();
drop function if exists public.entities_cascade_paths();
drop function if exists public.rebuild_subtree_paths(bigint);
drop function if exists public.recompute_all_stats();
drop function if exists public.handle_partner_page();

-- Il tipo va cancellato per ultimo: finché una tabella usa entity_kind come
-- tipo di colonna, il tipo non si può rimuovere.
drop type if exists public.entity_kind;

select 'Reset completato: nessun oggetto del sistema like rimasto.' as esito;
