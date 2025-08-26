import Link from 'next/link'
import React from 'react'
import { BlogTag } from 'types/blog'

interface BlogTagsProps {
  tags: BlogTag[]
  locale: string
  className?: string
}

const BlogTags: React.FC<BlogTagsProps> = ({
  tags,
  locale,
  className = '',
}) => {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Link key={tag.slug} href={`/${locale}/blog/tag/${tag.slug}`}>
          <a className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            #{tag.title}
          </a>
        </Link>
      ))}
    </div>
  )
}

export default BlogTags
