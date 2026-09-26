import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/Seo/Seo';
import MediaImage from '../../components/MediaImage/MediaImage';
import CtaBanner from '../../components/CtaBanner/CtaBanner';
import { useAsyncData } from '../../hooks/useAsyncData';
import { getServiceBySlug } from '../../services/api';
import type { Service } from '../../types';
import { HOW_WE_WORK_STEPS } from '../../data/content';
import styles from './ServiceDetail.module.scss';

export default function ServiceDetail() {
  const { slug = '' } = useParams<{ slug: string }>();

  const fetcher = useCallback(() => getServiceBySlug(slug), [slug]);
  const { data, status, error, reload } = useAsyncData<Service>(
    fetcher,
    [slug],
    'We could not load this service right now. It may have been moved, or our system may be temporarily unavailable.',
  );

  if (status === 'loading') {
    return (
      <div className={`container ${styles.stateWrap}`} role="status" aria-live="polite">
        <p>Loading service details…</p>
      </div>
    );
  }

  if (status === 'error' || !data) {
    return (
      <>
        <Seo
          title="Service Not Available"
          description="This service page could not be loaded. Browse all manpower and facility services offered by PHOENIX BIRDS in Madurai."
          noIndex
        />
        <div className={`container ${styles.stateWrap}`}>
          <h1>Service not available</h1>
          <p className="lede">{error ?? 'We could not find the service you were looking for.'}</p>
          <div className={styles.stateActions}>
            <button type="button" className="btn btnOutline" onClick={reload}>
              Try again
            </button>
            <Link className="btn btnNavy" to="/services">
              View all services
            </Link>
          </div>
        </div>
      </>
    );
  }

  const description = data.short_description || data.long_description || '';

  return (
    <>
      <Seo
        title={data.title}
        description={
          description
            ? `${description.slice(0, 155)}`
            : `${data.title} from PHOENIX BIRDS — trained manpower and facility services for businesses in Madurai and across Tamil Nadu.`
        }
      />

      <header className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link to="/services">Services</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{data.title}</span>
          </nav>
          <div className={styles.heroGrid}>
            <div>
              {data.category_display ? (
                <span className={styles.badge}>{data.category_display}</span>
              ) : null}
              <h1 className={styles.title}>{data.title}</h1>
              {data.short_description ? (
                <p className={styles.subtitle}>{data.short_description}</p>
              ) : null}
              <div className={styles.heroActions}>
                <Link
                  className="btn btnPrimary"
                  to={`/request-manpower?service=${encodeURIComponent(data.slug)}`}
                >
                  Request Manpower
                </Link>
                <Link className="btn btnOutlineLight" to="/contact">
                  Contact Us
                </Link>
              </div>
            </div>
            <MediaImage
              src={data.image}
              alt={`${data.title} provided by PHOENIX BIRDS`}
              label={data.title}
              className={styles.heroMedia}
            />
          </div>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <section className={styles.content} aria-labelledby="service-overview-title">
          <h2 id="service-overview-title">Service Overview</h2>
          {data.long_description ? (
            data.long_description
              .split(/\n{2,}/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
              .map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : data.short_description ? (
            <p>{data.short_description}</p>
          ) : (
            <p>
              Full details for this service are being prepared. Please send us your requirement and
              our team will explain exactly how we can support your site.
            </p>
          )}

          <h2 className={styles.processHeading}>How this service is delivered</h2>
          <ol className={styles.processList}>
            {HOW_WE_WORK_STEPS.map((step) => (
              <li key={step.title}>
                <strong>{step.title}.</strong> {step.description}
              </li>
            ))}
          </ol>
        </section>

        <aside className={styles.aside} aria-label="Next steps">
          <div className={styles.asideCard}>
            <h2 className={styles.asideTitle}>Need this service?</h2>
            <p className={styles.asideText}>
              Tell us the headcount, shift pattern and location, and we will respond with a
              deployment plan.
            </p>
            <Link
              className="btn btnPrimary btnBlock"
              to={`/request-manpower?service=${encodeURIComponent(data.slug)}`}
            >
              Request Manpower
            </Link>
          </div>
          <div className={styles.asideCard}>
            <h2 className={styles.asideTitle}>Explore more</h2>
            <ul className={styles.asideLinks}>
              <li>
                <Link to="/services">All services</Link>
              </li>
              <li>
                <Link to="/industries">Industries we serve</Link>
              </li>
              <li>
                <Link to="/service-areas">Service areas</Link>
              </li>
              <li>
                <Link to="/why-choose-us">Why choose PHOENIX BIRDS</Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <CtaBanner />
    </>
  );
}
