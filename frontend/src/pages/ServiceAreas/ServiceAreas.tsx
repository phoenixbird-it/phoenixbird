import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo/Seo';
import PageHero from '../../components/PageHero/PageHero';
import DataState from '../../components/DataState/DataState';
import CtaBanner from '../../components/CtaBanner/CtaBanner';
import { useAsyncData } from '../../hooks/useAsyncData';
import { getLocations } from '../../services/api';
import type { Location } from '../../types';
import styles from './ServiceAreas.module.scss';

export default function ServiceAreas() {
  const { data, status, error, reload } = useAsyncData<Location[]>(
    () => getLocations(),
    [],
    'We could not load our service area list right now. Please refresh the page or contact us directly.',
  );

  const { primary, others } = useMemo(() => {
    const list = data ?? [];
    return {
      primary: list.filter((location) => location.is_primary),
      others: list.filter((location) => !location.is_primary),
    };
  }, [data]);

  return (
    <>
      <Seo
        title="Service Areas"
        description="PHOENIX BIRDS provides manpower supply and facility services in Madurai and surrounding districts across Tamil Nadu. See the locations where we currently deploy staff."
      />
      <PageHero
        eyebrow="Coverage"
        title="Service Areas"
        description="Madurai is our primary base of operations, and we deploy staff to client sites across Tamil Nadu."
      />

      <section className={`container ${styles.wrap}`} aria-labelledby="areas-title">
        <h2 id="areas-title" className="srOnly">
          Locations we serve
        </h2>

        <DataState
          status={status}
          data={data}
          error={error}
          onRetry={reload}
          skeletonCount={6}
          loadingLabel="Loading service areas"
          emptyMessage="Our location list is being updated. We are based in Madurai, Tamil Nadu — please contact us to confirm coverage for your site."
        >
          {() => (
            <>
              {primary.length > 0 ? (
                <div className={styles.block}>
                  <h3 className={styles.blockTitle}>Primary service areas</h3>
                  <p className={styles.blockText}>
                    Where we operate most intensively, with the fastest response and the deepest
                    local recruitment network.
                  </p>
                  <ul className={styles.grid}>
                    {primary.map((location) => (
                      <li key={location.id} className={`${styles.card} ${styles.cardPrimary}`}>
                        <span className={styles.flag}>Primary</span>
                        <span className={styles.name}>{location.name}</span>
                        {location.state ? (
                          <span className={styles.state}>{location.state}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {others.length > 0 ? (
                <div className={styles.block}>
                  <h3 className={styles.blockTitle}>Other locations we serve</h3>
                  <ul className={styles.grid}>
                    {others.map((location) => (
                      <li key={location.id} className={styles.card}>
                        <span className={styles.name}>{location.name}</span>
                        {location.state ? (
                          <span className={styles.state}>{location.state}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className={styles.note}>
                <h3 className={styles.blockTitle}>Not on the list?</h3>
                <p>
                  We regularly take on new locations within Tamil Nadu. Send us your site details
                  and we will confirm whether we can deploy there and how quickly.
                </p>
                <Link className="btn btnPrimary" to="/request-manpower">
                  Check availability for your site
                </Link>
              </div>
            </>
          )}
        </DataState>
      </section>

      <CtaBanner />
    </>
  );
}
