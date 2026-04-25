import { getAllPosts } from '@/lib/blog';

const SITE = 'https://ciprianrarau.com';
const TITLE = 'Ciprian (Chip) Rarau';
const DESCRIPTION =
  'Notes from the work: production stories, infrastructure decisions, and the patterns that show up across every company I build with.';

function escape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function GET(): Response {
  const posts = getAllPosts();
  const items = posts
    .map((p) => {
      const link = `${SITE}/blog/${p.slug}`;
      const pubDate = new Date(p.frontmatter.publishDate).toUTCString();
      return `    <item>
      <title>${escape(p.frontmatter.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${p.frontmatter.author ? `<dc:creator>${escape(p.frontmatter.author)}</dc:creator>` : ''}
      ${p.frontmatter.category ? `<category>${escape(p.frontmatter.category)}</category>` : ''}
      <description>${escape(p.frontmatter.excerpt ?? '')}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(TITLE)}</title>
    <link>${SITE}</link>
    <description>${escape(DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
