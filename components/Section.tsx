import type { ReactNode } from 'react';
import { Container } from './Container';

export function Section({
  children,
  id,
  eyebrow,
  title,
  intro,
  size = 'default',
  className = '',
}: {
  children: ReactNode;
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  size?: 'narrow' | 'default' | 'wide';
  className?: string;
}) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <Container size={size}>
        {(eyebrow || title || intro) && (
          <header className="mb-12 max-w-2xl">
            {eyebrow && (
              <div className="flex items-center gap-3 mb-4 text-sm uppercase tracking-widest text-foreground-muted font-mono">
                <span className="inline-block h-px w-10 bg-secondary" />
                <span>{eyebrow}</span>
              </div>
            )}
            {title && (
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                {title}
              </h2>
            )}
            {intro && (
              <p className="text-lg leading-relaxed text-foreground-muted">{intro}</p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
