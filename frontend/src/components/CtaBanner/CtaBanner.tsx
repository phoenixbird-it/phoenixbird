import { Link } from 'react-router-dom';
import { useCompanySettings } from '../../hooks/useCompanySettings';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { telHref } from '../../utils/company';
import styles from './CtaBanner.module.scss';

interface CtaBannerProps {
  title?: string;
  description?: string;
}

/** Enquiry call-to-action band. Phone/WhatsApp come from company settings. */
export default function CtaBanner({
  title = 'Need trained manpower for your site?',
  description = 'Tell us your requirement — roles, headcount, shifts and location — and our team will respond with a workable deployment plan.',
}: CtaBannerProps) {
  const { settings } = useCompanySettings();
  const phone = telHref(settings?.phone_primary);
  const whatsapp = settings?.whatsapp_number
    ? buildWhatsAppUrl(
        settings.whatsapp_number,
        'Hello PHOENIX BIRDS, I would like to enquire about your manpower services.',
      )
    : null;

  return (
    <section className={styles.banner} aria-labelledby="cta-banner-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <h2 id="cta-banner-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.text}>{description}</p>
        </div>
        <div className={styles.actions}>
          <Link className="btn btnPrimary" to="/request-manpower">
            Request Manpower
          </Link>
          {whatsapp ? (
            <a
              className="btn btnOutlineLight"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          ) : null}
          {phone ? (
            <a className={styles.phone} href={phone}>
              or call {settings?.phone_primary}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
