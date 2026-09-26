import type { ReactNode } from 'react';
import styles from './SectionHeading.module.scss';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: 'left' | 'center';
  /** Heading level — keeps the h1→h2→h3 hierarchy correct per page. */
  as?: 'h2' | 'h3';
  id?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Tag = 'h2',
  id,
}: SectionHeadingProps) {
  return (
    <div className={`${styles.wrap} ${align === 'center' ? styles.center : ''}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <Tag id={id} className={styles.title}>
        {title}
      </Tag>
      {description ? <p className={`lede ${styles.description}`}>{description}</p> : null}
    </div>
  );
}
