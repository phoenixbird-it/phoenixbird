import type { ReactNode } from 'react';
import type { AsyncStatus } from '../../hooks/useAsyncData';
import styles from './DataState.module.scss';

interface DataStateProps<T> {
  status: AsyncStatus;
  data: T[] | null;
  error?: string | null;
  /** Message shown when the request succeeded but returned nothing. */
  emptyMessage: string;
  loadingLabel?: string;
  /** Number of skeleton cards to show while loading. */
  skeletonCount?: number;
  onRetry?: () => void;
  children: (items: T[]) => ReactNode;
}

/**
 * Renders loading skeletons, a friendly error panel or an empty-state notice,
 * handing off to `children` only once there is data to show.
 */
export default function DataState<T>({
  status,
  data,
  error,
  emptyMessage,
  loadingLabel = 'Loading…',
  skeletonCount = 3,
  onRetry,
  children,
}: DataStateProps<T>) {
  if (status === 'loading') {
    return (
      <div className={styles.skeletonGrid} role="status" aria-live="polite">
        <span className="srOnly">{loadingLabel}</span>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className={styles.skeleton} aria-hidden="true">
            <div className={styles.skeletonMedia} />
            <div className={styles.skeletonLine} />
            <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
          </div>
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.notice} role="alert">
        <p>
          {error ??
            'We could not load this information right now. Please refresh the page or contact us directly.'}
        </p>
        {onRetry ? (
          <button type="button" className="btn btnOutline" onClick={onRetry}>
            Try again
          </button>
        ) : null}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return <>{children(data)}</>;
}
