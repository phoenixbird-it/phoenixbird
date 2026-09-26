import type { ReactNode } from 'react';
import styles from './Form.module.scss';

interface FormAlertProps {
  tone: 'success' | 'error';
  title: string;
  children?: ReactNode;
}

export default function FormAlert({ tone, title, children }: FormAlertProps) {
  return (
    <div
      className={`${styles.alert} ${tone === 'success' ? styles.alertSuccess : styles.alertError}`}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      <h3 className={styles.alertTitle}>{title}</h3>
      {children}
    </div>
  );
}
