import Seo from '../../components/Seo/Seo';
import PageHero from '../../components/PageHero/PageHero';
import IndustryCard from '../../components/IndustryCard/IndustryCard';
import DataState from '../../components/DataState/DataState';
import CtaBanner from '../../components/CtaBanner/CtaBanner';
import { useAsyncData } from '../../hooks/useAsyncData';
import { getIndustries } from '../../services/api';
import type { Industry } from '../../types';
import styles from './Industries.module.scss';

export default function Industries() {
  const { data, status, error, reload } = useAsyncData<Industry[]>(
    () => getIndustries(),
    [],
    'We could not load the industries list right now. Please refresh the page or contact us directly.',
  );

  return (
    <>
      <Seo
        title="Industries We Serve"
        description="PHOENIX BIRDS supplies manpower to hotels, hospitals, industrial and manufacturing units, corporate offices, commercial establishments and residential properties in Madurai and across Tamil Nadu."
      />
      <PageHero
        eyebrow="Industries"
        title="Industries We Serve"
        description="Every sector has its own standards, shift patterns and compliance expectations. We deploy staff who are briefed for the environment they are going into."
      />

      <section className={`container ${styles.wrap}`} aria-labelledby="industries-title">
        <h2 id="industries-title" className="srOnly">
          Industries list
        </h2>
        <DataState
          status={status}
          data={data}
          error={error}
          onRetry={reload}
          skeletonCount={6}
          loadingLabel="Loading industries"
          emptyMessage="Our industry list is being updated. Please contact us to discuss your sector and requirement."
        >
          {(items) => (
            <div className={styles.grid}>
              {items.map((industry) => (
                <IndustryCard key={industry.id} industry={industry} detailed />
              ))}
            </div>
          )}
        </DataState>
      </section>

      <CtaBanner
        title="Not sure which category you fall under?"
        description="Tell us about your site and the roles you need covered — we will advise on the right deployment model."
      />
    </>
  );
}
