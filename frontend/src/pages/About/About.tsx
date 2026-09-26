import { Link } from 'react-router-dom';
import Seo from '../../components/Seo/Seo';
import PageHero from '../../components/PageHero/PageHero';
import CtaBanner from '../../components/CtaBanner/CtaBanner';
import { useCompanySettings } from '../../hooks/useCompanySettings';
import { ABOUT_SECTIONS, WHY_CHOOSE_US } from '../../data/content';
import { displayName } from '../../utils/company';
import styles from './About.module.scss';

/** Slugify a heading so the in-page contents list can link to it. */
const anchorId = (heading: string) =>
  `about-${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

export default function About() {
  const { settings } = useCompanySettings();
  const name = displayName(settings);

  return (
    <>
      <Seo
        title="About Us"
        description="PHOENIX BIRDS is a manpower supply and facility services company in Madurai, Tamil Nadu, providing trained and supervised staff to hotels, hospitals, industries and corporate offices."
      />
      <PageHero
        eyebrow="About Us"
        title={`About ${name}`}
        description="A manpower supply and facility services company based in Madurai, Tamil Nadu — built around dependable deployment, disciplined staff and honest dealing."
      />

      <div className={`container ${styles.layout}`}>
        <nav className={styles.toc} aria-label="On this page">
          <h2 className={styles.tocTitle}>On this page</h2>
          <ul className={styles.tocList}>
            {ABOUT_SECTIONS.map((section) => (
              <li key={section.heading}>
                <a href={`#${anchorId(section.heading)}`}>{section.heading}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.content}>
          {ABOUT_SECTIONS.map((section) => (
            <section
              key={section.heading}
              id={anchorId(section.heading)}
              className={styles.section}
              aria-labelledby={`${anchorId(section.heading)}-title`}
            >
              <h2 id={`${anchorId(section.heading)}-title`} className={styles.heading}>
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index} className={styles.text}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section className={styles.section} aria-labelledby="about-strengths-title">
            <h2 id="about-strengths-title" className={styles.heading}>
              What Clients Rely On Us For
            </h2>
            <ul className={styles.strengths}>
              {WHY_CHOOSE_US.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </li>
              ))}
            </ul>
            <div className={styles.actions}>
              <Link className="btn btnPrimary" to="/request-manpower">
                Request Manpower
              </Link>
              <Link className="btn btnOutline" to="/why-choose-us">
                Why choose us
              </Link>
            </div>
          </section>
        </div>
      </div>

      <CtaBanner />
    </>
  );
}
