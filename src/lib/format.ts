export function formatMoney(priceCents: number, currency: "MYR" = "MYR") {
  return new Intl.NumberFormat("en-MY", { style: "currency", currency }).format(priceCents / 100);
}
