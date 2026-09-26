import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncStatus = 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  /** User-facing error message; never a raw stack trace. */
  error: string | null;
  reload: () => void;
}

/**
 * Runs an async fetcher on mount (and whenever `deps` change) and exposes
 * loading / success / error state. Failures are swallowed into a friendly
 * message so pages keep rendering when the API is unreachable.
 *
 * `fetcher` should be a stable reference or defined inline together with the
 * `deps` that it closes over.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: ReadonlyArray<unknown> = [],
  errorMessage = 'We could not load this information right now. Please refresh the page or contact us directly.',
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setError(null);

    fetcherRef
      .current()
      .then((result) => {
        if (!active) return;
        setData(result);
        setStatus('success');
      })
      .catch(() => {
        if (!active) return;
        setData(null);
        setError(errorMessage);
        setStatus('error');
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, errorMessage, ...deps]);

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  return { data, status, error, reload };
}
