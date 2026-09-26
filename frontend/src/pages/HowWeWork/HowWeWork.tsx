import { Link } from 'react-router-dom';
import Seo from '../../components/Seo/Seo';
import PageHero from '../../components/PageHero/PageHero';
import CtaBanner from '../../components/CtaBanner/CtaBanner';
import { HOW_WE_WORK_STEPS } from '../../data/content';
import styles from './HowWeWork.module.scss';

export default function HowWeWork() {
  return (
    <>
      <Seo
        title="How We Work"
        description="Our manpower deployment process: understanding your requirement, planning, recruitment and screening, verification, deployment, attendance management and ongoing replacement support."
      />
      <PageHero
        eyebrow="Our Process"
        title="How We Work"
        description="A defined seven-step process from your first enquiry through to ongoing support after deployment — so you always know what happens next."
      />

      <section className={`container ${styles.wrap}`} aria-labelledby="process-title">
        <h2 id="process-title" className="srOnly">
          Our seven-step deployment process
        </h2>

        <ol className={styles.timeline}>
          {HOW_WE_WORK_STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <div className={styles.marker} aria-hidden="true">
                {index + 1}
              </div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>
                  <span className={styles.stepIndex} aria-hidden="true">
                    Step {index + 1}
                  </span>
                  {step.title}
                </h3>
                <p className={styles.stepText}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.footerNote}>
          <h2 className={styles.footerTitle}>Ready to start at step one?</h2>
          <p>
            Send us your requirement and we will come back to you with a plan covering headcount,
            roles, shift coverage and a realistic deployment date.
          </p>
          <div className={styles.footerActions}>
            <Link className="btn btnPrimary" to="/request-manpower">
              Request Manpower
            </Link>
            <Link className="btn btnOutline" to="/contact">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
