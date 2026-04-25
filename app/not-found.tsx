import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-32 pb-32">
          <Container size="narrow">
            <div className="flex items-center gap-3 mb-8 text-sm uppercase tracking-widest text-foreground-muted font-mono">
              <span className="inline-block h-px w-10 bg-secondary" />
              <span>404 · Not found</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight mb-6">
              That page got lost in a refactor.
            </h1>
            <p className="text-lg leading-relaxed text-foreground-muted mb-10 max-w-2xl">
              The URL you followed doesn&apos;t exist on this site, or it moved when I
              rebuilt the place. The home page and the blog index are both still where you
              left them.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary-dark transition-colors"
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center px-5 py-2.5 border border-border text-foreground text-sm font-semibold rounded-md hover:bg-background-alt transition-colors"
              >
                Read the blog
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
