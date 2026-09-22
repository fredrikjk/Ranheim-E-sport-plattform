import { describe, expect, it } from "vitest";
import { ApiError, toErrorResponse } from "./errors";

describe("toErrorResponse", () => {
  it("maps known API errors without leaking internals", () => {
    const mapped = toErrorResponse(new ApiError("FORBIDDEN", 403));

    expect(mapped.status).toBe(403);
    expect(mapped.body.error.code).toBe("FORBIDDEN");
    expect(mapped.body.error.message).not.toMatch(/prisma|stack|sql/i);
  });

  it("hides unexpected errors from the client", () => {
    const mapped = toErrorResponse(new Error("Prisma query failed on relation UserRole"));

    expect(mapped.status).toBe(500);
    expect(mapped.body.error.code).toBe("INTERNAL");
    expect(mapped.body.error.message).toBe("Noe gikk galt. Prøv igjen.");
    expect(JSON.stringify(mapped.body)).not.toContain("Prisma");
  });
});
