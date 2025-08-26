import BlogList from 'components/Blog/BlogList'
import BlogPagination from 'components/Blog/BlogPagination'
import Panel from 'components/Panel'
import { getAllTagSlugs, getPaginatedPostsByTag, loadPosts } from 'lib/blog'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import { useIntl } from 'react-intl'
import { BlogPost, BlogTag } from 'types/blog'

interface BlogTagPaginationPageProps {
  posts: BlogPost[]
  locale: string
  tag: BlogTag
  pagination: {
    currentPage: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
    nextUrl: string | null
    prevUrl: string | null
  }
}

const BlogTagPaginationPage: React.FC<BlogTagPaginationPageProps> = ({
  posts,
  locale,
  tag,
  pagination,
}) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Head>
        <title>
          Posts tagged with &quot;{tag.title}&quot; - Page{' '}
          {pagination.currentPage} - {formatMessage({ id: 'menu.blog' })} -
          Mentorly
        </title>
        <meta
          name="description"
          content={`Discover posts tagged with "${tag.title}" from the Mentorly blog. Page ${pagination.currentPage} of ${pagination.totalPages}. Insights and best practices for mentorship and professional development.`}
        />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://mentorly.com/${locale}/blog/tag/${tag.slug}/page/${pagination.currentPage}`}
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`Posts tagged with "${tag.title}" - Page ${pagination.currentPage} - The Mentorly Blog`}
        />
        <meta
          property="og:description"
          content={`Discover posts tagged with "${tag.title}" from the Mentorly blog. Page ${pagination.currentPage} of ${pagination.totalPages}.`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://mentorly.com/${locale}/blog/tag/${tag.slug}/page/${pagination.currentPage}`}
        />
        <meta property="og:site_name" content="Mentorly" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mentorly" />
        <meta
          name="twitter:title"
          content={`Posts tagged with "${tag.title}" - Page ${pagination.currentPage}`}
        />
        <meta
          name="twitter:description"
          content={`Discover posts tagged with "${tag.title}" from the Mentorly blog.`}
        />

        {/* Pagination meta tags */}
        {pagination.hasPrev && (
          <link
            rel="prev"
            href={`https://mentorly.com/${locale}/blog/tag/${tag.slug}${
              pagination.currentPage === 2
                ? ''
                : `/page/${pagination.currentPage - 1}`
            }`}
          />
        )}
        {pagination.hasNext && (
          <link
            rel="next"
            href={`https://mentorly.com/${locale}/blog/tag/${tag.slug}/page/${
              pagination.currentPage + 1
            }`}
          />
        )}

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `Posts tagged with "${tag.title}" - Page ${pagination.currentPage}`,
              description: `Page ${pagination.currentPage} of blog posts tagged with "${tag.title}" from the Mentorly blog`,
              url: `https://mentorly.com/${locale}/blog/tag/${tag.slug}/page/${pagination.currentPage}`,
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
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
            </div>

            {/* No posts message */}
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                  No posts found
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mt-2">
                  There are no posts on this page.
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
    const allPosts = await loadPosts()

    const paths = []

    for (const tagSlug of tagSlugs) {
      // Get posts for this tag to calculate pagination
      const tagPosts = allPosts.filter((post) =>
        post.tags?.some((tag) => tag.slug === tagSlug)
      )
      const totalPages = Math.ceil(tagPosts.length / 6) // 6 posts per page

      // Generate paths for pages 2 and onwards (page 1 is handled by [tag].tsx)
      for (let page = 2; page <= totalPages; page++) {
        paths.push({
          params: { locale: 'en', tag: tagSlug, page: page.toString() },
        })
        paths.push({
          params: { locale: 'fr', tag: tagSlug, page: page.toString() },
        })
      }
    }

    return {
      paths,
      fallback: 'blocking', // Generate other pages on-demand
    }
  } catch (error) {
    console.error('Error in getStaticPaths for tag pagination pages:', error)
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const locale = params?.locale as string
  const tagSlug = params?.tag as string
  const page = parseInt(params?.page as string) || 1

  try {
    const paginatedData = await getPaginatedPostsByTag(tagSlug, page, 6)

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
      nextUrl: serializedData.nextUrl ? `/page/${page + 1}` : null,
      prevUrl: serializedData.prevUrl
        ? page === 2
          ? '' // Page 1 is just /tag/[tag]
          : `/page/${page - 1}`
        : null,
    }

    return {
      props: {
        posts: serializedData.posts,
        locale,
        tag: serializedData.tag,
        pagination,
      },
      revalidate: 3600, // Revalidate every hour
    }
  } catch (error) {
    console.error('Error generating tag pagination page:', error)
    return {
      notFound: true,
    }
  }
}

export default BlogTagPaginationPage
