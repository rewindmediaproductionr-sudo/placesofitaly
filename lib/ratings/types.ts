export type EntityKind =
  | "regione"
  | "provincia"
  | "comune"
  | "luogo"
  | "evento"
  | "pagina";

export interface LikeSummary {
  ref: string;
  /** Like ricevuti dall'entità stessa. */
  directLikes: number;
  /** Like propri più quelli di tutti i discendenti: il "punteggio". */
  subtreeLikes: number;
  /** Contenuti nel sottoalbero, sé compresa: il denominatore dell'indice. */
  subtreeEntities: number;
  /** Media bayesiana dei like per contenuto: confrontabile fra territori. */
  indice: number;
}
