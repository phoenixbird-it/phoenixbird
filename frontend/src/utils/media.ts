const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

/**
 * DRF usually returns absolute media URLs, but a relative `/media/...` path is
 * possible depending on request context — resolve those against the API host.
 */
export function resolveMediaUrl(image: string | null | undefined): string | null {
  const value = image?.trim();
  if (!value) return null;
  if (/^(https?:)?\/\//.test(value) || value.startsWith('data:')) return value;
  try {
    return new URL(value, API_BASE_URL).toString();
  } catch {
    return null;
  }
}

/** First letter of a title, used by the placeholder tile. */
export function initialOf(text: string): string {
  const trimmed = text.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '•';
}
