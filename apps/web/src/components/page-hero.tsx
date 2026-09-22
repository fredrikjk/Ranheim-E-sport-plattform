import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, children }: PageHeroProps) {
  return (
    <header className="section">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="page-title">{title}</h1>
      {children ? <div className="lead">{children}</div> : null}
    </header>
  );
}
