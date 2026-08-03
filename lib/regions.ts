import type { SceneKind, Landmark } from "@/components/RegionScene";

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

export interface RegionVisual {
  kind: SceneKind;
  landmark?: Landmark;
  water?: boolean;
}

export interface Region {
  slug: string;
  name: string;
  capital: string;
  tagline: string;
  description: string;
  highlights: string[];
  gradient: [string, string];
  visual: RegionVisual;
  social?: SocialLinks;
}

export const regions: Region[] = [
  {
    slug: "abruzzo",
    name: "Abruzzo",
    capital: "L'Aquila",
    tagline: "Montagne selvagge, parchi nazionali e una costa d'altri tempi",
    description:
      "L'Abruzzo è la regione più verde d'Europa: tre parchi nazionali, il massiccio del Gran Sasso e la Costa dei Trabocchi convivono a pochi chilometri di distanza. Un territorio ideale per chi cerca natura autentica, borghi di montagna e tradizioni ancora vive.",
    highlights: ["Gran Sasso e Monti della Laga", "Parco Nazionale d'Abruzzo", "Costa dei Trabocchi", "Scanno e Sulmona"],
    gradient: ["#0b6e4f", "#06402b"],
    visual: { kind: "mountain" },
  },
  {
    slug: "basilicata",
    name: "Basilicata",
    capital: "Potenza",
    tagline: "I Sassi di Matera e le Dolomiti Lucane",
    description:
      "Terra sospesa tra due mari, la Basilicata custodisce Matera, patrimonio UNESCO e Capitale della Cultura, insieme a paesaggi lunari, le vette delle Dolomiti Lucane e il litorale di Maratea.",
    highlights: ["Sassi di Matera", "Maratea e la costa tirrenica", "Dolomiti Lucane e il volo dell'angelo", "Parco del Pollino"],
    gradient: ["#b08968", "#6b4423"],
    visual: { kind: "hills", landmark: "sassi" },
  },
  {
    slug: "calabria",
    name: "Calabria",
    capital: "Catanzaro",
    tagline: "Due mari, l'Aspromonte e borghi sospesi sulla costa",
    description:
      "Bagnata dal Tirreno e dallo Ionio, la Calabria alterna spiagge da cartolina come Tropea a montagne selvagge come la Sila e l'Aspromonte, in una regione ancora poco esplorata dal turismo di massa.",
    highlights: ["Tropea e Capo Vaticano", "Costa degli Dei", "Parco Nazionale della Sila", "Aspromonte"],
    gradient: ["#1d4e89", "#0b2545"],
    visual: { kind: "coast" },
  },
  {
    slug: "campania",
    name: "Campania",
    capital: "Napoli",
    tagline: "Napoli, la Costiera Amalfitana e Pompei",
    description:
      "Poche regioni al mondo racchiudono tanta bellezza in così poco spazio: Napoli, il Vesuvio, gli scavi di Pompei, Capri e la Costiera Amalfitana fanno della Campania una delle mete più amate d'Italia.",
    highlights: ["Costiera Amalfitana", "Capri e Ischia", "Pompei ed Ercolano", "Napoli e il Vesuvio"],
    gradient: ["#c1440e", "#7a1f0a"],
    visual: { kind: "coast", landmark: "campanile" },
  },
  {
    slug: "emilia-romagna",
    name: "Emilia-Romagna",
    capital: "Bologna",
    tagline: "Motori, food valley e la riviera romagnola",
    description:
      "Tra Bologna, Parma e Modena si concentra la food valley italiana; sulla costa adriatica, la Riviera Romagnola resta una delle mete balneari più amate dagli italiani, senza dimenticare il mito dei motori di Maranello.",
    highlights: ["Bologna e Parma", "Riviera Romagnola", "Food Valley (Parmigiano, Aceto Balsamico)", "Motor Valley di Maranello"],
    gradient: ["#7b2d26", "#4a1a15"],
    visual: { kind: "city", landmark: "towers" },
  },
  {
    slug: "friuli-venezia-giulia",
    name: "Friuli-Venezia Giulia",
    capital: "Trieste",
    tagline: "Trieste, le Dolomiti Friulane e i vini di confine",
    description:
      "Regione di confine tra Mediterraneo e mondo mitteleuropeo, il Friuli-Venezia Giulia offre Trieste affacciata sul golfo, le Dolomiti Friulane patrimonio UNESCO e alcune delle cantine più apprezzate d'Italia.",
    highlights: ["Trieste e il Golfo", "Dolomiti Friulane", "Aquileia e Grado", "Strada del vino Collio"],
    gradient: ["#0f6674", "#073b42"],
    visual: { kind: "coast" },
  },
  {
    slug: "lazio",
    name: "Lazio",
    capital: "Roma",
    tagline: "Roma, i Castelli Romani e la costa laziale",
    description:
      "Il Lazio è dominato da Roma, capitale d'Italia e museo a cielo aperto, ma riserva sorprese anche fuori città: i Castelli Romani, le rovine di Ostia Antica e le terme di Tivoli.",
    highlights: ["Roma e il Colosseo", "Villa d'Este e Villa Adriana a Tivoli", "Castelli Romani", "Ostia Antica"],
    gradient: ["#d98324", "#a35709"],
    visual: { kind: "city", landmark: "colosseum" },
  },
  {
    slug: "liguria",
    name: "Liguria",
    capital: "Genova",
    tagline: "Cinque Terre, Portofino e la riviera ligure",
    description:
      "Stretta tra mare e montagna, la Liguria è celebre per i borghi colorati delle Cinque Terre, il fascino esclusivo di Portofino e i caruggi di Genova, capitale della cultura marinara italiana.",
    highlights: ["Cinque Terre", "Portofino e il Golfo del Tigullio", "Genova e il porto antico", "Sanremo e la riviera dei fiori"],
    gradient: ["#2e8b57", "#145a32"],
    visual: { kind: "coast", landmark: "terraces" },
  },
  {
    slug: "lombardia",
    name: "Lombardia",
    capital: "Milano",
    tagline: "Milano, i grandi laghi e le Alpi lombarde",
    description:
      "Cuore economico d'Italia, la Lombardia unisce la modernità di Milano ai paesaggi da sogno del Lago di Como e del Lago di Garda, fino alle vette delle Alpi Orobie e della Valtellina.",
    highlights: ["Milano", "Lago di Como", "Lago di Garda", "Valtellina e Alpi Orobie"],
    gradient: ["#1d4e89", "#0b2545"],
    visual: { kind: "lake" },
  },
  {
    slug: "marche",
    name: "Marche",
    capital: "Ancona",
    tagline: "Urbino, il Conero e borghi collinari",
    description:
      "Terra di mezzo tra Appennino e Adriatico, le Marche custodiscono Urbino patrimonio UNESCO, la costa selvaggia del Conero e decine di borghi collinari ancora fuori dai grandi flussi turistici.",
    highlights: ["Urbino", "Riviera del Conero", "Ascoli Piceno", "Grotte di Frasassi"],
    gradient: ["#d98324", "#a35709"],
    visual: { kind: "coast", landmark: "hilltown" },
  },
  {
    slug: "molise",
    name: "Molise",
    capital: "Campobasso",
    tagline: "La regione che non esiste (e che vale la pena scoprire)",
    description:
      "Piccola e meno conosciuta, il Molise è una regione autentica fatta di tratturi, borghi silenziosi e la costa adriatica di Termoli, perfetta per chi cerca un turismo lontano dalla folla.",
    highlights: ["Termoli e il borgo vecchio", "Tratturi e parchi naturali", "Isernia e i siti archeologici", "Riserva di Montedimezzo"],
    gradient: ["#0b6e4f", "#06402b"],
    visual: { kind: "hills" },
  },
  {
    slug: "piemonte",
    name: "Piemonte",
    capital: "Torino",
    tagline: "Torino, le Langhe e le Alpi piemontesi",
    description:
      "Eleganza sabauda, colline patrimonio UNESCO e grandi vette alpine: il Piemonte è la casa del Barolo, delle Langhe e di Torino, prima capitale d'Italia.",
    highlights: ["Torino", "Langhe, Roero e Monferrato", "Alpi e Monviso", "Lago Maggiore e Lago d'Orta"],
    gradient: ["#7b2d26", "#4a1a15"],
    visual: { kind: "mountain" },
  },
  {
    slug: "puglia",
    name: "Puglia",
    capital: "Bari",
    tagline: "Trulli, Salento e un mare da cartolina",
    description:
      "Dai trulli di Alberobello al barocco di Lecce, dalle spiagge del Salento a Ostuni la città bianca, la Puglia è oggi una delle mete più desiderate d'Italia per mare, cibo e ospitalità.",
    highlights: ["Alberobello e i trulli", "Salento e Lecce", "Ostuni, la città bianca", "Polignano a Mare"],
    gradient: ["#0f6674", "#073b42"],
    visual: { kind: "coast", landmark: "trulli" },
  },
  {
    slug: "sardegna",
    name: "Sardegna",
    capital: "Cagliari",
    tagline: "Mare cristallino, nuraghi e la Costa Smeralda",
    description:
      "Isola nell'isola, la Sardegna vanta alcune delle acque più trasparenti del Mediterraneo, un patrimonio archeologico unico legato ai nuraghi e un entroterra selvaggio ancora poco battuto.",
    highlights: ["Costa Smeralda", "Cala Goloritzé e Golfo di Orosei", "Nuraghi e siti archeologici", "Alghero e la Costa Paradiso"],
    gradient: ["#1d4e89", "#0b2545"],
    visual: { kind: "coast" },
  },
  {
    slug: "sicilia",
    name: "Sicilia",
    capital: "Palermo",
    tagline: "Etna, tempi greci e la costa più bella del Mediterraneo",
    description:
      "Crocevia di civiltà, la Sicilia offre il vulcano attivo più alto d'Europa, templi greci meglio conservati che in Grecia e città come Palermo, Siracusa e Taormina ricche di storia e sapori.",
    highlights: ["Etna", "Valle dei Templi di Agrigento", "Taormina", "Siracusa e Ortigia"],
    gradient: ["#c1440e", "#7a1f0a"],
    visual: { kind: "volcano" },
  },
  {
    slug: "toscana",
    name: "Toscana",
    capital: "Firenze",
    tagline: "Firenze, il Chianti e la Val d'Orcia",
    description:
      "Culla del Rinascimento, la Toscana è arte a Firenze e Siena, colline di vigneti nel Chianti e in Val d'Orcia, borghi medievali e una delle cucine più celebrate al mondo.",
    highlights: ["Firenze", "Val d'Orcia e Chianti", "Siena e San Gimignano", "Pisa e la Torre"],
    gradient: ["#d98324", "#a35709"],
    visual: { kind: "hills", landmark: "cypress" },
  },
  {
    slug: "trentino-alto-adige",
    name: "Trentino-Alto Adige",
    capital: "Trento",
    tagline: "Dolomiti, laghi alpini e borghi tra due culture",
    description:
      "Patrimonio UNESCO, le Dolomiti dominano un territorio dove cultura italiana e mitteleuropea convivono, tra i laghi di Braies e Molveno, Bolzano e le piste sciistiche più famose d'Italia.",
    highlights: ["Dolomiti", "Lago di Braies", "Bolzano e Trento", "Val Gardena e Alpe di Siusi"],
    gradient: ["#0b6e4f", "#06402b"],
    visual: { kind: "mountain", water: true },
  },
  {
    slug: "umbria",
    name: "Umbria",
    capital: "Perugia",
    tagline: "Il cuore verde d'Italia, tra Assisi e Orvieto",
    description:
      "Unica regione italiana senza sbocco al mare né confini esteri, l'Umbria è un susseguirsi di borghi collinari, arte sacra e paesaggi verdi, con Assisi e Orvieto tra le mete più amate.",
    highlights: ["Assisi", "Orvieto", "Perugia", "Cascata delle Marmore"],
    gradient: ["#2e8b57", "#145a32"],
    visual: { kind: "hills", landmark: "hilltown" },
  },
  {
    slug: "valle-d-aosta",
    name: "Valle d'Aosta",
    capital: "Aosta",
    tagline: "Il Monte Bianco e i castelli delle Alpi",
    description:
      "La più piccola regione italiana è anche una delle più spettacolari: il Monte Bianco, il Cervino, decine di castelli medievali e alcune delle stazioni sciistiche più celebri d'Europa.",
    highlights: ["Monte Bianco (Courmayeur)", "Cervinia e il Cervino", "Castelli della Valle d'Aosta", "Parco Nazionale del Gran Paradiso"],
    gradient: ["#7b2d26", "#4a1a15"],
    visual: { kind: "mountain", landmark: "castle" },
  },
  {
    slug: "veneto",
    name: "Veneto",
    capital: "Venezia",
    tagline: "Venezia, Verona e le Dolomiti venete",
    description:
      "Dalla laguna di Venezia all'Arena di Verona, dalle colline del Prosecco alle Dolomiti di Cortina, il Veneto è una delle regioni più visitate al mondo e tra le più diverse per paesaggi.",
    highlights: ["Venezia e la Laguna", "Verona", "Dolomiti e Cortina d'Ampezzo", "Colline del Prosecco (Valdobbiadene)"],
    gradient: ["#0f6674", "#073b42"],
    visual: { kind: "city", landmark: "campanile", water: true },
  },
];

export function getRegionBySlug(slug: string): Region | undefined {
  return regions.find((region) => region.slug === slug);
}
