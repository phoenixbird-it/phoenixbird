import type { ReactNode } from 'react';
import styles from './Form.module.scss';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: (props: {
    id: string;
    'aria-invalid': boolean | undefined;
    'aria-describedby': string | undefined;
    className: string;
  }) => ReactNode;
}

/**
 * Labelled form control wrapper. Wires up `aria-invalid` / `aria-describedby`
 * and renders field-level errors (client-side or from ApiError.fieldErrors).
 */
export default function FormField({
  id,
  label,
  required = false,
  error,
  hint,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className={styles.required}>
              {' '}
              *
            </span>
            <span className="srOnly"> (required)</span>
          </>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy || undefined,
        className: `${styles.control} ${error ? styles.controlError : ''}`,
      })}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
