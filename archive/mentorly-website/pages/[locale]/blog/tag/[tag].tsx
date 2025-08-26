import BlogList from 'components/Blog/BlogList'
import BlogPagination from 'components/Blog/BlogPagination'
import Panel from 'components/Panel'
import { getAllTagSlugs, getPaginatedPostsByTag } from 'lib/blog'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import { useIntl } from 'react-intl'
import { BlogPost, BlogTag } from 'types/blog'

interface BlogTagPageProps {
  posts: BlogPost[]
  locale: string
  tag: BlogTag
  totalCount: number
  pagination: {
    currentPage: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
    nextUrl: string | null
    prevUrl: string | null
  }
}

const BlogTagPage: React.FC<BlogTagPageProps> = ({
  posts,
  locale,
  tag,
  totalCount,
  pagination,
}) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Head>
        <title>
          Posts tagged with &quot;{tag.title}&quot; -{' '}
          {formatMessage({ id: 'menu.blog' })} - Mentorly
        </title>
        <meta
          name="description"
          content={`Discover all posts tagged with "${tag.title}" from the Mentorly blog. Insights and best practices for mentorship and professional development.`}
        />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://mentorly.com/${locale}/blog/tag/${tag.slug}`}
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`Posts tagged with "${tag.title}" - The Mentorly Blog`}
        />
        <meta
          property="og:description"
          content={`Discover all posts tagged with "${tag.title}" from the Mentorly blog. Insights and best practices for mentorship and professional development.`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://mentorly.com/${locale}/blog/tag/${tag.slug}`}
        />
        <meta property="og:site_name" content="Mentorly" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mentorly" />
        <meta
          name="twitter:title"
          content={`Posts tagged with "${tag.title}" - The Mentorly Blog`}
        />
        <meta
          name="twitter:description"
          content={`Discover all posts tagged with "${tag.title}" from the Mentorly blog.`}
        />

        {/* Pagination meta tags */}
        {pagination.hasNext && (
          <link
            rel="next"
            href={`https://mentorly.com/${locale}/blog/tag/${tag.slug}${pagination.nextUrl}`}
          />
        )}

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `Posts tagged with "${tag.title}"`,
              description: `All blog posts tagged with "${tag.title}" from the Mentorly blog`,
              url: `https://mentorly.com/${locale}/blog/tag/${tag.slug}`,
              publisher: {
                '@type': 'Organization',
                name: 'Mentorly',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://mentorly.com/logo.png',
                },
              },
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: posts.length,
                itemListElement: posts.map((post, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'BlogPosting',
                    headline: post.title,
                    description: post.excerpt || post.title,
                    url: `https://mentorly.com/${locale}/blog/${post.slug}`,
                    datePublished:
                      typeof post.publishDate === 'string'
                        ? post.publishDate
                        : post.publishDate.toISOString(),
                    author: {
                      '@type': 'Organization',
                      name: post.author || 'Mentorly Team',
                    },
                  },
                })),
              },
            }),
          }}
        />
      </Head>

      <Panel>
        <Panel.Container>
          <div className="max-w-6xl mx-auto py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Posts tagged with &quot;{tag.title}&quot;
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {totalCount} {totalCount === 1 ? 'post' : 'posts'} found with
                this tag
              </p>
            </div>

            {/* No posts message */}
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                  No posts found
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mt-2">
                  There are no published posts with the tag &quot;{tag.title}
                  &quot;.
                </p>
              </div>
            ) : (
              <>
                {/* Blog Posts */}
                <BlogList posts={posts} locale={locale} />

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-16">
                    <BlogPagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      hasNext={pagination.hasNext}
                      hasPrev={pagination.hasPrev}
                      nextUrl={pagination.nextUrl}
                      prevUrl={pagination.prevUrl}
                      baseUrl={`/${locale}/blog/tag/${tag.slug}`}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </Panel.Container>
      </Panel>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const tagSlugs = await getAllTagSlugs()

    const paths = []
    // Generate paths for English and French locales
    for (const tagSlug of tagSlugs) {
      paths.push({ params: { locale: 'en', tag: tagSlug } })
      paths.push({ params: { locale: 'fr', tag: tagSlug } })
    }

    return {
      paths,
      fallback: 'blocking', // Generate other tag pages on-demand
    }
  } catch (error) {
    console.error('Error in getStaticPaths for tag pages:', error)
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const locale = params?.locale as string
  const tagSlug = params?.tag as string

  try {
    const paginatedData = await getPaginatedPostsByTag(tagSlug, 1, 6)

    // If no posts found or tag doesn't exist, return 404
    if (!paginatedData.tag) {
      return {
        notFound: true,
      }
    }

    // Serialize all data to avoid Date serialization issues
    const serializedData = JSON.parse(JSON.stringify(paginatedData))

    const pagination = {
      currentPage: serializedData.currentPage,
      totalPages: serializedData.totalPages,
      hasNext: serializedData.hasNext,
      hasPrev: serializedData.hasPrev,
      nextUrl: serializedData.nextUrl ? `/page/2` : null,
      prevUrl: null, // First page has no previous
    }

    return {
      props: {
        posts: serializedData.posts,
        locale,
        tag: serializedData.tag,
        totalCount: serializedData.totalCount,
        pagination,
      },
      revalidate: 3600, // Revalidate every hour
    }
  } catch (error) {
    console.error('Error generating tag page:', error)
    return {
      notFound: true,
    }
  }
}

export default BlogTagPage
