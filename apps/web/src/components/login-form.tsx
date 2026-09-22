'use client';

import { otpRequestSchema } from '@ranheim/api';
import { useState, type FormEvent } from 'react';
import { Button } from './button';
import styles from './login-form.module.scss';

export function LoginForm() {
  const [phone, setPhone] = useState('+47');
  const [message, setMessage] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = otpRequestSchema.safeParse({ phone });

    if (!parsed.success) {
      setInvalid(true);
      setMessage('Oppgi et gyldig mobilnummer i formatet +47XXXXXXXX.');
      return;
    }

    setInvalid(false);
    setMessage(
      'Innlogging er klargjort, men OTP-utsending er ikke aktiv i foundation. Telefon + engangskode kommer i neste slice.',
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <label htmlFor="phone">Telefonnummer</label>
      <input
        id="phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        aria-invalid={invalid}
        aria-describedby="phone-help"
      />
      <p id="phone-help" className={styles.help}>
        Primær innlogging er telefon og engangskode. Passord lagres ikke.
      </p>
      <Button type="submit">Send kode</Button>
      {message ? (
        <p className={styles.status} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
