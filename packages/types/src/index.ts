export type ClubRoleSlug = "player" | "coach" | "board" | "admin";

export type RoleScopeType = "CLUB" | "TEAM";

export type UserStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED";

export interface PublicSponsor {
  id: string;
  name: string;
  url: string | null;
  logoUrl: string | null;
  tier: string;
}

export interface LiveStreamStatus {
  isLive: boolean;
  title: string | null;
  gameName: string | null;
  streamerDisplayName: string | null;
  viewerCount: number | null;
  startedAt: string | null;
  url: string | null;
}
