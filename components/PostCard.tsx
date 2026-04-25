import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PostMeta } from '@/lib/blog';
import { formatDate } from '@/lib/blog';

export function PostCard({ post, compact = false }: { post: PostMeta; compact?: boolean }) {
  const { slug, frontmatter, readingMinutes } = post;
  return (
    <Link
      href={`/blog/${slug}`}
      className="group block py-7 border-b border-border-light last:border-b-0"
    >
      <div className="flex items-center gap-3 mb-2 text-xs uppercase tracking-widest font-mono text-foreground-muted">
        <time dateTime={frontmatter.publishDate}>{formatDate(frontmatter.publishDate)}</time>
        {frontmatter.category && (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-secondary font-semibold">{frontmatter.category}</span>
          </>
        )}
        <span aria-hidden="true">·</span>
        <span>{readingMinutes} min read</span>
      </div>
      <h3
        className={`font-heading font-bold tracking-tight mb-2 group-hover:text-primary transition-colors ${
          compact ? 'text-xl' : 'text-2xl md:text-3xl'
        }`}
      >
        {frontmatter.title}
      </h3>
      {frontmatter.excerpt && (
        <p className={`leading-relaxed text-foreground-muted ${compact ? 'text-sm' : 'text-base'} max-w-2xl`}>
          {frontmatter.excerpt}
        </p>
      )}
      <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
        Read post
        <ArrowRight size={14} strokeWidth={2.5} />
      </div>
    </Link>
  );
}
