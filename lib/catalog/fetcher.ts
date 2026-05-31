/**
 * Federated product catalog fetcher (mirror of ideaplaces-website/src/lib/catalog.ts).
 *
 * The PRODUCT_MANIFEST below MUST match ideaplaces.com's manifest. When you
 * add or remove a product, change it in both places. The two sites read the
 * same /api/catalog endpoints, so the rendered content stays in sync without
 * any extra plumbing.
 */

import {
  Cta,
  Feature,
  ProductCatalog,
  ProductStatus,
  fallbackCatalog,
  parseCatalog,
} from './schema';

export interface ProductManifestEntry {
  slug: string;
  catalogUrl: string;
  fallback: {
    name: string;
    url: string;
    tagline?: string;
    status?: ProductStatus;
    description?: string;
    category?: string;
    features?: Feature[];
    cta?: Cta;
  };
}

export const PRODUCT_MANIFEST: ProductManifestEntry[] = [
  {
    slug: 'styleguide',
    catalogUrl: 'https://styleguide.ideaplaces.com/api/catalog',
    fallback: {
      name: 'Style Guide',
      url: 'https://styleguide.ideaplaces.com',
      tagline: 'Describe your brand, get a complete design system.',
    },
  },
  {
    slug: 'wealthplan',
    catalogUrl: 'https://wealthplan.ideaplaces.com/api/catalog',
    fallback: {
      name: 'WealthPlan',
      url: 'https://wealthplan.ideaplaces.com',
      tagline:
        'Canadian mortgage vs. investment simulator — find the strategy that builds the most wealth.',
    },
  },
  {
    slug: 'monday2github',
    catalogUrl: 'https://monday2github.ideaplaces.com/api/catalog',
    fallback: {
      name: 'monday2github',
      url: 'https://monday2github.ideaplaces.com',
      tagline: 'Your Monday.com board updates itself as code ships.',
    },
  },
  {
    slug: 'c3',
    catalogUrl: 'https://c3.ideaplaces.com/api/catalog',
    fallback: {
      name: 'C3',
      url: 'https://c3.ideaplaces.com',
      tagline:
        'An open-source AI agent that runs on your dev machine and does your work while you sleep.',
    },
  },
  {
    slug: 'hirescout',
    catalogUrl: 'https://hirescout.ideaplaces.com/api/catalog',
    fallback: {
      name: 'HireScout',
      url: 'https://hirescout.ideaplaces.com',
      tagline:
        'Pull your ATS pipeline, enrich every candidate, and rank them against the job you actually posted.',
    },
  },
  {
    slug: 'digitizer',
    catalogUrl: 'https://digitizer.ideaplaces.com/api/catalog',
    fallback: {
      name: 'Digitizer',
      url: 'https://digitizer.ideaplaces.com',
      tagline: "If you can read it, it will be digitized. Even when you can't.",
      status: 'live',
      category: 'Document AI',
      description:
        'Drop in a PDF or image — printed, scanned, faxed, rotated, multilingual, even handwritten — get back clean structured JSON. A hybrid pipeline combines classical OCR with a vision-language model so each step uses the cheapest tool that solves it correctly. API-key authenticated and agent-ready.',
      features: [
        {
          title: 'Handles anything you point at it',
          body: 'Handwritten cursive, sideways scans, smudged receipts, faxes, multilingual invoices, free-form letters. No template, no schema, no labels required.',
        },
        {
          title: 'Structured JSON, not OCR text',
          body: 'Every field is named, typed, and tied to a bounding box on the source page. Items become tables, lists stay lists, prose stays prose.',
        },
        {
          title: 'Agent-ready',
          body: 'API-key authenticated. An LLM agent can upload a document, consume the JSON, and act on it without a browser in the loop.',
        },
      ],
      cta: {
        label: 'Try it with your PDF',
        href: 'https://digitizer.ideaplaces.com',
      },
    },
  },
  {
    slug: 'oneops',
    catalogUrl: 'https://oneops.cloud/api/catalog',
    fallback: {
      name: 'OneOps',
      url: 'https://oneops.cloud',
      tagline: 'A manifesto for founders running scale-ups.',
      status: 'live',
      category: 'Manifesto + practice',
      description:
        'We are no longer writing code. We are summoning it. OneOps is the practice that makes the summoning reliable. Declare the company in code. Let AI flow into every space the structure reveals. Humans return to the work only humans can do.',
      features: [
        {
          title: 'Predictable first',
          body: 'Deterministic code as the default. Infrastructure, identity, secrets, source control all declared.',
        },
        {
          title: 'AI second, in fixed roles',
          body: 'AI deployed only where the specification declares it.',
        },
        {
          title: 'Agents for the outliers',
          body: 'Triggered by unpredictable events the deterministic system cannot handle.',
        },
      ],
      cta: {
        label: 'Read the manifesto',
        href: 'https://oneops.cloud/manifesto',
      },
    },
  },
];

async function fetchWithTimeout(url: string, ms = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 300 },
      headers: { accept: 'application/json' },
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchCatalog(slug: string): Promise<ProductCatalog> {
  const entry = PRODUCT_MANIFEST.find((p) => p.slug === slug);
  if (!entry) {
    throw new Error(`Unknown product slug: ${slug}`);
  }

  try {
    const res = await fetchWithTimeout(entry.catalogUrl);
    if (!res.ok) {
      console.warn(`[catalog] ${entry.catalogUrl} returned ${res.status}, using fallback`);
      return fallbackCatalog({ slug: entry.slug, ...entry.fallback });
    }
    const json = await res.json();
    const parsed = parseCatalog(json);
    if (!parsed) {
      console.warn(`[catalog] Invalid catalog from ${entry.catalogUrl}`);
      return fallbackCatalog({ slug: entry.slug, ...entry.fallback });
    }
    if (parsed.slug !== entry.slug) {
      console.warn(
        `[catalog] Slug mismatch from ${entry.catalogUrl}: got "${parsed.slug}", expected "${entry.slug}"`,
      );
      return { ...parsed, slug: entry.slug };
    }
    return parsed;
  } catch (err) {
    console.warn(`[catalog] Falling back for ${slug}:`, (err as Error).message);
    return fallbackCatalog({ slug: entry.slug, ...entry.fallback });
  }
}

export async function fetchAllCatalogs(): Promise<ProductCatalog[]> {
  const results = await Promise.all(
    PRODUCT_MANIFEST.map((entry) => fetchCatalog(entry.slug)),
  );
  return results;
}
