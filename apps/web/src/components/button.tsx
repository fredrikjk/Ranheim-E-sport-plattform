import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './button.module.scss';

type ButtonVariant = 'primary' | 'ghost';

interface CommonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

interface ButtonAsButton extends CommonProps {
  href?: undefined;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

interface ButtonAsLink extends CommonProps {
  href: string;
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const variant = props.variant ?? 'primary';
  const className = [styles.button, styles[variant], props.className]
    .filter(Boolean)
    .join(' ');

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={className}>
        {props.children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;

  return (
    <button
      className={className}
      type={buttonProps.type ?? 'button'}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
    >
      {props.children}
    </button>
  );
}
