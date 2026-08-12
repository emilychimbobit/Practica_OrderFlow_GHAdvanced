import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando...'
}) => {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
};
