import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '../../data/navigation';
import { useCompanySettings } from '../../hooks/useCompanySettings';
import { addressLines, displayName, mailHref, socialLinks, telHref } from '../../utils/company';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import styles from './Footer.module.scss';

export default function Footer() {
  const { settings, loading } = useCompanySettings();

  const name = displayName(settings);
  const lines = addressLines(settings);
  const primaryPhone = telHref(settings?.phone_primary);
  const secondaryPhone = telHref(settings?.phone_secondary);
  const primaryEmail = mailHref(settings?.email_primary);
  const enquiryEmail = mailHref(settings?.email_enquiries);
  const socials = socialLinks(settings);
  const whatsapp = settings?.whatsapp_number
    ? buildWhatsAppUrl(
        settings.whatsapp_number,
        'Hello PHOENIX BIRDS, I would like to enquire about your manpower services.',
      )
    : null;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.about}>
          <span className={styles.brand}>{name}</span>
          <p className={styles.text}>
            {settings?.tagline?.trim() ||
              'Manpower supply and facility services for hotels, hospitals, industries, corporate offices and commercial establishments across Madurai and Tamil Nadu.'}
          </p>
          {socials.length > 0 ? (
            <ul className={styles.socials}>
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav className={styles.column} aria-label="Footer quick links">
          <h2 className={styles.heading}>Quick Links</h2>
          <ul className={styles.linkList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/request-manpower">Request Manpower</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.column}>
          <h2 className={styles.heading}>Services</h2>
          <ul className={styles.linkList}>
            <li>
              <Link to="/services?category=hospitality">Hospitality Manpower</Link>
            </li>
            <li>
              <Link to="/services?category=hospital">Hospital Manpower</Link>
            </li>
            <li>
              <Link to="/services?category=industrial">Industrial Manpower</Link>
            </li>
            <li>
              <Link to="/services?category=facility_management">Facility Management</Link>
            </li>
            <li>
              <Link to="/services?category=cleaning">Cleaning Services</Link>
            </li>
            <li>
              <Link to="/services?category=garden_landscape">Garden & Landscape</Link>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h2 className={styles.heading}>Get in Touch</h2>
          {loading ? (
            <p className={styles.text}>Loading contact details…</p>
          ) : (
            <ul className={styles.contactList}>
              {lines.length > 0 ? (
                <li>
                  <address className={styles.address}>
                    {lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                </li>
              ) : null}
              {primaryPhone ? (
                <li>
                  <a href={primaryPhone}>{settings?.phone_primary}</a>
                </li>
              ) : null}
              {secondaryPhone ? (
                <li>
                  <a href={secondaryPhone}>{settings?.phone_secondary}</a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                    WhatsApp us
                  </a>
                </li>
              ) : null}
              {primaryEmail ? (
                <li>
                  <a href={primaryEmail}>{settings?.email_primary}</a>
                </li>
              ) : null}
              {enquiryEmail && settings?.email_enquiries !== settings?.email_primary ? (
                <li>
                  <a href={enquiryEmail}>{settings?.email_enquiries}</a>
                </li>
              ) : null}
              {settings?.office_hours?.trim() ? (
                <li className={styles.hours}>{settings.office_hours}</li>
              ) : null}
              {lines.length === 0 && !primaryPhone && !primaryEmail ? (
                <li className={styles.text}>
                  Contact details will appear here shortly. Please use the{' '}
                  <Link to="/contact">contact form</Link>.
                </li>
              ) : null}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p>
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <p className={styles.bottomMeta}>
            Manpower Supply &amp; Facility Services · Madurai, Tamil Nadu
          </p>
        </div>
      </div>
    </footer>
  );
}
