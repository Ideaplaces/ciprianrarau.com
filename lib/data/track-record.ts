export type TrackRecordItem = {
  slug: string;
  name: string;
  years: string;
  role: string;
  outcome: string;
};

export const TRACK_RECORD: TrackRecordItem[] = [
  {
    slug: 'wisk',
    name: 'WISK.ai',
    years: '2016–2025',
    role: 'CTO / CPO, Co-Founder',
    outcome:
      '1,000+ restaurant clients. Multi-million dollar revenue. Nearly 9 years of full-time building, hiring, fundraising, scaling. The company is still serving paying customers today.',
  },
  {
    slug: 'omsignal',
    name: 'OMsignal',
    years: '2012–2014',
    role: 'VP Engineering, 1st employee',
    outcome:
      'Bio-sensing wearables. Raised over $10M. Acquired by Honeywell. Built the engineering org from one person.',
  },
  {
    slug: 'eastern-bank',
    name: 'Eastern Bank',
    years: '2015–2016',
    role: 'Head of Mobile',
    outcome: 'Mobile banking. PWC-approved security audit. Enterprise-grade compliance.',
  },
  {
    slug: 'fractional',
    name: 'Advisor stretch',
    years: '2021–2024',
    role: 'CTO Advisor',
    outcome:
      'XpertSea (aquaculture), Alveole (urban beekeeping), and others. Architecture, React Native, AWS, Python. Each engagement widened the lens that powers IdeaPlaces today.',
  },
];
