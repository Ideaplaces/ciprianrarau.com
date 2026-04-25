import type { Metadata } from 'next';
import { Download, Mail } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';

export const metadata: Metadata = {
  title: 'CV',
  description:
    '25+ years across founding, scaling, and shipping. The track record behind the products.',
};

const SUMMARY =
  "I find a real problem, build the system that solves it, and scale it until it runs without me. The product changes; the instinct doesn't.";

const EXPERIENCE = [
  {
    years: '2025 — Now',
    role: 'Founder',
    org: 'IdeaPlaces',
    location: 'Montreal, Canada',
    bullets: [
      'Active product portfolio: C3, monday2github, Style Guide, ImpactPulse, HireScout, WealthPlan.',
      'Shared DevOps repo, Azure Container Apps, encrypted Key Vault secrets, CI/CD from commit one.',
      'Open-source: C3 runs autonomous Claude Code agents triggered from Slack and Discord.',
    ],
  },
  {
    years: '2025 — Now',
    role: 'CTO / CPO',
    org: 'Mentorly',
    location: 'Montreal, Canada',
    bullets: [
      'AI mentorship platform with LLM-powered mentor matching at scale.',
      'Building technical and product organisation end to end.',
    ],
  },
  {
    years: '2025 — Now',
    role: 'Technical Advisor',
    org: 'Eli Health',
    location: 'Montreal, Canada',
    bullets: [
      'Telehealth and AI clinical decision support.',
      'Cross-region BigQuery + Datastream CDC, GA4 streaming, regulated data infrastructure.',
    ],
  },
  {
    years: '2016 — 2025',
    role: 'CTO / CPO, Co-Founder',
    org: 'WISK.ai',
    location: 'Montreal, Canada',
    bullets: [
      'Food and beverage intelligence for restaurants. Scaled from zero to 1000+ paying clients.',
      'Multi-million dollar revenue. Raised capital, built the team, owned production for nearly a decade.',
      'Architected the data pipeline that processes millions of inventory transactions.',
    ],
  },
  {
    years: '2024 — Now',
    role: 'Founder',
    org: 'CatalyzeUP',
    location: 'Remote',
    bullets: [
      'Startup infrastructure services. Production-grade infra, CI/CD, monitoring from day one.',
    ],
  },
  {
    years: '2024 — Now',
    role: 'Co-Founder',
    org: 'WeHappers',
    location: 'Remote',
    bullets: [
      'Non-profit. Wealth redistribution and global happiness through technology.',
    ],
  },
  {
    years: '2021 — 2024',
    role: 'CTO Advisor',
    org: 'XpertSea, Alveole, and others',
    location: 'Multiple',
    bullets: [
      'Architecture, React Native, AWS, Python.',
      'Each engagement widened the lens that powers the IdeaPlaces portfolio today.',
    ],
  },
  {
    years: '2015 — 2016',
    role: 'Head of Mobile',
    org: 'Eastern Bank',
    location: 'Boston, USA',
    bullets: ['Mobile banking. PWC-approved security audit. Enterprise-grade compliance.'],
  },
  {
    years: '2012 — 2014',
    role: 'VP Engineering, 1st Employee',
    org: 'OMsignal',
    location: 'Montreal, Canada',
    bullets: [
      'Bio-sensing wearables. Raised $10M+. Acquired by Honeywell.',
      'Built the engineering organisation from one person.',
    ],
  },
  {
    years: '2014 — 2016',
    role: 'Founder',
    org: 'IdeaPlaces (v1)',
    location: 'Montreal, Canada',
    bullets: [
      'Location-based notes. 25,000+ downloads. Evernote and Dropbox integration.',
    ],
  },
];

const EXPERTISE = [
  {
    title: 'Architecture & Infrastructure',
    items: [
      'Multi-cloud (AWS, Azure, GCP)',
      'Containers, Kubernetes, Container Apps',
      'Terraform, IaC, GitHub Actions',
      'BigQuery, PostgreSQL, Datastream CDC',
      'Production monitoring and observability',
    ],
  },
  {
    title: 'Product & Engineering',
    items: [
      'Full-stack: TypeScript, React, Next.js, Node, Python',
      'Mobile: React Native, native iOS/Android',
      'AI tooling: Claude Code, LLM apps, RAG, MCP',
      'Data pipelines and analytics',
      'Spec-driven development with AI',
    ],
  },
  {
    title: 'Leadership',
    items: [
      'Hiring and growing engineering teams from zero',
      'Fundraising (raised over $10M cumulative)',
      'Partnership with sales, product, and operations',
      'Crisis response and incident management',
      'Stakeholder communication at the board level',
    ],
  },
];

const EDUCATION = [
  {
    years: '1998 — 2003',
    degree: 'Computer Science',
    school: 'Technical University of Cluj-Napoca',
    location: 'Romania',
  },
];

export default function CVPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-16 pb-8 md:pt-20">
          <Container size="narrow">
            <div className="flex items-center gap-3 mb-8 text-sm uppercase tracking-widest text-foreground-muted font-mono">
              <span className="inline-block h-px w-10 bg-secondary" />
              <span>Curriculum Vitae</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <h1 className="font-heading text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-3">
                  Ciprian (Chip) Rarau
                </h1>
                <p className="text-lg leading-relaxed text-foreground-muted max-w-2xl">
                  {SUMMARY}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 print:hidden shrink-0">
                <a
                  href="/resume.pdf"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary-dark transition-colors"
                  download
                >
                  <Download size={14} strokeWidth={2.5} />
                  Download PDF
                </a>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-foreground-muted">
              <a
                href="mailto:chip@ideaplaces.com"
                className="inline-flex items-center gap-1.5 hover:text-primary"
              >
                <Mail size={14} />
                chip@ideaplaces.com
              </a>
              <span aria-hidden="true">·</span>
              <a href="https://ciprianrarau.com" className="hover:text-primary">
                ciprianrarau.com
              </a>
              <span aria-hidden="true">·</span>
              <a href="https://github.com/crarau" className="hover:text-primary">
                github.com/crarau
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="https://www.linkedin.com/in/cipricode/"
                className="hover:text-primary"
              >
                LinkedIn
              </a>
            </div>
          </Container>
        </section>

        <section className="py-12 border-t border-border-light">
          <Container size="narrow">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight mb-8 uppercase tracking-widest text-foreground-muted text-xs font-mono">
              Experience
            </h2>
            <div className="space-y-10">
              {EXPERIENCE.map((job) => (
                <article
                  key={`${job.org}-${job.years}`}
                  className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-6"
                >
                  <div className="font-mono text-xs uppercase tracking-widest text-foreground-muted pt-1 whitespace-nowrap">
                    {job.years}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg tracking-tight">
                      {job.role}
                      <span className="text-secondary"> · {job.org}</span>
                    </h3>
                    <div className="text-xs uppercase tracking-widest text-foreground-muted font-mono mb-3">
                      {job.location}
                    </div>
                    <ul className="space-y-1.5">
                      {job.bullets.map((b) => (
                        <li
                          key={b}
                          className="text-sm leading-relaxed text-foreground-muted flex items-start"
                        >
                          <span className="text-secondary mr-2.5 mt-0.5">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-12 border-t border-border-light bg-background-alt">
          <Container size="narrow">
            <h2 className="text-xs font-mono uppercase tracking-widest text-foreground-muted mb-8">
              Areas of expertise
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {EXPERTISE.map((g) => (
                <div key={g.title}>
                  <h3 className="font-heading font-bold text-base tracking-tight mb-3">
                    {g.title}
                  </h3>
                  <ul className="space-y-1.5">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm leading-relaxed text-foreground-muted flex items-start"
                      >
                        <span className="text-secondary mr-2.5 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-12 border-t border-border-light">
          <Container size="narrow">
            <h2 className="text-xs font-mono uppercase tracking-widest text-foreground-muted mb-8">
              Education
            </h2>
            {EDUCATION.map((e) => (
              <div
                key={e.school}
                className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-6"
              >
                <div className="font-mono text-xs uppercase tracking-widest text-foreground-muted pt-1 whitespace-nowrap">
                  {e.years}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg tracking-tight">{e.degree}</h3>
                  <div className="text-secondary font-semibold text-sm">{e.school}</div>
                  <div className="text-xs uppercase tracking-widest text-foreground-muted font-mono mt-1">
                    {e.location}
                  </div>
                </div>
              </div>
            ))}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
