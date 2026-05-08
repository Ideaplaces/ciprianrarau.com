import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { CatalogProductCard } from '@/components/CatalogProductCard';
import { fetchAllCatalogs } from '@/lib/catalog/fetcher';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'The IdeaPlaces product portfolio: focused SaaS tools built from real problems seen across multiple companies.',
  alternates: {
    canonical: 'https://ciprianrarau.com/projects',
  },
};

export default async function ProjectsPage() {
  const catalogs = await fetchAllCatalogs();

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'IdeaPlaces Products',
    numberOfItems: catalogs.length,
    itemListElement: catalogs.map((catalog, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: catalog.name,
      url: catalog.url,
      description: catalog.description,
    })),
  };

  return (
    <>
      <Header />
      <main>
        <section className="pt-20 pb-12 md:pt-28">
          <Container size="wide">
            <div className="flex items-center gap-3 mb-8 text-sm uppercase tracking-widest text-foreground-muted font-mono">
              <span className="inline-block h-px w-10 bg-secondary" />
              <span>Projects</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-8 max-w-3xl">
              The IdeaPlaces portfolio.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-foreground-muted max-w-2xl">
              Each one started as a pattern I kept hitting across multiple
              companies. Three instances of the same problem becomes a product.
              This list is the live source from{' '}
              <a
                href="https://ideaplaces.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:text-primary-dark"
              >
                ideaplaces.com
              </a>
              .
            </p>
          </Container>
        </section>

        <Section size="wide" className="pt-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {catalogs.map((catalog) => (
              <CatalogProductCard key={catalog.slug} catalog={catalog} />
            ))}
          </div>
        </Section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      </main>
      <Footer />
    </>
  );
}
