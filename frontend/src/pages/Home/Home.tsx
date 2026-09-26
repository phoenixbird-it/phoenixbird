import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo/Seo';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import IndustryCard from '../../components/IndustryCard/IndustryCard';
import DataState from '../../components/DataState/DataState';
import CtaBanner from '../../components/CtaBanner/CtaBanner';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useCompanySettings } from '../../hooks/useCompanySettings';
import { getIndustries, getLocations, getServices } from '../../services/api';
import type { Industry, Location, Service } from '../../types';
import { HOW_WE_WORK_STEPS, SERVICE_CATEGORIES, WHY_CHOOSE_US } from '../../data/content';
import { addressLines, mailHref, telHref } from '../../utils/company';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import styles from './Home.module.scss';

const CATEGORY_LABELS = new Map(SERVICE_CATEGORIES.map((item) => [item.value, item.label]));

export default function Home() {
  const { settings } = useCompanySettings();
  const servicesState = useAsyncData<Service[]>(() => getServices(), []);
  const industriesState = useAsyncData<Industry[]>(() => getIndustries(), []);
  const locationsState = useAsyncData<Location[]>(() => getLocations(), []);

  /** Categories present in the API response, in the brief's declared order. */
  const categoryGroups = useMemo(() => {
    const services = servicesState.data ?? [];
    const grouped = new Map<string, Service[]>();
    for (const service of services) {
      const bucket = grouped.get(service.category);
      if (bucket) {
        bucket.push(service);
      } else {
        grouped.set(service.category, [service]);
      }
    }
    return SERVICE_CATEGORIES.map((category) => ({
      value: category.value,
      label: category.label,
      services: grouped.get(category.value) ?? [],
    })).filter((group) => group.services.length > 0);
  }, [servicesState.data]);

  const featuredServices = useMemo(
    () => (servicesState.data ?? []).slice(0, 6),
    [servicesState.data],
  );

  const previewIndustries = useMemo(
    () => (industriesState.data ?? []).slice(0, 6),
    [industriesState.data],
  );

  const phone = telHref(settings?.phone_primary);
  const email = mailHref(settings?.email_enquiries || settings?.email_primary);
  const lines = addressLines(settings);
  const whatsapp = settings?.whatsapp_number?.trim()
    ? buildWhatsAppUrl(
        settings.whatsapp_number,
        'Hello PHOENIX BIRDS, I would like to enquire about your manpower services.',
      )
    : null;

  return (
    <>
      <Seo
        title="PHOENIX BIRDS | Manpower Supply & Facility Services in Madurai"
        description="PHOENIX BIRDS supplies trained housekeeping, hospitality, hospital and industrial manpower, plus facility management services, to businesses in Madurai and across Tamil Nadu."
        appendBrand={false}
      />

      {/* ------------------------------- hero ------------------------------- */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.heroEyebrow}>Manpower Supply &amp; Facility Services</span>
            <h1 id="hero-title" className={styles.heroTitle}>
              Professional Manpower Solutions for Hotels, Hospitals &amp; Industries
            </h1>
            <p className={styles.heroText}>
              Reliable, Trained and Scalable Workforce Solutions for Your Business
            </p>
            <div className={styles.heroActions}>
              <Link className="btn btnPrimary" to="/request-manpower">
                Request Manpower
              </Link>
              <Link className="btn btnOutlineLight" to="/contact">
                Contact Us
              </Link>
            </div>
            <ul className={styles.heroPoints}>
              <li>Screened &amp; verified staff</li>
              <li>PF &amp; ESI compliance handled</li>
              <li>Replacement support</li>
            </ul>
          </div>

          <div className={styles.heroPanel} aria-hidden="true">
            <div className={styles.heroPanelInner}>
              {['Hotels & Resorts', 'Hospitals & Clinics', 'Factories & Plants', 'Corporate Offices', 'Commercial Properties'].map((label) => (
                <span key={label} className={styles.heroTag}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ intro ------------------------------- */}
      <section className="section" aria-labelledby="intro-title">
        <div className={`container ${styles.intro}`}>
          <div>
            <SectionHeading
              eyebrow="Who We Are"
              title="A manpower partner built around dependability"
              id="intro-title"
            />
            <p className={styles.introText}>
              PHOENIX BIRDS is a manpower supply and facility services company based in Madurai,
              Tamil Nadu. We recruit, verify, deploy and manage staff for hotels, hospitals,
              industrial units, corporate offices and commercial establishments — and we stay
              responsible for them once they are on your site.
            </p>
            <p className={styles.introText}>
              Attendance, payroll support, PF and ESI compliance and replacement cover are part of
              the engagement, not add-ons. That means fewer gaps in your roster and no compliance
              surprises in your service contracts.
            </p>
            <div className={styles.introActions}>
              <Link className="btn btnNavy" to="/about">
                More about us
              </Link>
              <Link className={styles.quietLink} to="/how-we-work">
                See how we work
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
          </div>

          <ul className={styles.introStats}>
            {WHY_CHOOSE_US.slice(0, 4).map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------- services ----------------------------- */}
      <section className="section sectionAlt" aria-labelledby="services-title">
        <div className="container">
          <SectionHeading
            eyebrow="Our Services"
            title="Manpower & facility services we provide"
            description="Staff and managed services across hospitality, healthcare, industrial and commercial environments."
            align="center"
            id="services-title"
          />

          <DataState
            status={servicesState.status}
            data={featuredServices}
            error={servicesState.error}
            onRetry={servicesState.reload}
            skeletonCount={3}
            loadingLabel="Loading services"
            emptyMessage="No services available yet. Please contact us and we will tell you how we can help."
          >
            {(items) => (
              <>
                {categoryGroups.length > 0 ? (
                  <div className={styles.categoryRow}>
                    {categoryGroups.map((group) => (
                      <Link
                        key={group.value}
                        className={styles.categoryChip}
                        to={`/services?category=${group.value}`}
                      >
                        {CATEGORY_LABELS.get(group.value) ?? group.label}
                        <span className={styles.categoryCount}>{group.services.length}</span>
                      </Link>
                    ))}
                  </div>
                ) : null}

                <div className={styles.cardGrid}>
                  {items.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>

                <div className={styles.sectionFooter}>
                  <Link className="btn btnNavy" to="/services">
                    View all services
                  </Link>
                </div>
              </>
            )}
          </DataState>
        </div>
      </section>

      {/* ---------------------------- industries ---------------------------- */}
      <section className="section" aria-labelledby="industries-title">
        <div className="container">
          <SectionHeading
            eyebrow="Industries"
            title="Industries we serve"
            description="Each sector has its own standards and shift patterns. We brief our staff for the environment they are entering."
            align="center"
            id="industries-title"
          />

          <DataState
            status={industriesState.status}
            data={previewIndustries}
            error={industriesState.error}
            onRetry={industriesState.reload}
            skeletonCount={3}
            loadingLabel="Loading industries"
            emptyMessage="Our industry list is being updated. Please contact us to discuss your sector."
          >
            {(items) => (
              <>
                <div className={styles.cardGrid}>
                  {items.map((industry) => (
                    <IndustryCard key={industry.id} industry={industry} />
                  ))}
                </div>
                <div className={styles.sectionFooter}>
                  <Link className="btn btnNavy" to="/industries">
                    All industries we serve
                  </Link>
                </div>
              </>
            )}
          </DataState>
        </div>
      </section>

      {/* ---------------------------- why choose ---------------------------- */}
      <section className="section sectionAlt" aria-labelledby="why-title">
        <div className="container">
          <SectionHeading
            eyebrow="Why Us"
            title="Why choose PHOENIX BIRDS"
            description="The operational basics, handled properly — that is what keeps our clients with us."
            align="center"
            id="why-title"
          />
          <ul className={styles.whyGrid}>
            {WHY_CHOOSE_US.slice(0, 6).map((item) => (
              <li key={item.title} className={styles.whyCard}>
                <span className={styles.whyMark} aria-hidden="true">
                  ✓
                </span>
                <h3 className={styles.whyTitle}>{item.title}</h3>
                <p className={styles.whyText}>{item.description}</p>
              </li>
            ))}
          </ul>
          <div className={styles.sectionFooter}>
            <Link className="btn btnNavy" to="/why-choose-us">
              All ten reasons
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------- how we work --------------------------- */}
      <section className="section" aria-labelledby="process-title">
        <div className="container">
          <SectionHeading
            eyebrow="Our Process"
            title="How we work"
            description="From your first enquiry to ongoing support after deployment."
            align="center"
            id="process-title"
          />
          <ol className={styles.steps}>
            {HOW_WE_WORK_STEPS.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
              </li>
            ))}
          </ol>
          <div className={styles.sectionFooter}>
            <Link className="btn btnNavy" to="/how-we-work">
              See the full process
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------- service areas -------------------------- */}
      <section className="section sectionAlt" aria-labelledby="areas-title">
        <div className="container">
          <SectionHeading
            eyebrow="Coverage"
            title="Where we deploy"
            description="Madurai is our primary base, and we serve client sites across Tamil Nadu."
            align="center"
            id="areas-title"
          />
          <DataState
            status={locationsState.status}
            data={locationsState.data}
            error={locationsState.error}
            onRetry={locationsState.reload}
            skeletonCount={4}
            loadingLabel="Loading service areas"
            emptyMessage="Our location list is being updated. We are based in Madurai, Tamil Nadu — contact us to confirm coverage."
          >
            {(items) => (
              <>
                <ul className={styles.locationList}>
                  {items.slice(0, 12).map((location) => (
                    <li
                      key={location.id}
                      className={`${styles.locationChip} ${
                        location.is_primary ? styles.locationPrimary : ''
                      }`}
                    >
                      {location.name}
                      {location.is_primary ? (
                        <span className={styles.locationFlag}>Primary</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <div className={styles.sectionFooter}>
                  <Link className="btn btnNavy" to="/service-areas">
                    All service areas
                  </Link>
                </div>
              </>
            )}
          </DataState>
        </div>
      </section>

      <CtaBanner />

      {/* ------------------------------ contact ----------------------------- */}
      <section className="section" aria-labelledby="contact-preview-title">
        <div className={`container ${styles.contact}`}>
          <div>
            <SectionHeading
              eyebrow="Get in Touch"
              title="Talk to our team"
              description="Send us your requirement or call us directly — whichever is quicker for you."
              id="contact-preview-title"
            />
            <div className={styles.contactActions}>
              <Link className="btn btnPrimary" to="/request-manpower">
                Request Manpower
              </Link>
              <Link className="btn btnOutline" to="/contact">
                Contact page
              </Link>
            </div>
          </div>

          <ul className={styles.contactList}>
            {phone ? (
              <li>
                <span className={styles.contactLabel}>Phone</span>
                <a href={phone}>{settings?.phone_primary}</a>
              </li>
            ) : null}
            {whatsapp ? (
              <li>
                <span className={styles.contactLabel}>WhatsApp</span>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  {settings?.whatsapp_number}
                </a>
              </li>
            ) : null}
            {email ? (
              <li>
                <span className={styles.contactLabel}>Email</span>
                <a href={email}>{settings?.email_enquiries || settings?.email_primary}</a>
              </li>
            ) : null}
            {lines.length > 0 ? (
              <li>
                <span className={styles.contactLabel}>Office</span>
                <address className={styles.contactAddress}>
                  {lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
              </li>
            ) : null}
            {!phone && !email && lines.length === 0 ? (
              <li className={styles.contactFallback}>
                Our contact details are being updated. Please use the{' '}
                <Link to="/contact">contact form</Link> and we will respond promptly.
              </li>
            ) : null}
          </ul>
        </div>
      </section>
    </>
  );
}
