import type { Industry } from '../../types';
import MediaImage from '../MediaImage/MediaImage';
import styles from './IndustryCard.module.scss';

interface IndustryCardProps {
  industry: Industry;
  /** Long description is only shown on the dedicated Industries page. */
  detailed?: boolean;
}

export default function IndustryCard({ industry, detailed = false }: IndustryCardProps) {
  const summary = industry.short_description || industry.description;

  return (
    <article className={styles.card}>
      <MediaImage
        src={industry.image}
        alt={`Manpower services for ${industry.name}`}
        label={industry.name}
        className={styles.media}
      />
      <div className={styles.body}>
        <h3 className={styles.title}>{industry.name}</h3>
        {summary ? <p className={styles.text}>{summary}</p> : null}
        {detailed && industry.description && industry.description !== summary ? (
          <p className={styles.text}>{industry.description}</p>
        ) : null}
      </div>
    </article>
  );
}
