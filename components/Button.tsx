import type { ReactNode } from 'react';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost';

const styles: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-dark focus:ring-primary',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary-dark focus:ring-secondary',
  ghost:
    'border border-border bg-transparent text-foreground hover:bg-background-alt focus:ring-primary',
};

export function Button({
  href,
  children,
  variant = 'primary',
  external = false,
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}) {
  const base =
    'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background';
  const cls = `${base} ${styles[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
