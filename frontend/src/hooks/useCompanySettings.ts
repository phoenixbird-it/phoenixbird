import { useEffect, useState } from 'react';
import { getCompanySettings } from '../services/api';
import type { CompanySettings } from '../types';

/**
 * Module-level cache of the in-flight/settled request.
 *
 * Company settings are a singleton consumed by the navbar, footer, floating
 * WhatsApp button, sticky mobile bar, CTA banner and the contact page. Without
 * this cache each consumer would issue its own request on every navigation.
 * The public hook signature is unchanged.
 */
let settingsPromise: Promise<CompanySettings> | null = null;
let cachedSettings: CompanySettings | null = null;

function loadCompanySettings(): Promise<CompanySettings> {
  if (!settingsPromise) {
    settingsPromise = getCompanySettings()
      .then((data) => {
        cachedSettings = data;
        return data;
      })
      .catch((error: unknown) => {
        // Allow a later mount to retry rather than caching the failure forever.
        settingsPromise = null;
        throw error;
      });
  }
  return settingsPromise;
}

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(cachedSettings);
  const [loading, setLoading] = useState(cachedSettings === null);

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }

    let mounted = true;
    loadCompanySettings()
      .then((data) => {
        if (mounted) setSettings(data);
      })
      .catch(() => {
        if (mounted) setSettings(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading };
}
