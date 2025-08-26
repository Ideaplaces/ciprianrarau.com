import BlogTags from 'components/Blog/BlogTags'
import Panel from 'components/Panel'
import { parseISO } from 'date-fns'
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from 'lib/blog'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import blogStyles from 'styles/blog-content.module.css'
import styles from 'styles/wordpress-content.module.css'
import { BlogPost } from 'types/blog'

interface BlogPostPageProps {
  post: BlogPost
  relatedPosts: BlogPost[]
  locale: string
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({
  post,
  relatedPosts,
  locale,
}) => {
  // Handle both Date objects and ISO strings
  const parsedDate =
    typeof post.publishDate === 'string'
      ? parseISO(post.publishDate)
      : post.publishDate

  // Check if date is valid to prevent crashes
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime())
  const safeDate = isValidDate ? parsedDate : new Date('2020-01-01') // Fallback for invalid dates

  return (
    <>
      <Head>
        <title>{post.title} - Mentorly Blog</title>
        <meta name="description" content={post.excerpt || post.title} />

        {/* Robots meta tag for draft posts */}
        {post.draft && <meta name="robots" content="noindex" />}

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://mentorly.com/${locale}/blog/${post.slug}`}
        />

        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://mentorly.com/${locale}/blog/${post.slug}`}
        />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="og:site_name" content="Mentorly" />

        {/* Article specific */}
        <meta
          property="article:published_time"
          content={safeDate.toISOString()}
        />
        {post.author && (
          <meta property="article:author" content={post.author} />
        )}
        {post.category && (
          <meta property="article:section" content={post.category.title} />
        )}
        {post.tags &&
          post.tags.map((tag) => (
            <meta key={tag.slug} property="article:tag" content={tag.title} />
          ))}

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.title} />
        {post.image && <meta name="twitter:image" content={post.image} />}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt || post.title,
              image: post.image,
              author: {
                '@type': 'Organization',
                name: post.author || 'Mentorly Team',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Mentorly',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://mentorly.com/logo.png',
                },
              },
              datePublished: safeDate.toISOString(),
              dateModified: safeDate.toISOString(),
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://mentorly.com/${locale}/blog/${post.slug}`,
              },
            }),
          }}
        />
      </Head>
      <Panel>
        <Panel.Container>
          <article className="max-w-4xl mx-auto py-12">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-8">
                <time dateTime={safeDate.toISOString()}>
                  {safeDate.toLocaleDateString()}
                </time>
                {post.author && (
                  <>
                    <span className="mx-2">·</span>
                    <span>{post.author}</span>
                  </>
                )}
                {post.readingTime && (
                  <>
                    <span className="mx-2">·</span>
                    <span>{post.readingTime} min read</span>
                  </>
                )}
              </div>
            </header>

            {/* Draft Disclaimer */}
            {post.draft && (
              <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Draft Article
                    </h3>
                    <div className="mt-1 text-sm text-yellow-700">
                      <p>
                        This is a draft version of this blog post and has not
                        been published yet. Content may be incomplete or subject
                        to changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            <div
              className={`prose prose-lg max-w-none dark:prose-invert prose-p:mb-6 prose-headings:mt-8 prose-headings:mb-4 ${
                post.contentType === 'markdown' ? blogStyles.blogContent : ''
              }`}
            >
              {post.contentType === 'html' ? (
                <div
                  dangerouslySetInnerHTML={{ __html: post.content || '' }}
                  className={styles.wordpressContent}
                />
              ) : (
                <ReactMarkdown
                  components={{
                    pre({ node, children, ...props }) {
                      // Check if this pre contains a mermaid code block
                      const codeElement = children?.[0]
                      if (
                        codeElement &&
                        typeof codeElement === 'object' &&
                        'props' in codeElement &&
                        codeElement.props?.className?.includes(
                          'language-mermaid'
                        )
                      ) {
                        // Hide the entire pre block for mermaid since we use static images
                        return null
                      }

                      return <pre {...props}>{children}</pre>
                    },
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      const language = match ? match[1] : ''

                      // Hide mermaid blocks since we use static images now
                      if (!inline && language === 'mermaid') {
                        return null
                      }

                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {post.content || ''}
                </ReactMarkdown>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <BlogTags tags={post.tags} locale={locale} />
              </div>
            )}
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="max-w-4xl mx-auto py-12 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="group">
                    <a
                      href={`/${locale}/blog/${relatedPost.slug}`}
                      className="block"
                    >
                      {relatedPost.image && (
                        <div className="mb-4">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-48 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.excerpt && (
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                          {relatedPost.excerpt}
                        </p>
                      )}
                    </a>
                  </article>
                ))}
              </div>
            </section>
          )}
        </Panel.Container>
      </Panel>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllPostSlugs()

  const paths = []
  for (const slug of slugs) {
    paths.push({ params: { locale: 'en', slug } })
    paths.push({ params: { locale: 'fr', slug } })
  }

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const locale = params?.locale as string
  const slug = params?.slug as string

  try {
    const post = await getPostBySlug(slug)

    if (!post) {
      return {
        notFound: true,
      }
    }

    const relatedPosts = await getRelatedPosts(post, 4)

    return {
      props: {
        locale,
        post: JSON.parse(JSON.stringify(post)),
        relatedPosts: JSON.parse(JSON.stringify(relatedPosts)),
      },
      revalidate: 3600,
    }
  } catch (error) {
    console.error('Error loading blog post:', error)
    return {
      notFound: true,
    }
  }
}

export default BlogPostPage
