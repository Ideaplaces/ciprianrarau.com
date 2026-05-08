/**
 * Shared Product Catalog schema (mirror of ideaplaces-website/src/lib/catalog-schema.ts).
 *
 * Each IdeaPlaces product publishes /api/catalog. Both ideaplaces.com and
 * ciprianrarau.com consume the same federated source so the two stay in sync
 * automatically. Add a product to the manifest below and it shows up in both
 * places on the next rebuild.
 *
 * Hand-rolled validation (no zod) to avoid adding a runtime dependency.
 */

export type ProductStatus = 'live' | 'beta' | 'coming-soon' | 'archived';
export type ProductCurrency = 'USD' | 'EUR' | 'CAD';
export type PricingPeriod = 'month' | 'year' | 'one-time' | null;

export type Feature = {
  title: string;
  body: string;
  icon?: string;
};

export type Cta = {
  label: string;
  href: string;
};

export type PricingTier = {
  name: string;
  price: number;
  period?: PricingPeriod;
  features: string[];
  cta?: Cta;
  highlighted?: boolean;
};

export type Pricing = {
  currency: ProductCurrency;
  tiers: PricingTier[];
};

export type Theme = {
  primary?: string;
  accent?: string;
  background?: string;
};

export type ProductLinks = {
  docs?: string;
  github?: string;
  api?: string;
  changelog?: string;
};

export type ProductCatalog = {
  $schema: 1;
  name: string;
  slug: string;
  status: ProductStatus;
  url: string;
  tagline: string;
  description: string;
  category?: string;
  features: Feature[];
  pricing?: Pricing;
  theme?: Theme;
  screenshot?: string;
  ogImage?: string;
  cta?: Cta;
  links?: ProductLinks;
};

const VALID_STATUSES: ProductStatus[] = ['live', 'beta', 'coming-soon', 'archived'];

function isString(v: unknown): v is string {
  return typeof v === 'string' && v.length > 0;
}

function isFeature(v: unknown): v is Feature {
  if (!v || typeof v !== 'object') return false;
  const f = v as Record<string, unknown>;
  return isString(f.title) && isString(f.body);
}

export function parseCatalog(input: unknown): ProductCatalog | null {
  if (!input || typeof input !== 'object') return null;
  const o = input as Record<string, unknown>;
  if (o.$schema !== 1) return null;
  if (!isString(o.name) || !isString(o.slug) || !isString(o.url)) return null;
  if (!isString(o.tagline) || !isString(o.description)) return null;
  if (typeof o.status !== 'string' || !VALID_STATUSES.includes(o.status as ProductStatus)) {
    return null;
  }
  const features = Array.isArray(o.features) ? o.features.filter(isFeature) : [];
  return {
    $schema: 1,
    name: o.name,
    slug: o.slug,
    status: o.status as ProductStatus,
    url: o.url,
    tagline: o.tagline,
    description: o.description,
    category: isString(o.category) ? o.category : undefined,
    features,
    pricing: o.pricing as Pricing | undefined,
    theme: o.theme as Theme | undefined,
    screenshot: isString(o.screenshot) ? o.screenshot : undefined,
    ogImage: isString(o.ogImage) ? o.ogImage : undefined,
    cta: o.cta as Cta | undefined,
    links: o.links as ProductLinks | undefined,
  };
}

export function fallbackCatalog(input: {
  name: string;
  slug: string;
  url: string;
  tagline?: string;
  status?: ProductStatus;
  description?: string;
  category?: string;
  features?: Feature[];
  cta?: Cta;
}): ProductCatalog {
  return {
    $schema: 1,
    name: input.name,
    slug: input.slug,
    status: input.status ?? 'coming-soon',
    url: input.url,
    tagline: input.tagline ?? 'Product information loading.',
    description:
      input.description ??
      'This product catalog could not be loaded at build time. It will appear once the product endpoint is reachable.',
    category: input.category,
    features: input.features ?? [],
    cta: input.cta,
  };
}
