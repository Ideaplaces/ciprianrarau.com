import BlogList from 'components/Blog/BlogList'
import BlogPagination from 'components/Blog/BlogPagination'
import Panel from 'components/Panel'
import { getAllCategories, getAllTags, getPaginatedPosts } from 'lib/blog'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import { useIntl } from 'react-intl'
import { BlogPost } from 'types/blog'

interface BlogIndexProps {
  posts: BlogPost[]
  locale: string
  pagination: {
    currentPage: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
    nextUrl: string | null
    prevUrl: string | null
  }
  categories: Array<{ slug: string; title: string }>
  tags: Array<{ slug: string; title: string }>
}

const BlogIndex: React.FC<BlogIndexProps> = ({
  posts,
  locale,
  pagination,
  categories: _categories,
  tags: _tags,
}) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Head>
        <title>{formatMessage({ id: 'menu.blog' })} - Mentorly</title>
        <meta
          name="description"
          content="Discover insights, case studies, and best practices for mentorship and professional development from the Mentorly team and community."
        />

        {/* Canonical URL */}
        <link rel="canonical" href={`https://mentorly.com/${locale}/blog`} />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="The Mentorly Blog - Mentorship Insights & Best Practices"
        />
        <meta
          property="og:description"
          content="Discover insights, case studies, and best practices for mentorship and professional development from the Mentorly team and community."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://mentorly.com/${locale}/blog`}
        />
        <meta property="og:site_name" content="Mentorly" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="The Mentorly Blog - Mentorship Insights & Best Practices"
        />
        <meta
          name="twitter:description"
          content="Discover insights, case studies, and best practices for mentorship and professional development."
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Blog',
              name: 'The Mentorly Blog',
              description:
                'Insights, case studies, and best practices for mentorship and professional development',
              url: `https://mentorly.com/${locale}/blog`,
              publisher: {
                '@type': 'Organization',
                name: 'Mentorly',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://mentorly.com/logo.png',
                },
              },
              blogPost: posts.slice(0, 5).map((post) => ({
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
              })),
            }),
          }}
        />
      </Head>
      <Panel>
        <Panel.Container>
          <div className="py-12 sm:py-16 lg:py-20">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 font-heading">
                The Mentorly Blog
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Insights, case studies, and best practices for mentorship and
                professional development. Learn from our experiences and the
                stories of our community.
              </p>
            </div>

            {/* Categories and Tags Filter (Future Enhancement) */}
            {/* You can add filtering UI here later */}

            {/* Blog Posts */}
            <div className="max-w-4xl mx-auto">
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
                    baseUrl={`/${locale}/blog`}
                  />
                </div>
              )}
            </div>
          </div>
        </Panel.Container>
      </Panel>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { locale: 'en' } }, { params: { locale: 'fr' } }],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const locale = params?.locale as string

  try {
    const paginationData = await getPaginatedPosts(1, 6)
    const categories = await getAllCategories()
    const tags = await getAllTags()

    return {
      props: {
        locale,
        posts: JSON.parse(JSON.stringify(paginationData.posts)),
        pagination: {
          currentPage: paginationData.currentPage,
          totalPages: paginationData.totalPages,
          hasNext: paginationData.hasNext,
          hasPrev: paginationData.hasPrev,
          nextUrl: paginationData.nextUrl,
          prevUrl: paginationData.prevUrl,
        },
        categories: JSON.parse(JSON.stringify(categories)),
        tags: JSON.parse(JSON.stringify(tags)),
      },
      revalidate: 3600, // Regenerate at most once per hour
    }
  } catch (error) {
    console.error('Error loading blog data:', error)
    return {
      props: {
        locale,
        posts: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
          nextUrl: null,
          prevUrl: null,
        },
        categories: [],
        tags: [],
      },
      revalidate: 3600,
    }
  }
}

export default BlogIndex
