import type { CompanySettings } from '../types';

export const COMPANY_NAME = 'PHOENIX BIRDS';

/** `tel:` href, or null when the number has not been configured yet. */
export function telHref(phone: string | undefined | null): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : null;
}

export function mailHref(email: string | undefined | null): string | null {
  if (!email || !email.includes('@')) return null;
  return `mailto:${email.trim()}`;
}

/** Address as display-ready lines, skipping any blank fields. */
export function addressLines(settings: CompanySettings | null): string[] {
  if (!settings) return [];
  const cityLine = [settings.city, settings.state, settings.postal_code]
    .map((part) => (part ?? '').trim())
    .filter(Boolean)
    .join(', ');

  return [settings.address_line1, settings.address_line2, cityLine, settings.country]
    .map((line) => (line ?? '').trim())
    .filter(Boolean);
}

export interface SocialLink {
  label: string;
  url: string;
}

export function socialLinks(settings: CompanySettings | null): SocialLink[] {
  if (!settings) return [];
  return (
    [
      { label: 'Facebook', url: settings.facebook_url },
      { label: 'Instagram', url: settings.instagram_url },
      { label: 'LinkedIn', url: settings.linkedin_url },
      { label: 'X (Twitter)', url: settings.twitter_url },
    ] as SocialLink[]
  ).filter((link) => Boolean(link.url && link.url.trim()));
}

export function displayName(settings: CompanySettings | null): string {
  return settings?.company_name?.trim() || COMPANY_NAME;
}

/**
 * Turns a Google Maps share/place URL into an embeddable src.
 * Returns null when nothing usable is configured, so callers can fall back to
 * a plain link instead of rendering an empty iframe.
 */
export function mapEmbedSrc(settings: CompanySettings | null): string | null {
  const url = settings?.google_maps_url?.trim();
  if (!url) return null;
  if (url.includes('/embed')) return url;

  const address = addressLines(settings).join(', ');
  const query = address || displayName(settings);
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
