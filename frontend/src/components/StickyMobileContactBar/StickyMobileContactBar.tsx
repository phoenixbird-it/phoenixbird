import { Link } from 'react-router-dom';
import { useCompanySettings } from '../../hooks/useCompanySettings';
import { telHref } from '../../utils/company';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import styles from './StickyMobileContactBar.module.scss';

/**
 * Mobile-only fixed bottom bar: Call / WhatsApp / Request Manpower.
 * Hidden from 768px up (see the stylesheet) and omits any action whose
 * number has not been configured yet.
 */
export default function StickyMobileContactBar() {
  const { settings } = useCompanySettings();
  const phone = telHref(settings?.phone_primary);
  const whatsapp = settings?.whatsapp_number?.trim()
    ? buildWhatsAppUrl(
        settings.whatsapp_number,
        'Hello PHOENIX BIRDS, I would like to enquire about your manpower services.',
      )
    : null;

  return (
    <nav className={styles.bar} aria-label="Quick contact">
      {phone ? (
        <a className={styles.action} href={phone}>
          <span className={styles.icon} aria-hidden="true">
            ☎
          </span>
          Call
        </a>
      ) : null}
      {whatsapp ? (
        <a
          className={`${styles.action} ${styles.whatsapp}`}
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.icon} aria-hidden="true">
            ✆
          </span>
          WhatsApp
        </a>
      ) : null}
      <Link className={`${styles.action} ${styles.primary}`} to="/request-manpower">
        <span className={styles.icon} aria-hidden="true">
          ✚
        </span>
        Request
      </Link>
    </nav>
  );
}
