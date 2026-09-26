import { Link } from 'react-router-dom';
import type { Service } from '../../types';
import MediaImage from '../MediaImage/MediaImage';
import styles from './ServiceCard.module.scss';

interface ServiceCardProps {
  service: Service;
  /** Hide the "Request Manpower" link in compact contexts (e.g. home grid). */
  compact?: boolean;
}

export default function ServiceCard({ service, compact = false }: ServiceCardProps) {
  return (
    <article className={styles.card}>
      <MediaImage
        src={service.image}
        alt={`${service.title} — manpower and facility service by PHOENIX BIRDS`}
        label={service.title}
        className={styles.media}
      />
      <div className={styles.body}>
        {service.category_display ? (
          <span className={styles.badge}>{service.category_display}</span>
        ) : null}
        <h3 className={styles.title}>
          <Link to={`/services/${service.slug}`}>{service.title}</Link>
        </h3>
        {service.short_description ? (
          <p className={styles.text}>{service.short_description}</p>
        ) : null}
        <div className={styles.actions}>
          <Link className={styles.detailLink} to={`/services/${service.slug}`}>
            View details
            <span aria-hidden="true"> →</span>
          </Link>
          {compact ? null : (
            <Link
              className={`btn btnPrimary ${styles.cta}`}
              to={`/request-manpower?service=${encodeURIComponent(service.slug)}`}
            >
              Request Manpower
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
