import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { Button } from '@/components/Button';
import { ProductCard } from '@/components/ProductCard';
import { CompanyCard } from '@/components/CompanyCard';
import { TrackRecordItem } from '@/components/TrackRecordItem';
import { FEATURED_PRODUCTS, MORE_PRODUCTS } from '@/lib/data/products';
import { ACTIVE_COMPANIES } from '@/lib/data/companies';
import { TRACK_RECORD } from '@/lib/data/track-record';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <MoreProducts />
        <Companies />
        <BlogTeaser />
        <TrackRecord />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="pt-20 pb-24 md:pt-28 md:pb-32">
      <Container>
        <div className="flex items-center gap-3 mb-8 text-sm uppercase tracking-widest text-foreground-muted font-mono">
          <span className="inline-block h-px w-10 bg-secondary" />
          <span>Ciprian (Chip) Rarau · Founder</span>
        </div>
        <h1 className="font-heading text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-8 max-w-4xl">
          I run a portfolio of products.
        </h1>
        <p className="text-xl md:text-2xl leading-relaxed text-foreground-muted max-w-2xl mb-10">
          Across my own ventures and the companies I build with, the same problems keep
          showing up. Three instances of the same problem becomes a product.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="#building">See what I&apos;m building</Button>
          <Button href="/blog" variant="ghost">
            Read the blog
          </Button>
        </div>
      </Container>
    </section>
  );
}

function FeaturedProducts() {
  return (
    <Section
      id="building"
      eyebrow="What I'm building now"
      title="Three products in motion"
      intro="Each one started as a pattern I kept hitting across multiple companies. Three instances of the same problem becomes a product."
      size="wide"
    >
      <div className="grid md:grid-cols-3 gap-5">
        {FEATURED_PRODUCTS.map((p) => (
          <ProductCard key={p.slug} product={p} featured />
        ))}
      </div>
    </Section>
  );
}

function MoreProducts() {
  return (
    <Section
      eyebrow="More from IdeaPlaces"
      title="The list keeps growing"
      intro="More products in flight. New ones land here as they ship."
      size="wide"
      className="bg-background-alt border-y border-border-light"
    >
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {MORE_PRODUCTS.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      <div className="mt-10 text-sm text-foreground-muted">
        More on the company page at{' '}
        <a
          href="https://ideaplaces.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold hover:text-primary-dark"
        >
          ideaplaces.com
        </a>
        .
      </div>
    </Section>
  );
}

function Companies() {
  return (
    <Section
      eyebrow="Companies I'm building with"
      title="Parallel builds"
      intro="In any given week I'm shipping with several teams. The lens is wider than any one industry. The pattern is what carries."
      size="wide"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        {ACTIVE_COMPANIES.map((c) => (
          <CompanyCard key={c.slug} company={c} />
        ))}
      </div>
    </Section>
  );
}

function BlogTeaser() {
  return (
    <Section
      eyebrow="Latest from the blog"
      title="Notes from the work"
      intro="Production stories, not theory. The blog is where the patterns get written down before they become products."
    >
      <div className="rounded-xl border border-border-light bg-surface p-10 text-center">
        <p className="text-foreground-muted">
          Blog posts migrate in Phase 5. The full archive is preserved in
          <code className="font-mono mx-1 text-secondary">_legacy-astro/src/data/post/</code>
          on this branch.
        </p>
      </div>
    </Section>
  );
}

function TrackRecord() {
  return (
    <Section
      eyebrow="Track record"
      title="25 years, one instinct"
      intro="Find a real problem. Build the system that solves it. Scale it until it runs without you. The product changes. The instinct doesn't."
      size="wide"
      className="bg-background-alt border-y border-border-light"
    >
      <div>
        {TRACK_RECORD.map((item) => (
          <TrackRecordItem key={item.slug} item={item} />
        ))}
      </div>
    </Section>
  );
}

function Newsletter() {
  return (
    <Section size="narrow">
      <div className="rounded-xl border border-border bg-surface p-10">
        <div className="flex items-center gap-3 mb-3 text-sm uppercase tracking-widest text-foreground-muted font-mono">
          <span className="inline-block h-px w-10 bg-secondary" />
          <span>Newsletter</span>
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight mb-3">
          One short note when something ships.
        </h2>
        <p className="text-foreground-muted mb-6 leading-relaxed">
          No marketing. No drip sequences. A short note when a product ships, a blog
          post lands, or I notice a pattern worth sharing.
        </p>
        <p className="text-sm text-foreground-muted">
          Sign-up form wires up in Phase 6 (Resend audience already provisioned).
        </p>
      </div>
    </Section>
  );
}
