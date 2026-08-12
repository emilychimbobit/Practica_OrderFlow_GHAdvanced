import React from 'react';
import styles from './ErrorAlert.module.css';

interface ErrorAlertProps {
  error: Error | string | null;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className={styles.alert} role="alert" aria-live="assertive">
      <div className={styles.content}>
        <span className={styles.icon}>⚠️</span>
        <p className={styles.message}>{message}</p>
      </div>
      {onDismiss && (
        <button
          className={styles.closeButton}
          onClick={onDismiss}
          aria-label="Cerrar alerta"
        >
          ✕
        </button>
      )}
    </div>
  );
};
