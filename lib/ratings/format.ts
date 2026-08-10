const integerFormatter = new Intl.NumberFormat("it-IT");

const decimalFormatter = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatLikeCount(count: number) {
  return integerFormatter.format(count);
}

export function formatLikeLabel(count: number) {
  if (count === 0) return "Nessun like";
  if (count === 1) return "1 like";
  return `${integerFormatter.format(count)} like`;
}

/** Separatore decimale italiano: 4,6 e non 4.6. */
export function formatIndice(value: number) {
  return decimalFormatter.format(value);
}
