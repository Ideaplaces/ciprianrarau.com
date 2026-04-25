export type ProductStatus = 'live' | 'open-source' | 'beta' | 'launching-soon' | 'coming-soon';

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: ProductStatus;
  url: string;
  accent?: 'primary' | 'secondary' | 'accent';
};

export const FEATURED_PRODUCTS: Product[] = [
  {
    slug: 'c3',
    name: 'C3',
    tagline: 'Cloud Claude Code',
    description:
      'Open-source remote Claude Code sessions plus autonomous agents triggered by Slack and Discord. The agent investigates production errors, opens PRs, and replies in Slack while you keep moving.',
    status: 'open-source',
    url: 'https://c3.ideaplaces.com',
    accent: 'primary',
  },
  {
    slug: 'styleguide',
    name: 'Style Guide',
    tagline: 'Design system generator',
    description:
      'Describe a brand in one paragraph. Get four palette variations with typography, spacing, and shadows. Export to Tailwind, CSS, SCSS, TypeScript, Swift, Android, or Style Dictionary.',
    status: 'live',
    url: 'https://styleguide.ideaplaces.com',
    accent: 'secondary',
  },
  {
    slug: 'hirescout',
    name: 'HireScout',
    tagline: 'Faster, sharper hiring',
    description:
      'Cuts the resume-to-shortlist loop down by an order of magnitude. Built because every founder I work with hits the same hiring bottleneck.',
    status: 'beta',
    url: 'https://ideaplaces.com/products/hirescout',
    accent: 'accent',
  },
];

export const MORE_PRODUCTS: Product[] = [
  {
    slug: 'monday2github',
    name: 'monday2github',
    tagline: 'Zero-effort task sync',
    description:
      'GitHub events update Monday.com boards automatically. Stop copy-pasting between your code and your project tracker.',
    status: 'launching-soon',
    url: 'https://ideaplaces.com/products/monday2github',
  },
  {
    slug: 'impact-pulse',
    name: 'ImpactPulse',
    tagline: 'Surveys at scale',
    description:
      'Survey and feedback collection for non-profits and mission-driven teams. Built under CatalyzeUP.',
    status: 'coming-soon',
    url: 'https://ideaplaces.com/products/impact-pulse',
  },
  {
    slug: 'wealthplan',
    name: 'WealthPlan',
    tagline: 'Long-term wealth, less spreadsheet',
    description:
      'Personal financial planning that respects how complicated real life actually is.',
    status: 'coming-soon',
    url: 'https://ideaplaces.com/products/wealthplan',
  },
];

export const STATUS_LABEL: Record<ProductStatus, string> = {
  live: 'Live',
  'open-source': 'Open Source',
  beta: 'Beta',
  'launching-soon': 'Launching Soon',
  'coming-soon': 'Coming Soon',
};
