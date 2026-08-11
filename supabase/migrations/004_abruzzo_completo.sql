-- Places of Italy — popola per intero la gerarchia dell'Abruzzo: le 4
-- province reali (L'Aquila, Teramo, Pescara, Chieti) e tutti i 305 comuni
-- abruzzesi, con provincia e comune corretti secondo l'elenco ufficiale
-- (fonte: dataset ISTAT via github.com/matteocontrini/comuni-json, conteggi
-- verificati: 108 L'Aquila + 104 Chieti + 47 Teramo + 46 Pescara = 305).
-- Da eseguire DOPO 001, 002 e 003.
--
-- Resta un rollout a una sola regione, non l'importazione nazionale
-- completa (~7900 comuni): serve a collaudare pagine reali /abruzzo/<provincia>
-- e /abruzzo/<provincia>/<comune> con dati veri, prima di estendere le altre
-- 19 regioni con lo stesso schema.
--
-- Cambio di convenzione sui ref dei comuni: da qui in avanti
-- 'comune:<provincia-slug>/<comune-slug>' invece del semplice
-- 'comune:<slug>' usato in 003 per il solo capoluogo campione. È necessario
-- perché due comuni di province diverse possono avere lo stesso nome, mentre
-- il nome è unico per legge all'interno della stessa provincia. Le regioni
-- diverse da Abruzzo restano temporaneamente sullo schema vecchio
-- ('comune:<slug>', un solo comune campione ciascuna): andranno riallineate
-- allo stesso schema quando si estenderà l'importazione.
--
-- Idempotente: rieseguirlo non produce errori né duplicati.

do $$ begin
  if to_regclass('public.entities') is null then
    raise exception
      'Esegui prima supabase/migrations/001_rating_schema.sql: la tabella public.entities non esiste.';
  end if;
  if not exists (select 1 from public.entities where ref = 'regione:abruzzo') then
    raise exception
      'Esegui prima supabase/migrations/002_seed_entities.sql: la regione Abruzzo non esiste.';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 1. Le 4 province reali dell'Abruzzo
-- ---------------------------------------------------------------------------
-- 'provincia:l-aquila' esiste già da 003 (era il capoluogo di regione
-- campione): qui riceve anche url_path, restando la stessa riga/id.

insert into public.entities (ref, kind, slug, name, parent_id, url_path)
select 'provincia:' || v.slug, 'provincia', v.slug, 'Provincia di ' || v.name, r.id,
       '/abruzzo/' || v.slug
  from (values
    ('l-aquila', 'L''Aquila'),
    ('teramo',   'Teramo'),
    ('pescara',  'Pescara'),
    ('chieti',   'Chieti')
  ) as v(slug, name)
  join public.entities r on r.ref = 'regione:abruzzo'
on conflict (ref) do update
  set name      = excluded.name,
      parent_id = excluded.parent_id,
      url_path  = excluded.url_path,
      is_active = true;

-- ---------------------------------------------------------------------------
-- 2. Migrazione del comune campione al nuovo schema di ref
-- ---------------------------------------------------------------------------
-- Rinomina la riga esistente PRIMA del bulk upsert, così l'upsert sottostante
-- la aggiorna invece di crearne una seconda: stessa entità, stesso id, niente
-- like o pagine influencer già agganciate perse nel passaggio.

update public.entities set ref = 'comune:l-aquila/l-aquila' where ref = 'comune:l-aquila';

-- ---------------------------------------------------------------------------
-- 3. Tutti i 305 comuni abruzzesi
-- ---------------------------------------------------------------------------

insert into public.entities (ref, kind, slug, name, parent_id, url_path)
select 'comune:' || v.provincia_slug || '/' || v.slug, 'comune', v.slug, v.name, p.id,
       '/abruzzo/' || v.provincia_slug || '/' || v.slug
  from (values
    ('chieti', 'altino', 'Altino'),
    ('chieti', 'archi', 'Archi'),
    ('chieti', 'ari', 'Ari'),
    ('chieti', 'arielli', 'Arielli'),
    ('chieti', 'atessa', 'Atessa'),
    ('chieti', 'bomba', 'Bomba'),
    ('chieti', 'borrello', 'Borrello'),
    ('chieti', 'bucchianico', 'Bucchianico'),
    ('chieti', 'canosa-sannita', 'Canosa Sannita'),
    ('chieti', 'carpineto-sinello', 'Carpineto Sinello'),
    ('chieti', 'carunchio', 'Carunchio'),
    ('chieti', 'casacanditella', 'Casacanditella'),
    ('chieti', 'casalanguida', 'Casalanguida'),
    ('chieti', 'casalbordino', 'Casalbordino'),
    ('chieti', 'casalincontrada', 'Casalincontrada'),
    ('chieti', 'casoli', 'Casoli'),
    ('chieti', 'castel-frentano', 'Castel Frentano'),
    ('chieti', 'castelguidone', 'Castelguidone'),
    ('chieti', 'castiglione-messer-marino', 'Castiglione Messer Marino'),
    ('chieti', 'celenza-sul-trigno', 'Celenza sul Trigno'),
    ('chieti', 'chieti', 'Chieti'),
    ('chieti', 'civitaluparella', 'Civitaluparella'),
    ('chieti', 'civitella-messer-raimondo', 'Civitella Messer Raimondo'),
    ('chieti', 'colledimacine', 'Colledimacine'),
    ('chieti', 'colledimezzo', 'Colledimezzo'),
    ('chieti', 'crecchio', 'Crecchio'),
    ('chieti', 'cupello', 'Cupello'),
    ('chieti', 'dogliola', 'Dogliola'),
    ('chieti', 'fallo', 'Fallo'),
    ('chieti', 'fara-filiorum-petri', 'Fara Filiorum Petri'),
    ('chieti', 'fara-san-martino', 'Fara San Martino'),
    ('chieti', 'filetto', 'Filetto'),
    ('chieti', 'fossacesia', 'Fossacesia'),
    ('chieti', 'fraine', 'Fraine'),
    ('chieti', 'francavilla-al-mare', 'Francavilla al Mare'),
    ('chieti', 'fresagrandinaria', 'Fresagrandinaria'),
    ('chieti', 'frisa', 'Frisa'),
    ('chieti', 'furci', 'Furci'),
    ('chieti', 'gamberale', 'Gamberale'),
    ('chieti', 'gessopalena', 'Gessopalena'),
    ('chieti', 'gissi', 'Gissi'),
    ('chieti', 'giuliano-teatino', 'Giuliano Teatino'),
    ('chieti', 'guardiagrele', 'Guardiagrele'),
    ('chieti', 'guilmi', 'Guilmi'),
    ('chieti', 'lama-dei-peligni', 'Lama dei Peligni'),
    ('chieti', 'lanciano', 'Lanciano'),
    ('chieti', 'lentella', 'Lentella'),
    ('chieti', 'lettopalena', 'Lettopalena'),
    ('chieti', 'liscia', 'Liscia'),
    ('chieti', 'miglianico', 'Miglianico'),
    ('chieti', 'montazzoli', 'Montazzoli'),
    ('chieti', 'montebello-sul-sangro', 'Montebello sul Sangro'),
    ('chieti', 'monteferrante', 'Monteferrante'),
    ('chieti', 'montelapiano', 'Montelapiano'),
    ('chieti', 'montenerodomo', 'Montenerodomo'),
    ('chieti', 'monteodorisio', 'Monteodorisio'),
    ('chieti', 'mozzagrogna', 'Mozzagrogna'),
    ('chieti', 'orsogna', 'Orsogna'),
    ('chieti', 'ortona', 'Ortona'),
    ('chieti', 'paglieta', 'Paglieta'),
    ('chieti', 'palena', 'Palena'),
    ('chieti', 'palmoli', 'Palmoli'),
    ('chieti', 'palombaro', 'Palombaro'),
    ('chieti', 'pennadomo', 'Pennadomo'),
    ('chieti', 'pennapiedimonte', 'Pennapiedimonte'),
    ('chieti', 'perano', 'Perano'),
    ('chieti', 'pietraferrazzana', 'Pietraferrazzana'),
    ('chieti', 'pizzoferrato', 'Pizzoferrato'),
    ('chieti', 'poggiofiorito', 'Poggiofiorito'),
    ('chieti', 'pollutri', 'Pollutri'),
    ('chieti', 'pretoro', 'Pretoro'),
    ('chieti', 'quadri', 'Quadri'),
    ('chieti', 'rapino', 'Rapino'),
    ('chieti', 'ripa-teatina', 'Ripa Teatina'),
    ('chieti', 'rocca-san-giovanni', 'Rocca San Giovanni'),
    ('chieti', 'roccamontepiano', 'Roccamontepiano'),
    ('chieti', 'roccascalegna', 'Roccascalegna'),
    ('chieti', 'roccaspinalveti', 'Roccaspinalveti'),
    ('chieti', 'roio-del-sangro', 'Roio del Sangro'),
    ('chieti', 'rosello', 'Rosello'),
    ('chieti', 'san-buono', 'San Buono'),
    ('chieti', 'san-giovanni-lipioni', 'San Giovanni Lipioni'),
    ('chieti', 'san-giovanni-teatino', 'San Giovanni Teatino'),
    ('chieti', 'san-martino-sulla-marrucina', 'San Martino sulla Marrucina'),
    ('chieti', 'san-salvo', 'San Salvo'),
    ('chieti', 'san-vito-chietino', 'San Vito Chietino'),
    ('chieti', 'sant-eusanio-del-sangro', 'Sant''Eusanio del Sangro'),
    ('chieti', 'santa-maria-imbaro', 'Santa Maria Imbaro'),
    ('chieti', 'scerni', 'Scerni'),
    ('chieti', 'schiavi-di-abruzzo', 'Schiavi di Abruzzo'),
    ('chieti', 'taranta-peligna', 'Taranta Peligna'),
    ('chieti', 'tollo', 'Tollo'),
    ('chieti', 'torino-di-sangro', 'Torino di Sangro'),
    ('chieti', 'tornareccio', 'Tornareccio'),
    ('chieti', 'torrebruna', 'Torrebruna'),
    ('chieti', 'torrevecchia-teatina', 'Torrevecchia Teatina'),
    ('chieti', 'torricella-peligna', 'Torricella Peligna'),
    ('chieti', 'treglio', 'Treglio'),
    ('chieti', 'tufillo', 'Tufillo'),
    ('chieti', 'vacri', 'Vacri'),
    ('chieti', 'vasto', 'Vasto'),
    ('chieti', 'villa-santa-maria', 'Villa Santa Maria'),
    ('chieti', 'villalfonsina', 'Villalfonsina'),
    ('chieti', 'villamagna', 'Villamagna'),
    ('l-aquila', 'acciano', 'Acciano'),
    ('l-aquila', 'aielli', 'Aielli'),
    ('l-aquila', 'alfedena', 'Alfedena'),
    ('l-aquila', 'anversa-degli-abruzzi', 'Anversa degli Abruzzi'),
    ('l-aquila', 'ateleta', 'Ateleta'),
    ('l-aquila', 'avezzano', 'Avezzano'),
    ('l-aquila', 'balsorano', 'Balsorano'),
    ('l-aquila', 'barete', 'Barete'),
    ('l-aquila', 'barisciano', 'Barisciano'),
    ('l-aquila', 'barrea', 'Barrea'),
    ('l-aquila', 'bisegna', 'Bisegna'),
    ('l-aquila', 'bugnara', 'Bugnara'),
    ('l-aquila', 'cagnano-amiterno', 'Cagnano Amiterno'),
    ('l-aquila', 'calascio', 'Calascio'),
    ('l-aquila', 'campo-di-giove', 'Campo di Giove'),
    ('l-aquila', 'campotosto', 'Campotosto'),
    ('l-aquila', 'canistro', 'Canistro'),
    ('l-aquila', 'cansano', 'Cansano'),
    ('l-aquila', 'capestrano', 'Capestrano'),
    ('l-aquila', 'capistrello', 'Capistrello'),
    ('l-aquila', 'capitignano', 'Capitignano'),
    ('l-aquila', 'caporciano', 'Caporciano'),
    ('l-aquila', 'cappadocia', 'Cappadocia'),
    ('l-aquila', 'carapelle-calvisio', 'Carapelle Calvisio'),
    ('l-aquila', 'carsoli', 'Carsoli'),
    ('l-aquila', 'castel-del-monte', 'Castel del Monte'),
    ('l-aquila', 'castel-di-ieri', 'Castel di Ieri'),
    ('l-aquila', 'castel-di-sangro', 'Castel di Sangro'),
    ('l-aquila', 'castellafiume', 'Castellafiume'),
    ('l-aquila', 'castelvecchio-calvisio', 'Castelvecchio Calvisio'),
    ('l-aquila', 'castelvecchio-subequo', 'Castelvecchio Subequo'),
    ('l-aquila', 'celano', 'Celano'),
    ('l-aquila', 'cerchio', 'Cerchio'),
    ('l-aquila', 'civita-d-antino', 'Civita d''Antino'),
    ('l-aquila', 'civitella-alfedena', 'Civitella Alfedena'),
    ('l-aquila', 'civitella-roveto', 'Civitella Roveto'),
    ('l-aquila', 'cocullo', 'Cocullo'),
    ('l-aquila', 'collarmele', 'Collarmele'),
    ('l-aquila', 'collelongo', 'Collelongo'),
    ('l-aquila', 'collepietro', 'Collepietro'),
    ('l-aquila', 'corfinio', 'Corfinio'),
    ('l-aquila', 'fagnano-alto', 'Fagnano Alto'),
    ('l-aquila', 'fontecchio', 'Fontecchio'),
    ('l-aquila', 'fossa', 'Fossa'),
    ('l-aquila', 'gagliano-aterno', 'Gagliano Aterno'),
    ('l-aquila', 'gioia-dei-marsi', 'Gioia dei Marsi'),
    ('l-aquila', 'goriano-sicoli', 'Goriano Sicoli'),
    ('l-aquila', 'introdacqua', 'Introdacqua'),
    ('l-aquila', 'l-aquila', 'L''Aquila'),
    ('l-aquila', 'lecce-nei-marsi', 'Lecce nei Marsi'),
    ('l-aquila', 'luco-dei-marsi', 'Luco dei Marsi'),
    ('l-aquila', 'lucoli', 'Lucoli'),
    ('l-aquila', 'magliano-de-marsi', 'Magliano de'' Marsi'),
    ('l-aquila', 'massa-d-albe', 'Massa d''Albe'),
    ('l-aquila', 'molina-aterno', 'Molina Aterno'),
    ('l-aquila', 'montereale', 'Montereale'),
    ('l-aquila', 'morino', 'Morino'),
    ('l-aquila', 'navelli', 'Navelli'),
    ('l-aquila', 'ocre', 'Ocre'),
    ('l-aquila', 'ofena', 'Ofena'),
    ('l-aquila', 'opi', 'Opi'),
    ('l-aquila', 'oricola', 'Oricola'),
    ('l-aquila', 'ortona-dei-marsi', 'Ortona dei Marsi'),
    ('l-aquila', 'ortucchio', 'Ortucchio'),
    ('l-aquila', 'ovindoli', 'Ovindoli'),
    ('l-aquila', 'pacentro', 'Pacentro'),
    ('l-aquila', 'pereto', 'Pereto'),
    ('l-aquila', 'pescasseroli', 'Pescasseroli'),
    ('l-aquila', 'pescina', 'Pescina'),
    ('l-aquila', 'pescocostanzo', 'Pescocostanzo'),
    ('l-aquila', 'pettorano-sul-gizio', 'Pettorano sul Gizio'),
    ('l-aquila', 'pizzoli', 'Pizzoli'),
    ('l-aquila', 'poggio-picenze', 'Poggio Picenze'),
    ('l-aquila', 'prata-d-ansidonia', 'Prata d''Ansidonia'),
    ('l-aquila', 'pratola-peligna', 'Pratola Peligna'),
    ('l-aquila', 'prezza', 'Prezza'),
    ('l-aquila', 'raiano', 'Raiano'),
    ('l-aquila', 'rivisondoli', 'Rivisondoli'),
    ('l-aquila', 'rocca-pia', 'Rocca Pia'),
    ('l-aquila', 'rocca-di-botte', 'Rocca di Botte'),
    ('l-aquila', 'rocca-di-cambio', 'Rocca di Cambio'),
    ('l-aquila', 'rocca-di-mezzo', 'Rocca di Mezzo'),
    ('l-aquila', 'roccacasale', 'Roccacasale'),
    ('l-aquila', 'roccaraso', 'Roccaraso'),
    ('l-aquila', 'san-benedetto-dei-marsi', 'San Benedetto dei Marsi'),
    ('l-aquila', 'san-benedetto-in-perillis', 'San Benedetto in Perillis'),
    ('l-aquila', 'san-demetrio-ne-vestini', 'San Demetrio ne'' Vestini'),
    ('l-aquila', 'san-pio-delle-camere', 'San Pio delle Camere'),
    ('l-aquila', 'san-vincenzo-valle-roveto', 'San Vincenzo Valle Roveto'),
    ('l-aquila', 'sant-eusanio-forconese', 'Sant''Eusanio Forconese'),
    ('l-aquila', 'sante-marie', 'Sante Marie'),
    ('l-aquila', 'santo-stefano-di-sessanio', 'Santo Stefano di Sessanio'),
    ('l-aquila', 'scanno', 'Scanno'),
    ('l-aquila', 'scontrone', 'Scontrone'),
    ('l-aquila', 'scoppito', 'Scoppito'),
    ('l-aquila', 'scurcola-marsicana', 'Scurcola Marsicana'),
    ('l-aquila', 'secinaro', 'Secinaro'),
    ('l-aquila', 'sulmona', 'Sulmona'),
    ('l-aquila', 'tagliacozzo', 'Tagliacozzo'),
    ('l-aquila', 'tione-degli-abruzzi', 'Tione degli Abruzzi'),
    ('l-aquila', 'tornimparte', 'Tornimparte'),
    ('l-aquila', 'trasacco', 'Trasacco'),
    ('l-aquila', 'villa-sant-angelo', 'Villa Sant''Angelo'),
    ('l-aquila', 'villa-santa-lucia-degli-abruzzi', 'Villa Santa Lucia degli Abruzzi'),
    ('l-aquila', 'villalago', 'Villalago'),
    ('l-aquila', 'villavallelonga', 'Villavallelonga'),
    ('l-aquila', 'villetta-barrea', 'Villetta Barrea'),
    ('l-aquila', 'vittorito', 'Vittorito'),
    ('pescara', 'abbateggio', 'Abbateggio'),
    ('pescara', 'alanno', 'Alanno'),
    ('pescara', 'bolognano', 'Bolognano'),
    ('pescara', 'brittoli', 'Brittoli'),
    ('pescara', 'bussi-sul-tirino', 'Bussi sul Tirino'),
    ('pescara', 'cappelle-sul-tavo', 'Cappelle sul Tavo'),
    ('pescara', 'caramanico-terme', 'Caramanico Terme'),
    ('pescara', 'carpineto-della-nora', 'Carpineto della Nora'),
    ('pescara', 'castiglione-a-casauria', 'Castiglione a Casauria'),
    ('pescara', 'catignano', 'Catignano'),
    ('pescara', 'cepagatti', 'Cepagatti'),
    ('pescara', 'citta-sant-angelo', 'Città Sant''Angelo'),
    ('pescara', 'civitaquana', 'Civitaquana'),
    ('pescara', 'civitella-casanova', 'Civitella Casanova'),
    ('pescara', 'collecorvino', 'Collecorvino'),
    ('pescara', 'corvara', 'Corvara'),
    ('pescara', 'cugnoli', 'Cugnoli'),
    ('pescara', 'elice', 'Elice'),
    ('pescara', 'farindola', 'Farindola'),
    ('pescara', 'lettomanoppello', 'Lettomanoppello'),
    ('pescara', 'loreto-aprutino', 'Loreto Aprutino'),
    ('pescara', 'manoppello', 'Manoppello'),
    ('pescara', 'montebello-di-bertona', 'Montebello di Bertona'),
    ('pescara', 'montesilvano', 'Montesilvano'),
    ('pescara', 'moscufo', 'Moscufo'),
    ('pescara', 'nocciano', 'Nocciano'),
    ('pescara', 'penne', 'Penne'),
    ('pescara', 'pescara', 'Pescara'),
    ('pescara', 'pescosansonesco', 'Pescosansonesco'),
    ('pescara', 'pianella', 'Pianella'),
    ('pescara', 'picciano', 'Picciano'),
    ('pescara', 'pietranico', 'Pietranico'),
    ('pescara', 'popoli', 'Popoli'),
    ('pescara', 'roccamorice', 'Roccamorice'),
    ('pescara', 'rosciano', 'Rosciano'),
    ('pescara', 'salle', 'Salle'),
    ('pescara', 'san-valentino-in-abruzzo-citeriore', 'San Valentino in Abruzzo Citeriore'),
    ('pescara', 'sant-eufemia-a-maiella', 'Sant''Eufemia a Maiella'),
    ('pescara', 'scafa', 'Scafa'),
    ('pescara', 'serramonacesca', 'Serramonacesca'),
    ('pescara', 'spoltore', 'Spoltore'),
    ('pescara', 'tocco-da-casauria', 'Tocco da Casauria'),
    ('pescara', 'torre-de-passeri', 'Torre de'' Passeri'),
    ('pescara', 'turrivalignani', 'Turrivalignani'),
    ('pescara', 'vicoli', 'Vicoli'),
    ('pescara', 'villa-celiera', 'Villa Celiera'),
    ('teramo', 'alba-adriatica', 'Alba Adriatica'),
    ('teramo', 'ancarano', 'Ancarano'),
    ('teramo', 'arsita', 'Arsita'),
    ('teramo', 'atri', 'Atri'),
    ('teramo', 'basciano', 'Basciano'),
    ('teramo', 'bellante', 'Bellante'),
    ('teramo', 'bisenti', 'Bisenti'),
    ('teramo', 'campli', 'Campli'),
    ('teramo', 'canzano', 'Canzano'),
    ('teramo', 'castel-castagna', 'Castel Castagna'),
    ('teramo', 'castellalto', 'Castellalto'),
    ('teramo', 'castelli', 'Castelli'),
    ('teramo', 'castiglione-messer-raimondo', 'Castiglione Messer Raimondo'),
    ('teramo', 'castilenti', 'Castilenti'),
    ('teramo', 'cellino-attanasio', 'Cellino Attanasio'),
    ('teramo', 'cermignano', 'Cermignano'),
    ('teramo', 'civitella-del-tronto', 'Civitella del Tronto'),
    ('teramo', 'colledara', 'Colledara'),
    ('teramo', 'colonnella', 'Colonnella'),
    ('teramo', 'controguerra', 'Controguerra'),
    ('teramo', 'corropoli', 'Corropoli'),
    ('teramo', 'cortino', 'Cortino'),
    ('teramo', 'crognaleto', 'Crognaleto'),
    ('teramo', 'fano-adriano', 'Fano Adriano'),
    ('teramo', 'giulianova', 'Giulianova'),
    ('teramo', 'isola-del-gran-sasso-d-italia', 'Isola del Gran Sasso d''Italia'),
    ('teramo', 'martinsicuro', 'Martinsicuro'),
    ('teramo', 'montefino', 'Montefino'),
    ('teramo', 'montorio-al-vomano', 'Montorio al Vomano'),
    ('teramo', 'morro-d-oro', 'Morro d''Oro'),
    ('teramo', 'mosciano-sant-angelo', 'Mosciano Sant''Angelo'),
    ('teramo', 'nereto', 'Nereto'),
    ('teramo', 'notaresco', 'Notaresco'),
    ('teramo', 'penna-sant-andrea', 'Penna Sant''Andrea'),
    ('teramo', 'pietracamela', 'Pietracamela'),
    ('teramo', 'pineto', 'Pineto'),
    ('teramo', 'rocca-santa-maria', 'Rocca Santa Maria'),
    ('teramo', 'roseto-degli-abruzzi', 'Roseto degli Abruzzi'),
    ('teramo', 'sant-egidio-alla-vibrata', 'Sant''Egidio alla Vibrata'),
    ('teramo', 'sant-omero', 'Sant''Omero'),
    ('teramo', 'silvi', 'Silvi'),
    ('teramo', 'teramo', 'Teramo'),
    ('teramo', 'torano-nuovo', 'Torano Nuovo'),
    ('teramo', 'torricella-sicura', 'Torricella Sicura'),
    ('teramo', 'tortoreto', 'Tortoreto'),
    ('teramo', 'tossicia', 'Tossicia'),
    ('teramo', 'valle-castellana', 'Valle Castellana')
  ) as v(provincia_slug, slug, name)
  join public.entities p on p.ref = 'provincia:' || v.provincia_slug
on conflict (ref) do update
  set name      = excluded.name,
      parent_id = excluded.parent_id,
      url_path  = excluded.url_path,
      is_active = true;

-- ---------------------------------------------------------------------------
-- 4. Pagina influencer: comune ora richiede provincia_slug + comune_slug
-- ---------------------------------------------------------------------------
-- Il ref del comune non è più derivabile dal solo comune_slug (v. punto 1):
-- serve anche la provincia scelta dal partner in fase di iscrizione.

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

  if v_profile.comune_slug is not null and v_profile.provincia_slug is not null then
    select id into v_parent_id from public.entities
      where ref = 'comune:' || v_profile.provincia_slug || '/' || v_profile.comune_slug;
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
-- 5. Riallineamento aggregati e marcatore di completamento
-- ---------------------------------------------------------------------------

do $$ begin
  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where p.proname = 'recompute_all_stats' and n.nspname = 'public'
  ) then
    perform public.recompute_all_stats();
  end if;
end $$;

select 'Migration 004 completata: 4 province e 305 comuni abruzzesi inseriti.' as esito;
