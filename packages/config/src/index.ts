import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  AUTH_COOKIE_NAME: z.string().default("ranheim_session"),
  OTP_PROVIDER: z.enum(["dev", "twilio"]).default("dev"),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_CLUB_NAME: z.string().default("Ranheim E-sport"),
  TWITCH_CLIENT_ID: z.string().optional(),
  TWITCH_CLIENT_SECRET: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  return envSchema.parse(source);
}

export function assertProductionSecrets(env: AppEnv): void {
  if (env.NODE_ENV !== "production") {
    return;
  }

  if (!env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is required in production.");
  }

  if (env.OTP_PROVIDER === "dev") {
    throw new Error("OTP_PROVIDER=dev is not allowed in production.");
  }
}
