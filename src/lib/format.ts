/**
 * Formata centavos para moeda brasileira (R$).
 * Ex: 1050 → "R$ 10,50"
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}
