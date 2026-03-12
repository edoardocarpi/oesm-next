export function formatValue(value, unit, decimals = 2) {
  if (value === null || value === undefined) return "—";
  const num = parseFloat(value);
  if (isNaN(num)) return "—";
  if (Math.abs(num) >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)} Mld`;
  if (Math.abs(num) >= 1_000_000)     return `${(num / 1_000_000).toFixed(2)} Mln`;
  return num.toLocaleString("it-IT", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatYoY(yoy) {
  if (yoy === null || yoy === undefined) return null;
  return `${yoy >= 0 ? "+" : ""}${yoy.toFixed(2)}%`;
}

export function trendColor(yoy, invertTrend = false) {
  if (yoy === null || yoy === undefined) return "var(--text-muted)";
  const positive = invertTrend ? yoy < 0 : yoy > 0;
  return positive ? "var(--positive)" : "var(--negative)";
}
