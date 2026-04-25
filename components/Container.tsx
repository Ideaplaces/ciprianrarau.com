import type { ReactNode } from 'react';

export function Container({
  children,
  size = 'default',
  className = '',
}: {
  children: ReactNode;
  size?: 'narrow' | 'default' | 'wide';
  className?: string;
}) {
  const max =
    size === 'narrow' ? 'max-w-2xl' : size === 'wide' ? 'max-w-7xl' : 'max-w-5xl';
  return <div className={`${max} mx-auto px-6 ${className}`}>{children}</div>;
}
