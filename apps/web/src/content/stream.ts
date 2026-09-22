import type { LiveStreamStatus } from '@ranheim/types';

/**
 * Public live status. Twitch Helix is wired in MVP slice 7.
 * This function is the only place the public site reads stream state from,
 * so the UI never talks to Twitch with a client secret.
 */
export async function getPublicStreamStatus(): Promise<LiveStreamStatus> {
  return {
    isLive: false,
    title: null,
    gameName: null,
    streamerDisplayName: null,
    viewerCount: null,
    startedAt: null,
    url: null,
  };
}
