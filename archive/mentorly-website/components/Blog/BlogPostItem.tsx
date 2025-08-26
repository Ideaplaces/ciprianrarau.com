import { formatDistanceToNow, parseISO } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BlogPost } from 'types/blog'

import BlogTags from './BlogTags'

interface BlogPostItemProps {
  post: BlogPost
  locale: string
  className?: string
}

const BlogPostItem: React.FC<BlogPostItemProps> = ({
  post,
  locale,
  className = '',
}) => {
  const {
    slug,
    title,
    excerpt,
    image,
    publishDate,
    author,
    category,
    tags,
    readingTime,
  } = post

  // Handle both Date objects and ISO strings with error handling
  const parsedDate =
    typeof publishDate === 'string' ? parseISO(publishDate) : publishDate

  // Check if date is valid to prevent crashes
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime())
  const formattedDate = isValidDate
    ? formatDistanceToNow(parsedDate, { addSuffix: true })
    : 'Date unavailable'

  return (
    <article
      className={`max-w-md mx-auto md:max-w-none grid gap-6 md:gap-8 ${
        image ? 'md:grid-cols-2' : ''
      } ${className}`}
    >
      {image && (
        <div className="relative">
          <Link href={`/${locale}/blog/${slug}`}>
            <a className="block group">
              <div className="relative h-0 pb-[56.25%] md:pb-[75%] md:h-72 lg:pb-[56.25%] overflow-hidden bg-gray-400 dark:bg-slate-700 rounded-lg shadow-lg">
                <Image
                  src={image}
                  alt={title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </a>
          </Link>
        </div>
      )}

      <div className="mt-2">
        <header>
          <div className="mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <time
                dateTime={isValidDate ? parsedDate.toISOString() : ''}
                className="inline-block"
              >
                {formattedDate}
              </time>
              {author && author !== 'Mentorly Team' && (
                <>
                  {' '}
                  · <span className="inline-block">{author}</span>
                </>
              )}
              {category && (
                <>
                  {' '}
                  ·{' '}
                  <Link href={`/${locale}/blog/category/${category.slug}`}>
                    <a className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block">
                      {category.title}
                    </a>
                  </Link>
                </>
              )}
              {readingTime && (
                <>
                  {' '}
                  · <span className="inline-block">{readingTime} min read</span>
                </>
              )}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-3 font-heading dark:text-slate-300">
            <Link href={`/${locale}/blog/${slug}`}>
              <a className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                {title}
              </a>
            </Link>
          </h2>
        </header>

        {excerpt && (
          <p className="text-gray-600 dark:text-slate-400 text-lg mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}

        {tags && tags.length > 0 && (
          <footer className="mt-5">
            <BlogTags tags={tags} locale={locale} />
          </footer>
        )}
      </div>
    </article>
  )
}

export default BlogPostItem
