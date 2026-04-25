export type Company = {
  slug: string;
  name: string;
  role: string;
  context: string;
  url?: string;
};

export const ACTIVE_COMPANIES: Company[] = [
  {
    slug: 'mentorly',
    name: 'Mentorly',
    role: 'CTO / CPO',
    context:
      'AI mentorship platform. LLM-powered mentor matching at scale. Building the technical and product side end to end.',
    url: 'https://mentorly.com',
  },
  {
    slug: 'eli-health',
    name: 'Eli Health',
    role: 'Technical Advisor',
    context:
      'Digital health: telehealth and AI clinical decision support. Cross-region BigQuery, GA4 streaming, Datastream CDC, regulated data flows.',
    url: 'https://eli.health',
  },
  {
    slug: 'catalyzeup',
    name: 'CatalyzeUP',
    role: 'Founder',
    context:
      'Startup infrastructure services. Making startups go farther, faster: production-grade infra, CI/CD, monitoring from day one.',
  },
  {
    slug: 'wehappers',
    name: 'WeHappers',
    role: 'Co-Founder',
    context:
      'Non-profit. Wealth redistribution and global happiness through technology.',
  },
];
