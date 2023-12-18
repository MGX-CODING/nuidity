/** Normalizes a string by removing unwanted spaces (multiple spaces, trailing spaces ...) */
export function normalizeString(value: string) {
  return value.trim().replace(/ {2,}/g, ' ');
}

/** Normalizes a date by setting its time to a given hour (default to 12) */
export function normalizeDate(date: Date | number | string, hour = 12) {
  const clone = valiDate(date, true)!;
  return new Date(clone.setHours(hour, 0, 0, 0));
}

/** Compare two dates between each other, ignoring their time */
export function compareDates(
  date1: Date | number | string,
  date2: Date | number | string
) {
  if (!date1 || !date2) return false;
  const d1 = new Date(normalizeDate(date1));
  const d2 = new Date(normalizeDate(date2));

  return d1.getTime() === d2.getTime();
}

/** Validates that the given date is indeed a date */
export function valiDate(
  date: Date | string | number,
  throwOnError = false
): Date | null {
  const d = new Date(date);

  if (isNaN(d.getTime()))
    if (throwOnError)
      throw new Error('Is not a valid date : ' + date.toString());
    else return null;

  return d;
}
