-- Places of Italy — schema per la registrazione utenti.
-- Da eseguire una volta nell'SQL editor del progetto Supabase.

create type public.user_type as enum ('viaggiatore', 'partner');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  user_type public.user_type not null,
  full_name text not null,
  region_slug text,
  social_link text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Gli utenti leggono il proprio profilo"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Gli utenti aggiornano il proprio profilo"
  on public.profiles for update
  using (auth.uid() = id);

-- Crea automaticamente il profilo quando un utente completa la registrazione,
-- leggendo i dati passati come user metadata da supabase.auth.signUp().
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, user_type, full_name, region_slug, social_link)
  values (
    new.id,
    (new.raw_user_meta_data ->> 'user_type')::public.user_type,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'region_slug',
    new.raw_user_meta_data ->> 'social_link'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
