import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { TrackRecordItem } from '@/components/TrackRecordItem';
import { TRACK_RECORD } from '@/lib/data/track-record';

export const metadata: Metadata = {
  title: 'About',
  description:
    "I find a real problem, build the system that solves it, and scale it until it runs without me. The product changes; the instinct doesn't.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-20 pb-12 md:pt-28">
          <Container size="narrow">
            <div className="flex items-center gap-3 mb-8 text-sm uppercase tracking-widest text-foreground-muted font-mono">
              <span className="inline-block h-px w-10 bg-secondary" />
              <span>About</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-8">
              25 years, one instinct.
            </h1>
            <div className="space-y-5 text-lg leading-relaxed text-foreground-muted">
              <p>
                The same instinct has driven everything: find a real problem, build the system
                that solves it, scale it until it runs without you.
              </p>
              <p>
                At <strong className="text-foreground">WISK.ai</strong>, it was restaurant
                operators drowning in manual inventory counts. The solution became a platform
                used by over 1,000 restaurants, generating multi-million dollar revenue, backed
                by investors. At <strong className="text-foreground">OMsignal</strong>, it
                was making sense of biometric data from wearable shirts. That product was
                acquired by Honeywell.
              </p>
              <p>
                The pattern is always the same: observe a broken process, build the
                infrastructure, ship something that works, then make it work for thousands. The
                product changes. The instinct doesn&apos;t.
              </p>
              <p>
                Today I run{' '}
                <a
                  href="https://ideaplaces.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:text-primary-dark"
                >
                  IdeaPlaces
                </a>
                : a portfolio of indie tools and AI products. Every product started as a
                pattern observed across multiple companies. Three instances of the same
                problem becomes a product.
              </p>
            </div>
          </Container>
        </section>

        <Section
          eyebrow="Track record"
          title="The work that funds the present"
          intro="Built and scaled. Acquired and exited. Advised and rebuilt. Each one widened the lens that powers what's shipping now."
          size="wide"
          className="border-y border-border-light bg-background-alt"
        >
          <div>
            {TRACK_RECORD.map((item) => (
              <TrackRecordItem key={item.slug} item={item} />
            ))}
          </div>
        </Section>

        <section className="py-20">
          <Container size="narrow">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
              Want to compare notes?
            </h2>
            <p className="text-foreground-muted mb-6">
              If you are building something interesting and the patterns above sound familiar,
              I read every message.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary-dark transition-colors"
            >
              Send a message
            </Link>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
