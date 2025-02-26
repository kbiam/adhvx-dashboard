export function isEmpty(value: unknown): boolean {
  // Check for null or undefined
  if (value === null || value === undefined) return true;

  // Check for empty string
  if (typeof value === "string" && value.trim().length === 0) return true;

  // Check for empty array
  if (Array.isArray(value) && value.length === 0) return true;

  // Check for empty object (ensure it's an object and not null)
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  ) {
    return true;
  }

  // If none of the conditions matched, it's not empty
  return false;
}
