import Link from 'next/link';
import { Container } from './Container';

const NAV = [
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-border-light">
      <Container size="wide" className="flex items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 font-heading font-bold tracking-tight shrink-0"
          aria-label="Ciprian Rarau home"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-primary shrink-0">
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <path
                d="M 21 9.5 A 8 8 0 1 0 21 22.5"
                stroke="#F5F4F1"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-base whitespace-nowrap">Ciprian Rarau</span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://ideaplaces.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 ml-1 px-3 py-2 text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors whitespace-nowrap"
          >
            IdeaPlaces
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </nav>
      </Container>
    </header>
  );
}
