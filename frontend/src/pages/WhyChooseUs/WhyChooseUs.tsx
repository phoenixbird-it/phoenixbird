import { Link } from 'react-router-dom';
import Seo from '../../components/Seo/Seo';
import PageHero from '../../components/PageHero/PageHero';
import CtaBanner from '../../components/CtaBanner/CtaBanner';
import { WHY_CHOOSE_US } from '../../data/content';
import styles from './WhyChooseUs.module.scss';

export default function WhyChooseUs() {
  return (
    <>
      <Seo
        title="Why Choose Us"
        description="Reliable manpower, a trained workforce, scalable deployment, attendance and payroll support, PF and ESI compliance and replacement support — what working with PHOENIX BIRDS in Madurai gives you."
      />
      <PageHero
        eyebrow="Why Choose Us"
        title="Why Choose PHOENIX BIRDS"
        description="Our clients keep working with us because the basics are handled properly: the right people, on time, with the paperwork and compliance in order."
      />

      <section className={`container ${styles.wrap}`} aria-labelledby="why-list-title">
        <h2 id="why-list-title" className="srOnly">
          Reasons to choose PHOENIX BIRDS
        </h2>
        <ul className={styles.grid}>
          {WHY_CHOOSE_US.map((item, index) => (
            <li key={item.title} className={styles.card}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.text}>{item.description}</p>
            </li>
          ))}
        </ul>

        <div className={styles.note}>
          <h2 className={styles.noteTitle}>A straightforward commitment</h2>
          <p>
            We do not over-promise. What we commit to is clear: the agreed headcount deployed on
            the agreed date, staff who have been screened and verified, attendance you can audit,
            statutory obligations met, and a replacement when one is needed.
          </p>
          <p>
            If your requirement changes — more staff for a season, fewer during a shutdown, a new
            site to cover — tell us and we will adjust.
          </p>
          <div className={styles.noteActions}>
            <Link className="btn btnPrimary" to="/request-manpower">
              Request Manpower
            </Link>
            <Link className="btn btnOutline" to="/how-we-work">
              See how we work
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
