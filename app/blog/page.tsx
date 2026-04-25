import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { PostCard } from '@/components/PostCard';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Production stories, infrastructure decisions, and the patterns that show up across every company I build with.',
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main>
        <section className="pt-20 pb-16 md:pt-28">
          <Container>
            <div className="flex items-center gap-3 mb-8 text-sm uppercase tracking-widest text-foreground-muted font-mono">
              <span className="inline-block h-px w-10 bg-secondary" />
              <span>Blog · {posts.length} posts</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight mb-6">
              Notes from the work.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-foreground-muted max-w-2xl">
              Production stories, infrastructure decisions, and the patterns that show up across
              every company I build with. No theory. The blog is where the patterns get written
              down before they become products.
            </p>
          </Container>
        </section>
        <section className="pb-20">
          <Container>
            <div>
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
