import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../../components/Seo/Seo';
import PageHero from '../../components/PageHero/PageHero';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import DataState from '../../components/DataState/DataState';
import CtaBanner from '../../components/CtaBanner/CtaBanner';
import { useAsyncData } from '../../hooks/useAsyncData';
import { getServices } from '../../services/api';
import type { Service } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/content';
import styles from './Services.module.scss';

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') ?? '';

  // Fetch once and filter client-side so switching tabs is instant; the API
  // `?category=` filter is still used when the page is deep-linked.
  const { data, status, error, reload } = useAsyncData<Service[]>(
    () => getServices(),
    [],
    'We could not load our service list right now. Please refresh the page or contact us directly.',
  );

  const filtered = useMemo(() => {
    if (!data) return null;
    if (!activeCategory) return data;
    return data.filter((service) => service.category === activeCategory);
  }, [data, activeCategory]);

  const availableCategories = useMemo(() => {
    const present = new Set((data ?? []).map((service) => service.category));
    return SERVICE_CATEGORIES.filter((category) => present.has(category.value));
  }, [data]);

  const selectCategory = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set('category', value);
    } else {
      next.delete('category');
    }
    setSearchParams(next, { replace: true });
  };

  const activeLabel =
    SERVICE_CATEGORIES.find((category) => category.value === activeCategory)?.label ?? null;

  return (
    <>
      <Seo
        title="Manpower & Facility Services"
        description="Housekeeping, hospitality, hospital, industrial, cleaning, garden and facility management manpower services from PHOENIX BIRDS, Madurai. Browse our services and request staff for your site."
      />
      <PageHero
        eyebrow="Our Services"
        title="Manpower & Facility Services"
        description="Trained staff and managed facility services for hotels, hospitals, factories, offices and commercial properties. Filter by category to find what you need."
      />

      <section className={`container ${styles.wrap}`} aria-labelledby="services-list-title">
        <h2 id="services-list-title" className="srOnly">
          Service list
        </h2>

        {availableCategories.length > 0 ? (
          <div className={styles.filters} role="group" aria-label="Filter services by category">
            <button
              type="button"
              className={`${styles.filter} ${!activeCategory ? styles.filterActive : ''}`}
              aria-pressed={!activeCategory}
              onClick={() => selectCategory('')}
            >
              All services
            </button>
            {availableCategories.map((category) => (
              <button
                key={category.value}
                type="button"
                className={`${styles.filter} ${
                  activeCategory === category.value ? styles.filterActive : ''
                }`}
                aria-pressed={activeCategory === category.value}
                onClick={() => selectCategory(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        ) : null}

        <DataState
          status={status}
          data={filtered}
          error={error}
          onRetry={reload}
          skeletonCount={6}
          loadingLabel="Loading services"
          emptyMessage={
            activeLabel
              ? `No ${activeLabel.toLowerCase()} services are listed yet. Please browse all services or send us your requirement.`
              : 'No services available yet. Please contact us and we will tell you how we can help.'
          }
        >
          {(items) => (
            <>
              <p className={styles.count}>
                Showing {items.length} {items.length === 1 ? 'service' : 'services'}
                {activeLabel ? ` in ${activeLabel}` : ''}.
              </p>
              <div className={styles.grid}>
                {items.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </>
          )}
        </DataState>
      </section>

      <CtaBanner />
    </>
  );
}
