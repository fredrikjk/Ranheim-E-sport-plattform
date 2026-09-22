import type { RoleScopeType } from "@ranheim/types";
import { DEFAULT_ROLE_PERMISSIONS, ROLE_SLUGS, type RoleSlug } from "./roles";
import { PERMISSIONS, type Permission } from "./permissions";

export type PermissionEffect = "GRANT" | "DENY";

export interface RoleAssignment {
  role: RoleSlug;
  scopeType: RoleScopeType;
  scopeId: string | null;
}

export interface DirectPermission {
  permission: Permission;
  effect: PermissionEffect;
  scopeType: RoleScopeType;
  scopeId: string | null;
}

export interface AuthorizationContext {
  userId: string;
  assignments: readonly RoleAssignment[];
  extraPermissions?: readonly DirectPermission[];
}

export type AuthorizationResource =
  | { type: "club" }
  | { type: "team"; id: string }
  | { type: "player"; teamIds: readonly string[] };

export class AuthorizationError extends Error {
  readonly code = "FORBIDDEN" as const;

  constructor(message = "Du har ikke tilgang til denne handlingen.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

function resourceMatches(
  scopeType: RoleScopeType,
  scopeId: string | null,
  resource: AuthorizationResource,
): boolean {
  if (scopeType === "CLUB") {
    return true;
  }

  if (!scopeId) {
    return false;
  }

  if (resource.type === "team") {
    return resource.id === scopeId;
  }

  if (resource.type === "player") {
    return resource.teamIds.includes(scopeId);
  }

  return false;
}

export function resolvePermissions(
  context: AuthorizationContext,
  resource: AuthorizationResource = { type: "club" },
): Set<Permission> {
  const granted = new Set<Permission>();
  const denied = new Set<Permission>();

  for (const assignment of context.assignments) {
    if (!resourceMatches(assignment.scopeType, assignment.scopeId, resource)) {
      continue;
    }

    for (const permission of DEFAULT_ROLE_PERMISSIONS[assignment.role]) {
      granted.add(permission);
    }
  }

  for (const extra of context.extraPermissions ?? []) {
    if (!resourceMatches(extra.scopeType, extra.scopeId, resource)) {
      continue;
    }

    if (extra.effect === "DENY") {
      denied.add(extra.permission);
    } else {
      granted.add(extra.permission);
    }
  }

  for (const permission of denied) {
    granted.delete(permission);
  }

  return granted;
}

export function hasPermission(
  context: AuthorizationContext,
  permission: Permission,
  resource: AuthorizationResource = { type: "club" },
): boolean {
  return resolvePermissions(context, resource).has(permission);
}

export function authorize(
  context: AuthorizationContext,
  permission: Permission,
  resource: AuthorizationResource = { type: "club" },
): void {
  if (!hasPermission(context, permission, resource)) {
    throw new AuthorizationError();
  }
}

export function hasClubRole(context: AuthorizationContext, role: RoleSlug): boolean {
  return context.assignments.some(
    (assignment) => assignment.role === role && assignment.scopeType === "CLUB",
  );
}

/**
 * Convenience helper. Never persist `isAdmin` as the only access flag.
 * Callers must still authorize the concrete permission for the action.
 */
export function hasAdminRole(context: AuthorizationContext): boolean {
  return hasClubRole(context, ROLE_SLUGS.ADMIN);
}

export function canAccessTeam(context: AuthorizationContext, teamId: string): boolean {
  return hasPermission(context, PERMISSIONS.TEAMS_READ, { type: "team", id: teamId });
}
