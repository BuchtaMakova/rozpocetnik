export const czk = (n: number): string =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(n);

export const uid = (): string => Math.random().toString(36).slice(2, 8);

export const diffColor = (diff: number): string => {
  if (diff > 0) return "text-rose-500";
  if (diff < 0) return "text-green-500";
  return "text-pink-400";
};
