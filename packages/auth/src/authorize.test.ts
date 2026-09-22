import { describe, expect, it } from "vitest";
import {
  AuthorizationError,
  authorize,
  hasAdminRole,
  hasPermission,
  resolvePermissions,
  type AuthorizationContext,
} from "./authorize";
import { PERMISSIONS } from "./permissions";

const player: AuthorizationContext = {
  userId: "user_player",
  assignments: [{ role: "player", scopeType: "CLUB", scopeId: null }],
};

const coachTeamA: AuthorizationContext = {
  userId: "user_coach",
  assignments: [{ role: "coach", scopeType: "TEAM", scopeId: "team_a" }],
};

const board: AuthorizationContext = {
  userId: "user_board",
  assignments: [{ role: "board", scopeType: "CLUB", scopeId: null }],
};

const admin: AuthorizationContext = {
  userId: "user_admin",
  assignments: [{ role: "admin", scopeType: "CLUB", scopeId: null }],
};

describe("RBAC defaults", () => {
  it("does not treat a player as admin because a client hid a button", () => {
    expect(hasAdminRole(player)).toBe(false);
    expect(hasPermission(player, PERMISSIONS.ROLES_MANAGE)).toBe(false);
    expect(hasPermission(player, PERMISSIONS.MEMBERS_MANAGE)).toBe(false);
    expect(hasPermission(player, PERMISSIONS.SETTINGS_MANAGE)).toBe(false);
  });

  it("lets a player read training but not manage club-wide training", () => {
    expect(hasPermission(player, PERMISSIONS.TRAINING_READ)).toBe(true);
    expect(hasPermission(player, PERMISSIONS.TRAINING_WRITE)).toBe(true);
    expect(hasPermission(player, PERMISSIONS.TRAINING_MANAGE)).toBe(false);
  });

  it("does not give board technical admin permissions by default", () => {
    expect(hasPermission(board, PERMISSIONS.MEMBERS_MANAGE)).toBe(true);
    expect(hasPermission(board, PERMISSIONS.BOARD_MANAGE)).toBe(true);
    expect(hasPermission(board, PERMISSIONS.ROLES_MANAGE)).toBe(false);
    expect(hasPermission(board, PERMISSIONS.SETTINGS_MANAGE)).toBe(false);
    expect(hasPermission(board, PERMISSIONS.USERS_DELETE)).toBe(false);
    expect(hasAdminRole(board)).toBe(false);
  });

  it("gives admin every catalogued permission", () => {
    expect(hasAdminRole(admin)).toBe(true);
    expect(hasPermission(admin, PERMISSIONS.ROLES_MANAGE)).toBe(true);
    expect(hasPermission(admin, PERMISSIONS.USERS_DELETE)).toBe(true);
    expect(hasPermission(admin, PERMISSIONS.SETTINGS_MANAGE)).toBe(true);
  });
});

describe("scoped coach access", () => {
  it("does not grant club-wide manage from a team-scoped coach role", () => {
    expect(hasPermission(coachTeamA, PERMISSIONS.TRAINING_MANAGE)).toBe(false);
    expect(hasPermission(coachTeamA, PERMISSIONS.PLAYERS_WRITE)).toBe(false);
  });

  it("allows a team-scoped coach to manage their own team only", () => {
    expect(
      hasPermission(coachTeamA, PERMISSIONS.TRAINING_MANAGE, {
        type: "team",
        id: "team_a",
      }),
    ).toBe(true);
    expect(
      hasPermission(coachTeamA, PERMISSIONS.TRAINING_MANAGE, {
        type: "team",
        id: "team_b",
      }),
    ).toBe(false);
  });

  it("allows a team-scoped coach to write players on their roster only", () => {
    expect(
      hasPermission(coachTeamA, PERMISSIONS.PLAYERS_WRITE, {
        type: "player",
        teamIds: ["team_a"],
      }),
    ).toBe(true);
    expect(
      hasPermission(coachTeamA, PERMISSIONS.PLAYERS_WRITE, {
        type: "player",
        teamIds: ["team_b"],
      }),
    ).toBe(false);
  });
});

describe("direct permission exceptions", () => {
  it("lets DENY override a role grant", () => {
    const restrictedBoard: AuthorizationContext = {
      ...board,
      extraPermissions: [
        {
          permission: PERMISSIONS.MEMBERS_MANAGE,
          effect: "DENY",
          scopeType: "CLUB",
          scopeId: null,
        },
      ],
    };

    expect(hasPermission(restrictedBoard, PERMISSIONS.MEMBERS_MANAGE)).toBe(false);
    expect(hasPermission(restrictedBoard, PERMISSIONS.BOARD_READ)).toBe(true);
  });

  it("lets GRANT add a single permission without making the user admin", () => {
    const streamLead: AuthorizationContext = {
      ...player,
      extraPermissions: [
        {
          permission: PERMISSIONS.STREAMING_MANAGE,
          effect: "GRANT",
          scopeType: "CLUB",
          scopeId: null,
        },
      ],
    };

    expect(hasPermission(streamLead, PERMISSIONS.STREAMING_MANAGE)).toBe(true);
    expect(hasPermission(streamLead, PERMISSIONS.ROLES_MANAGE)).toBe(false);
    expect(hasAdminRole(streamLead)).toBe(false);
  });
});

describe("authorize", () => {
  it("throws a client-safe error when access is denied", () => {
    expect(() => authorize(player, PERMISSIONS.ROLES_MANAGE)).toThrow(AuthorizationError);
    expect(() => authorize(player, PERMISSIONS.ROLES_MANAGE)).toThrow(
      "Du har ikke tilgang til denne handlingen.",
    );
  });

  it("does not throw when the permission is present", () => {
    expect(() => authorize(admin, PERMISSIONS.ROLES_MANAGE)).not.toThrow();
  });
});

describe("resolvePermissions", () => {
  it("does not leak team-scoped permissions into an unscoped club check", () => {
    const resolved = resolvePermissions(coachTeamA, { type: "club" });

    expect(resolved.has(PERMISSIONS.TRAINING_MANAGE)).toBe(false);
    expect(resolved.has(PERMISSIONS.TEAMS_READ)).toBe(false);
  });
});
