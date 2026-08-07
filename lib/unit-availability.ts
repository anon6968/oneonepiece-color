/** Resolve a jump-box value only when it names a unit that is actually served. */
export function availableUnit(value: string, units: readonly number[]): number | null {
  if (!/^\d+$/.test(value)) return null;
  const unit = Number(value);
  return Number.isSafeInteger(unit) && units.includes(unit) ? unit : null;
}

/** Compact, honest hint for contiguous and gapped catalogs. */
export function availableUnitHint(units: readonly number[]): string {
  if (units.length === 0) return "";
  const first = units[0];
  const last = units[units.length - 1];
  const contiguous = units.every((unit, index) => unit === first + index);
  return contiguous ? `${first}–${last}` : "available chapters only";
}
