import { z } from "zod";

export const otpRequestSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/, "Oppgi telefonnummer i E.164-format, for eksempel +4791234567."),
});

export const otpVerifySchema = otpRequestSchema.extend({
  code: z.string().regex(/^\d{6}$/, "Oppgi den sekssifrede koden."),
});

export type OtpRequest = z.infer<typeof otpRequestSchema>;
export type OtpVerify = z.infer<typeof otpVerifySchema>;
