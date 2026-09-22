import type { LiveStreamStatus } from '@ranheim/types';
import styles from './live-status.module.scss';

interface LiveStatusProps {
  stream: LiveStreamStatus;
}

export function LiveStatus({ stream }: LiveStatusProps) {
  if (stream.isLive) {
    return (
      <aside className={styles.panel} aria-live="polite">
        <p className={styles.live}>
          <span className={styles.dot} aria-hidden="true" />
          Live
        </p>
        <p className={styles.name}>{stream.streamerDisplayName ?? 'Ranheim E-sport'}</p>
        <p className={styles.game}>{stream.gameName ?? 'Sending'}</p>
        {stream.title ? <p className={styles.title}>{stream.title}</p> : null}
        {stream.url ? (
          <a className={styles.watch} href={stream.url} rel="noreferrer">
            Se stream
          </a>
        ) : null}
      </aside>
    );
  }

  return (
    <aside className={styles.panel} aria-live="polite">
      <p className={styles.offlineLabel}>Sending</p>
      <p className={styles.name}>Ingen stream er live nå</p>
      <p className={styles.title}>
        Når en spiller går live, vises status her. Twitch-koblingen kommer i
        neste MVP-slice, uten hemmeligheter i nettleseren.
      </p>
    </aside>
  );
}
