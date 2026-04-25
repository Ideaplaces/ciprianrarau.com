import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

const SITE = 'https://ciprianrarau.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/cv`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];
  const posts: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: new Date(p.frontmatter.updateDate ?? p.frontmatter.publishDate),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
  return [...staticRoutes, ...posts];
}
