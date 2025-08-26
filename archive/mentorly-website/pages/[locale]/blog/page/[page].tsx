import BlogList from 'components/Blog/BlogList'
import BlogPagination from 'components/Blog/BlogPagination'
import Panel from 'components/Panel'
import {
  getAllCategories,
  getAllTags,
  getPaginatedPosts,
  loadPosts,
} from 'lib/blog'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import { useIntl } from 'react-intl'
import { BlogPost } from 'types/blog'

interface BlogPageProps {
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

const BlogPaginationPage: React.FC<BlogPageProps> = ({
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
        <title>
          {formatMessage({ id: 'menu.blog' })} - Page {pagination.currentPage} -
          Mentorly
        </title>
        <meta
          name="description"
          content={`Discover insights, case studies, and best practices for mentorship and professional development from the Mentorly team and community. Page ${pagination.currentPage}.`}
        />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://mentorly.com/${locale}/blog/page/${pagination.currentPage}`}
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`The Mentorly Blog - Page ${pagination.currentPage}`}
        />
        <meta
          property="og:description"
          content={`Discover insights, case studies, and best practices for mentorship and professional development. Page ${pagination.currentPage}.`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://mentorly.com/${locale}/blog/page/${pagination.currentPage}`}
        />
        <meta property="og:site_name" content="Mentorly" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mentorly" />
        <meta
          name="twitter:title"
          content={`The Mentorly Blog - Page ${pagination.currentPage}`}
        />
        <meta
          name="twitter:description"
          content={`Discover insights, case studies, and best practices for mentorship and professional development. Page ${pagination.currentPage}.`}
        />

        {/* Pagination meta tags */}
        {pagination.hasPrev && (
          <link
            rel="prev"
            href={`https://mentorly.com/${locale}/blog${pagination.prevUrl}`}
          />
        )}
        {pagination.hasNext && (
          <link
            rel="next"
            href={`https://mentorly.com/${locale}/blog${pagination.nextUrl}`}
          />
        )}
      </Head>

      <Panel>
        <Panel.Container>
          <div className="max-w-6xl mx-auto py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {formatMessage({ id: 'menu.blog' })}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Discover insights, case studies, and best practices for
                mentorship and professional development
              </p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
            </div>

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
                  baseUrl={`/${locale}/blog`}
                />
              </div>
            )}
          </div>
        </Panel.Container>
      </Panel>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const allPosts = await loadPosts() // Get all posts directly
    const totalPosts = allPosts.length
    const postsPerPage = 6
    const totalPages = Math.ceil(totalPosts / postsPerPage)

    const paths = []

    // Generate paths for English and French locales, starting from page 2
    for (let page = 2; page <= totalPages; page++) {
      paths.push({ params: { locale: 'en', page: page.toString() } })
      paths.push({ params: { locale: 'fr', page: page.toString() } })
    }

    return {
      paths,
      fallback: 'blocking', // Generate other pages on-demand
    }
  } catch (error) {
    console.error('Error in getStaticPaths:', error)
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const locale = params?.locale as string
  const page = parseInt(params?.page as string) || 1

  try {
    const paginatedData = await getPaginatedPosts(page, 6)
    const [categories, tags] = await Promise.all([
      getAllCategories(),
      getAllTags(),
    ])

    // Serialize all data to avoid Date serialization issues
    const serializedData = JSON.parse(JSON.stringify(paginatedData))

    // Fix pagination URLs to include locale
    const pagination = {
      currentPage: serializedData.currentPage,
      totalPages: serializedData.totalPages,
      hasNext: serializedData.hasNext,
      hasPrev: serializedData.hasPrev,
      nextUrl: serializedData.nextUrl ? `/page/${page + 1}` : null,
      prevUrl: serializedData.prevUrl
        ? page === 2
          ? '' // Page 1 is just /blog
          : `/page/${page - 1}`
        : null,
    }

    return {
      props: {
        posts: serializedData.posts,
        locale,
        pagination,
        categories: categories.map((cat) => ({
          slug: cat.slug,
          title: cat.title,
        })),
        tags: tags.map((tag) => ({ slug: tag.slug, title: tag.title })),
      },
      revalidate: 3600, // Revalidate every hour
    }
  } catch (error) {
    console.error('Error generating blog page:', error)
    return {
      notFound: true,
    }
  }
}

export default BlogPaginationPage
