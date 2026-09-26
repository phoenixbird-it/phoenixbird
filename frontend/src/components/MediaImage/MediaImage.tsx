import { useState } from 'react';
import { resolveMediaUrl } from '../../utils/media';
import styles from './MediaImage.module.scss';

interface MediaImageProps {
  src: string | null;
  alt: string;
  /** Shown inside the placeholder tile when there is no usable image. */
  label: string;
  ratio?: 'wide' | 'square';
  className?: string;
}

/**
 * Renders an API image. Renders nothing when the `image` field is null or
 * the file fails to load, so cards without a photo fall back to their text
 * content instead of a filler tile.
 */
export default function MediaImage({
  src,
  alt,
  ratio = 'wide',
  className = '',
}: MediaImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveMediaUrl(src);

  if (!resolved || failed) {
    return null;
  }

  const classes = `${styles.frame} ${ratio === 'square' ? styles.square : styles.wide} ${className}`;

  return (
    <div className={classes}>
      <img src={resolved} alt={alt} loading="lazy" onError={() => setFailed(true)} />
    </div>
  );
}
