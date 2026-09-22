import type { ClubRoleSlug } from "@ranheim/types";
import { ALL_PERMISSIONS, PERMISSIONS, type Permission } from "./permissions";

export const ROLE_SLUGS = {
  PLAYER: "player",
  COACH: "coach",
  BOARD: "board",
  ADMIN: "admin",
} as const;

export type RoleSlug = (typeof ROLE_SLUGS)[keyof typeof ROLE_SLUGS];

const playerPermissions: Permission[] = [
  PERMISSIONS.PLAYERS_READ,
  PERMISSIONS.TEAMS_READ,
  PERMISSIONS.TRAINING_READ,
  PERMISSIONS.TRAINING_WRITE,
  PERMISSIONS.STATISTICS_READ,
  PERMISSIONS.STREAMING_READ,
  PERMISSIONS.EVENTS_READ,
];

const coachPermissions: Permission[] = [
  ...playerPermissions,
  PERMISSIONS.PLAYERS_WRITE,
  PERMISSIONS.COACHES_READ,
  PERMISSIONS.STATISTICS_WRITE,
  PERMISSIONS.TRAINING_MANAGE,
  PERMISSIONS.TEAMS_WRITE,
];

const boardPermissions: Permission[] = [
  PERMISSIONS.USERS_READ,
  PERMISSIONS.PLAYERS_READ,
  PERMISSIONS.PLAYERS_WRITE,
  PERMISSIONS.COACHES_READ,
  PERMISSIONS.COACHES_WRITE,
  PERMISSIONS.TEAMS_READ,
  PERMISSIONS.TEAMS_WRITE,
  PERMISSIONS.TEAMS_MANAGE,
  PERMISSIONS.MEMBERS_READ,
  PERMISSIONS.MEMBERS_MANAGE,
  PERMISSIONS.ROLES_READ,
  PERMISSIONS.STATISTICS_READ,
  PERMISSIONS.TRAINING_READ,
  PERMISSIONS.STREAMING_READ,
  PERMISSIONS.SPONSORS_READ,
  PERMISSIONS.SPONSORS_MANAGE,
  PERMISSIONS.EVENTS_READ,
  PERMISSIONS.EVENTS_WRITE,
  PERMISSIONS.BOARD_READ,
  PERMISSIONS.BOARD_MANAGE,
  PERMISSIONS.AUDIT_READ,
];

export const DEFAULT_ROLE_PERMISSIONS: Record<RoleSlug, readonly Permission[]> = {
  player: playerPermissions,
  coach: coachPermissions,
  board: boardPermissions,
  admin: ALL_PERMISSIONS,
};

export function isRoleSlug(value: string): value is RoleSlug {
  return value in DEFAULT_ROLE_PERMISSIONS;
}

export function assertRoleSlug(value: ClubRoleSlug | RoleSlug): RoleSlug {
  if (!isRoleSlug(value)) {
    throw new Error(`Unknown role slug: ${value}`);
  }

  return value;
}
