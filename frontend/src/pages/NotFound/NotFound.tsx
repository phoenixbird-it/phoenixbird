import { Link } from 'react-router-dom';
import Seo from '../../components/Seo/Seo';
import styles from './NotFound.module.scss';

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="The page you were looking for could not be found. Browse the manpower and facility services offered by PHOENIX BIRDS in Madurai, Tamil Nadu."
        noIndex
      />
      <section className={`container ${styles.wrap}`}>
        <span className={styles.code} aria-hidden="true">
          404
        </span>
        <h1 className={styles.title}>This page could not be found</h1>
        <p className="lede">
          The link may be out of date or the page may have moved. Use the links below to get back on
          track, or send us your requirement directly.
        </p>
        <div className={styles.actions}>
          <Link className="btn btnPrimary" to="/">
            Back to home
          </Link>
          <Link className="btn btnOutline" to="/services">
            View services
          </Link>
          <Link className="btn btnOutline" to="/request-manpower">
            Request manpower
          </Link>
        </div>
      </section>
    </>
  );
}
