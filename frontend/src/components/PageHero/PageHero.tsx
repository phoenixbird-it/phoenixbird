import type { ReactNode } from 'react';
import styles from './PageHero.module.scss';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

/** Dark navy banner used as the <h1> header of every inner page. */
export default function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <header className={styles.hero}>
      <div className="container">
        {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
        <h1 className={styles.title}>{title}</h1>
        {description ? <p className={styles.description}>{description}</p> : null}
        {children ? <div className={styles.actions}>{children}</div> : null}
      </div>
    </header>
  );
}
