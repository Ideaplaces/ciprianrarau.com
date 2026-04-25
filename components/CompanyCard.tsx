import { ArrowUpRight } from 'lucide-react';
import type { Company } from '@/lib/data/companies';

export function CompanyCard({ company }: { company: Company }) {
  const Wrapper = company.url ? 'a' : 'div';
  const wrapperProps = company.url
    ? { href: company.url, target: '_blank' as const, rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`group flex flex-col p-6 bg-background-alt border border-border-light rounded-lg transition-colors ${company.url ? 'hover:border-primary hover:bg-surface' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-heading font-bold text-lg tracking-tight mb-0.5">
            {company.name}
          </h3>
          <div className="text-xs uppercase tracking-widest text-secondary font-mono font-semibold">
            {company.role}
          </div>
        </div>
        {company.url && (
          <ArrowUpRight
            size={16}
            className="text-foreground-muted group-hover:text-primary transition-colors mt-1"
            strokeWidth={2}
          />
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground-muted">{company.context}</p>
    </Wrapper>
  );
}
