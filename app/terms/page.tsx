import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of use for ciprianrarau.com.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-20 pb-20">
          <Container size="narrow">
            <div className="flex items-center gap-3 mb-8 text-sm uppercase tracking-widest text-foreground-muted font-mono">
              <span className="inline-block h-px w-10 bg-secondary" />
              <span>Legal</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-10">
              Terms of Use
            </h1>
            <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-a:text-primary">
              <p>
                <em>Last updated: April 2026.</em>
              </p>
              <p>
                This is a personal site. The blog posts, opinions, and ideas here are mine.
                They are shared in good faith but without warranty of any kind. Use the
                information as inspiration, not as a contract.
              </p>
              <h2>Content</h2>
              <p>
                Blog posts and articles are released under a permissive read-and-share
                attitude: feel free to quote with attribution and a link back. If you want to
                republish in full, ask first.
              </p>
              <h2>Code samples</h2>
              <p>
                Snippets in blog posts are MIT-style: use them, adapt them, ship them. They
                come with no warranty. Read them before you run them.
              </p>
              <h2>Liability</h2>
              <p>
                Nothing on this site constitutes legal, financial, or medical advice. Treat
                technical content as a starting point, not a guarantee.
              </p>
              <h2>Questions</h2>
              <p>
                Reach out at <a href="mailto:chip@ideaplaces.com">chip@ideaplaces.com</a>.
              </p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
