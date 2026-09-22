import { describe, expect, it } from 'vitest';
import { assertProductionSecrets, loadEnv } from './index';

describe('loadEnv', () => {
  it('accepts a local foundation environment without production secrets', () => {
    const env = loadEnv({
      NODE_ENV: 'development',
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
    });

    expect(env.OTP_PROVIDER).toBe('dev');
  });
});

describe('assertProductionSecrets', () => {
  it('rejects the development OTP provider in production', () => {
    expect(() =>
      assertProductionSecrets(
        loadEnv({
          NODE_ENV: 'production',
          AUTH_SECRET: 'a'.repeat(32),
          OTP_PROVIDER: 'dev',
        }),
      ),
    ).toThrow(/OTP_PROVIDER=dev/);
  });

  it('rejects production without AUTH_SECRET', () => {
    expect(() =>
      assertProductionSecrets(
        loadEnv({
          NODE_ENV: 'production',
          OTP_PROVIDER: 'twilio',
        }),
      ),
    ).toThrow(/AUTH_SECRET/);
  });
});
