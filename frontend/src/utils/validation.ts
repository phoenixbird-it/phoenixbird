/** Reasonably permissive email check — the backend is the authority. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/** 7–15 digits, optional leading "+", spaces/dashes/brackets tolerated. */
const MOBILE_RE = /^\+?\d{7,15}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Strips formatting characters before checking the digit count. */
export function normaliseMobile(value: string): string {
  const trimmed = value.trim().replace(/[\s\-().]/g, '');
  return trimmed.startsWith('+') ? `+${trimmed.slice(1).replace(/\D/g, '')}` : trimmed.replace(/\D/g, '');
}

export function isValidMobile(value: string): boolean {
  return MOBILE_RE.test(normaliseMobile(value));
}

export type FieldErrors<T extends string = string> = Partial<Record<T, string>>;

/** Flattens DRF's `{field: ["msg", …]}` shape into `{field: "msg"}`. */
export function flattenFieldErrors(
  fieldErrors: Record<string, string[]> | undefined,
): Record<string, string> {
  if (!fieldErrors) return {};
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(fieldErrors)) {
    if (key === 'detail') continue;
    if (Array.isArray(value)) {
      const messages = value.filter((item): item is string => typeof item === 'string');
      if (messages.length > 0) flat[key] = messages.join(' ');
    } else if (typeof value === 'string') {
      flat[key] = value;
    }
  }
  return flat;
}
