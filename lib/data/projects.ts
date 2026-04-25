export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  era: 'present' | 'past';
  details: string[];
  href: string;
};

export const PROJECTS: Project[] = [
  {
    slug: 'ideaplaces',
    title: 'IdeaPlaces',
    subtitle: 'Product portfolio',
    image: '/projects/ideaplaces.png',
    era: 'present',
    details: [
      'Active incubator for indie tools',
      'C3, monday2github, Style Guide, ImpactPulse',
      'One DevOps repo, one design system, shared CI/CD',
      'Founder',
    ],
    href: 'https://ideaplaces.com',
  },
  {
    slug: 'mentorly',
    title: 'Mentorly',
    subtitle: 'AI-powered mentorship',
    image: '/projects/mentorly.png',
    era: 'present',
    details: [
      'LLM-powered mentor matching',
      'Career development at scale',
      'Enterprise knowledge circulation',
      'CTO / CPO',
    ],
    href: 'https://mentorly.com',
  },
  {
    slug: 'eli',
    title: 'Eli Health',
    subtitle: 'Hormone health tech',
    image: '/projects/eli.png',
    era: 'present',
    details: [
      'Cross-region BigQuery + Datastream CDC',
      'Telehealth + AI clinical decision support',
      'Regulated health data infrastructure',
      'Technical Advisor',
    ],
    href: 'https://eli.health',
  },
  {
    slug: 'catalyzeup',
    title: 'CatalyzeUP',
    subtitle: 'Startup infrastructure',
    image: '/projects/catalyzeup.png',
    era: 'present',
    details: [
      'Production-grade infra from day one',
      'Engineering services for startups',
      'CI/CD, monitoring, encrypted secrets',
      'Founder',
    ],
    href: 'https://catalyzeup.ai',
  },
  {
    slug: 'wehappers',
    title: 'WeHappers',
    subtitle: 'Wealth redistribution',
    image: '/projects/wehappers.png',
    era: 'present',
    details: [
      'Non-profit innovation',
      'Global happiness through technology',
      'Social impact platform',
      'Co-founder',
    ],
    href: 'https://wehappers.org',
  },
  {
    slug: 'wisk',
    title: 'WISK.ai',
    subtitle: 'Food & beverage intelligence',
    image: '/projects/wisk.png',
    era: 'past',
    details: [
      '1,000+ restaurant clients',
      'Multi-million dollar revenue',
      'Nearly 9 years of full-time building',
      'CTO / CPO, Co-founder',
    ],
    href: 'https://wisk.ai',
  },
  {
    slug: 'omsignal',
    title: 'OMsignal',
    subtitle: 'Bio-sensing wearables',
    image: '/projects/omsignal.png',
    era: 'past',
    details: [
      'Acquired by Honeywell',
      '$10M+ funding raised',
      'First employee, built the team from zero',
      'VP Engineering',
    ],
    href: '#',
  },
  {
    slug: 'xpertsea',
    title: 'XpertSea',
    subtitle: 'Aquaculture platform',
    image: '/projects/xpertsea.png',
    era: 'past',
    details: [
      'React Native + AWS architecture',
      'Technical leadership transition',
      'Multi-regional deployment',
      'CTO Advisor',
    ],
    href: '#',
  },
  {
    slug: 'easternbank',
    title: 'Eastern Bank',
    subtitle: 'Mobile banking',
    image: '/projects/easternbank.png',
    era: 'past',
    details: [
      'PWC security audit passed',
      'Enterprise mobile banking',
      'Banking API integration',
      'Head of Mobile',
    ],
    href: '#',
  },
  {
    slug: 'oneops',
    title: 'oneops',
    subtitle: 'Cloud-ops side project',
    image: '/projects/oneops.png',
    era: 'present',
    details: [
      'Multi-cloud ops dashboard',
      'Built alongside the day work',
      'Open early access',
      'Side project',
    ],
    href: 'https://oneops.cloud',
  },
];
