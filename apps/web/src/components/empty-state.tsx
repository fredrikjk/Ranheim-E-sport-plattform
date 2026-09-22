import type { ReactNode } from 'react';
import styles from './empty-state.module.scss';

interface EmptyStateProps {
  title: string;
  children: ReactNode;
}

export function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}
