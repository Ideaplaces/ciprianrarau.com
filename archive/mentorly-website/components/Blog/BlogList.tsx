import React from 'react'
import { BlogPost } from 'types/blog'

import BlogPostItem from './BlogPostItem'

interface BlogListProps {
  posts: BlogPost[]
  locale: string
  className?: string
}

const BlogList: React.FC<BlogListProps> = ({
  posts,
  locale,
  className = '',
}) => {
  if (!posts.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
          No blog posts found
        </h3>
        <p className="text-gray-500 dark:text-gray-500 mt-2">
          Check back later for new content!
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-12 md:space-y-16 ${className}`}>
      {posts.map((post) => (
        <BlogPostItem key={post.id} post={post} locale={locale} />
      ))}
    </div>
  )
}

export default BlogList
