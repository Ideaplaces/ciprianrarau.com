import Link from 'next/link';
import { Container } from './Container';

const COLUMNS = [
  {
    title: 'Site',
    links: [
      { href: '/', label: 'Home' },
      { href: '/projects', label: 'Projects' },
      { href: '/blog', label: 'Blog' },
      { href: '/about', label: 'About' },
      { href: '/cv', label: 'CV' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Building',
    links: [
      { href: 'https://c3.ideaplaces.com', label: 'C3', external: true },
      { href: 'https://styleguide.ideaplaces.com', label: 'Style Guide', external: true },
      {
        href: 'https://ideaplaces.com/products/hirescout',
        label: 'HireScout',
        external: true,
      },
      { href: 'https://ideaplaces.com', label: 'IdeaPlaces', external: true },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { href: 'https://chiprarau.substack.com', label: 'Substack', external: true },
      { href: 'https://github.com/crarau', label: 'GitHub', external: true },
      {
        href: 'https://www.linkedin.com/in/cipricode/',
        label: 'LinkedIn',
        external: true,
      },
      { href: '/rss.xml', label: 'RSS' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border-light bg-background-alt">
      <Container size="wide" className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary">
                <svg width="20" height="20" viewBox="0 0 32 32" aria-hidden="true">
                  <path
                    d="M 21 9.5 A 8 8 0 1 0 21 22.5"
                    stroke="#F5F4F1"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="font-heading font-bold tracking-tight">Ciprian Rarau</span>
            </Link>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Founder, building a portfolio of products. Across my own ventures and the
              companies I build with.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-xs uppercase tracking-widest text-foreground-muted font-mono mb-4">
                {col.title}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border-light flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-foreground-muted">
          <div>© {new Date().getFullYear()} Ciprian Rarau. All quietly built.</div>
          <div className="font-mono">Clay &amp; Code · v2</div>
        </div>
      </Container>
    </footer>
  );
}
