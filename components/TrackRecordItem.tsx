import type { TrackRecordItem as TR } from '@/lib/data/track-record';

export function TrackRecordItem({ item }: { item: TR }) {
  return (
    <article className="grid grid-cols-[110px_1fr] md:grid-cols-[140px_1fr] gap-6 py-7 border-b border-border-light last:border-b-0">
      <div className="font-mono text-xs uppercase tracking-widest text-foreground-muted pt-1 whitespace-nowrap">
        {item.years}
      </div>
      <div>
        <h3 className="font-heading font-bold text-xl tracking-tight mb-0.5">{item.name}</h3>
        <div className="text-sm text-secondary font-semibold mb-2">{item.role}</div>
        <p className="text-sm leading-relaxed text-foreground-muted max-w-2xl">
          {item.outcome}
        </p>
      </div>
    </article>
  );
}
