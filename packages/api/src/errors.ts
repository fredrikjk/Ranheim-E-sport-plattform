export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "CONFLICT"
  | "INTERNAL";

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}

const userMessages: Record<ApiErrorCode, string> = {
  BAD_REQUEST: "Forespørselen er ugyldig.",
  UNAUTHORIZED: "Du må logge inn for å fortsette.",
  FORBIDDEN: "Du har ikke tilgang til denne handlingen.",
  NOT_FOUND: "Vi fant ikke det du lette etter.",
  RATE_LIMITED: "For mange forsøk. Vent litt og prøv igjen.",
  CONFLICT: "Handlingen kunne ikke fullføres.",
  INTERNAL: "Noe gikk galt. Prøv igjen.",
};

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, status: number, message?: string) {
    super(message ?? userMessages[code]);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }

  toBody(): ApiErrorBody {
    return {
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}

export function toErrorResponse(error: unknown): { status: number; body: ApiErrorBody } {
  if (error instanceof ApiError) {
    return { status: error.status, body: error.toBody() };
  }

  return {
    status: 500,
    body: {
      error: {
        code: "INTERNAL",
        message: userMessages.INTERNAL,
      },
    },
  };
}
