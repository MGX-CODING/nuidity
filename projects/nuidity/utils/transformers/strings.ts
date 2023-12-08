/** Normalizes a string by removing unwanted spaces (multiple spaces, trailing spaces ...) */
export function normalizeString(value: string) {
  return value.trim().replace(/ {2,}/g, ' ');
}
