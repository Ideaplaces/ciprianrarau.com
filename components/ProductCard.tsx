import { ArrowUpRight } from 'lucide-react';
import { type Product, STATUS_LABEL } from '@/lib/data/products';

const ACCENT_BG: Record<NonNullable<Product['accent']>, string> = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
};

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const accentBg = product.accent ? ACCENT_BG[product.accent] : 'bg-clay-300 text-foreground';
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col p-7 bg-surface border border-border-light rounded-xl transition-all hover:border-primary hover:shadow-md ${featured ? 'min-h-[280px]' : 'min-h-[200px]'}`}
    >
      <div className="flex items-center justify-between mb-5">
        <span className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 text-[10px] uppercase tracking-widest font-mono font-semibold rounded ${accentBg}`}>
          {STATUS_LABEL[product.status]}
        </span>
        <ArrowUpRight
          size={18}
          className="text-foreground-muted group-hover:text-primary transition-colors"
          strokeWidth={2}
        />
      </div>
      <div className="flex-1">
        <h3 className={`font-heading font-bold tracking-tight mb-1.5 ${featured ? 'text-2xl' : 'text-xl'}`}>
          {product.name}
        </h3>
        <div className="text-sm font-medium text-secondary mb-3">{product.tagline}</div>
        <p className="text-sm leading-relaxed text-foreground-muted">
          {product.description}
        </p>
      </div>
    </a>
  );
}
