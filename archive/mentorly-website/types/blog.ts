export interface BlogPost {
  id: string
  slug: string
  permalink: string

  publishDate: Date | string
  updateDate?: Date | string

  title: string
  excerpt?: string
  content?: string
  contentType?: 'markdown' | 'html'
  image?: string

  category?: BlogCategory
  tags?: BlogTag[]
  author?: string

  draft?: boolean
  metadata?: Record<string, any>

  readingTime?: number
}

export interface BlogCategory {
  slug: string
  title: string
}

export interface BlogTag {
  slug: string
  title: string
}

export interface BlogPostFrontmatter {
  publishDate: string
  updateDate?: string
  title: string
  excerpt?: string
  image?: string
  category?: string
  tags?: string[]
  author?: string
  draft?: boolean
  contentType?: 'markdown' | 'html'
  metadata?: Record<string, any>
}

export interface PaginatedPosts {
  posts: BlogPost[]
  totalPages: number
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
  nextUrl: string | null
  prevUrl: string | null
}

export interface BlogListProps {
  posts: BlogPost[]
  pagination?: {
    totalPages: number
    currentPage: number
    hasNext: boolean
    hasPrev: boolean
    nextUrl: string | null
    prevUrl: string | null
  }
}

export interface BlogPostProps {
  post: BlogPost
  relatedPosts?: BlogPost[]
}
