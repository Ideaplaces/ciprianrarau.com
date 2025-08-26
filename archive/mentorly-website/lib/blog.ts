import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

import {
  BlogCategory,
  BlogPost,
  BlogPostFrontmatter,
  BlogTag,
} from '../types/blog'

const POSTS_PER_PAGE = 6
const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

// Helper function to safely get timestamp from Date or string
const getTimestamp = (date: Date | string): number => {
  if (typeof date === 'string') {
    return new Date(date).getTime()
  }
  return date.getTime()
}

const cleanSlug = (slug: string): string => {
  // Ensure slug is a string
  if (typeof slug !== 'string') {
    console.warn('cleanSlug received non-string value:', slug)
    return 'invalid-slug'
  }

  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const generatePermalink = (slug: string, publishDate: Date): string => {
  const year = publishDate.getFullYear()
  const month = String(publishDate.getMonth() + 1).padStart(2, '0')
  const day = String(publishDate.getDate()).padStart(2, '0')

  return `${year}/${month}/${day}/${slug}`
}

const calculateReadingTime = (content: string): number => {
  const words = content.trim().split(/\s+/).length
  const readingTime = Math.ceil(words / 200) // Assuming 200 words per minute
  return readingTime
}

// Extract the first image from HTML content
const extractFirstImage = (htmlContent: string): string | undefined => {
  try {
    // Look for img tags in the HTML content
    const imgRegex = /<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/i
    const match = htmlContent.match(imgRegex)

    if (match && match[1]) {
      let imageSrc = match[1]

      // Skip if it's a very small image (likely an icon or pixel tracker)
      if (imageSrc.includes('1x1') || imageSrc.includes('pixel')) {
        return undefined
      }

      // Ensure the URL is absolute
      if (imageSrc.startsWith('//')) {
        imageSrc = 'https:' + imageSrc
      } else if (imageSrc.startsWith('/')) {
        imageSrc = 'https://mentorlyblog.co' + imageSrc
      }

      return imageSrc
    }

    return undefined
  } catch (error) {
    console.error('Error extracting first image:', error)
    return undefined
  }
}

// Parse post metadata only (no content) for listings
const parsePostMetadata = (
  filePath: string
): Omit<BlogPost, 'content'> | null => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    const frontmatter = data as BlogPostFrontmatter

    if (frontmatter.draft && process.env.NODE_ENV === 'production') {
      return null
    }

    const fileName = path.basename(filePath, path.extname(filePath))
    const fileExtension = path.extname(filePath)
    const slug = cleanSlug(fileName)
    const publishDate = new Date(frontmatter.publishDate)
    const updateDate = frontmatter.updateDate
      ? new Date(frontmatter.updateDate)
      : undefined

    // Determine content type based on file extension or frontmatter
    const contentType =
      frontmatter.contentType ||
      (fileExtension === '.html' ? 'html' : 'markdown')

    const category: BlogCategory | undefined = frontmatter.category
      ? { slug: cleanSlug(frontmatter.category), title: frontmatter.category }
      : undefined

    const tags: BlogTag[] = frontmatter.tags
      ? frontmatter.tags
          .filter((tag) => tag && typeof tag === 'string') // Only include valid string tags
          .map((tag) => ({ slug: cleanSlug(tag), title: tag }))
      : []

    // Extract image but don't store full content
    const image = frontmatter.image || extractFirstImage(content)

    const postMetadata: Omit<BlogPost, 'content'> = {
      id: fileName,
      slug,
      permalink: generatePermalink(slug, publishDate),
      publishDate,
      updateDate,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      contentType,
      image,
      category,
      tags,
      author: frontmatter.author,
      draft: frontmatter.draft || false,
      metadata: frontmatter.metadata || {},
      readingTime: calculateReadingTime(content),
    }

    return postMetadata
  } catch (error) {
    console.error(`Error parsing post metadata ${filePath}:`, error)
    return null
  }
}

// Parse full post with content
const parseFullPost = (filePath: string): BlogPost | null => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    const frontmatter = data as BlogPostFrontmatter

    // Allow draft posts to be accessed via direct URL in production
    // They will still be hidden from listings via parsePostMetadata

    const fileName = path.basename(filePath, path.extname(filePath))
    const fileExtension = path.extname(filePath)
    const slug = cleanSlug(fileName)
    const publishDate = new Date(frontmatter.publishDate)
    const updateDate = frontmatter.updateDate
      ? new Date(frontmatter.updateDate)
      : undefined

    // Determine content type based on file extension or frontmatter
    const contentType =
      frontmatter.contentType ||
      (fileExtension === '.html' ? 'html' : 'markdown')

    const category: BlogCategory | undefined = frontmatter.category
      ? { slug: cleanSlug(frontmatter.category), title: frontmatter.category }
      : undefined

    const tags: BlogTag[] = frontmatter.tags
      ? frontmatter.tags
          .filter((tag) => tag && typeof tag === 'string') // Only include valid string tags
          .map((tag) => ({ slug: cleanSlug(tag), title: tag }))
      : []

    const post: BlogPost = {
      id: fileName,
      slug,
      permalink: generatePermalink(slug, publishDate),
      publishDate,
      updateDate,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      content,
      contentType,
      image: frontmatter.image || extractFirstImage(content),
      category,
      tags,
      author: frontmatter.author,
      draft: frontmatter.draft || false,
      metadata: frontmatter.metadata || {},
      readingTime: calculateReadingTime(content),
    }

    return post
  } catch (error) {
    console.error(`Error parsing post ${filePath}:`, error)
    return null
  }
}

// Load posts metadata only (for listings) - reads files fresh each time
export const loadPosts = async (): Promise<Omit<BlogPost, 'content'>[]> => {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true })
      return []
    }

    const files = fs.readdirSync(CONTENT_DIR)
    const markdownFiles = files.filter(
      (file) =>
        file.endsWith('.md') || file.endsWith('.mdx') || file.endsWith('.html')
    )

    const postsMetadata = markdownFiles
      .map((file) => parsePostMetadata(path.join(CONTENT_DIR, file)))
      .filter((post): post is Omit<BlogPost, 'content'> => post !== null)
      .sort((a, b) => getTimestamp(b.publishDate) - getTimestamp(a.publishDate))

    return postsMetadata
  } catch (error) {
    console.error('Error loading posts metadata:', error)
    return []
  }
}

// Get single post with content - reads file fresh each time
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      return null
    }

    const files = fs.readdirSync(CONTENT_DIR)
    const targetFile = files.find((file) => {
      const fileName = path.basename(file, path.extname(file))
      return cleanSlug(fileName) === slug
    })

    if (!targetFile) {
      return null
    }

    const filePath = path.join(CONTENT_DIR, targetFile)
    return parseFullPost(filePath)
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error)
    return null
  }
}

export const getPostsByCategory = async (
  categorySlug: string
): Promise<BlogPost[]> => {
  const posts = await loadPosts()
  return posts.filter((post) => post.category?.slug === categorySlug)
}

export const getPostsByTag = async (tagSlug: string): Promise<BlogPost[]> => {
  const posts = await loadPosts()
  return posts.filter((post) => post.tags?.some((tag) => tag.slug === tagSlug))
}

export const getRelatedPosts = async (
  originalPost: BlogPost,
  maxResults = 4
): Promise<BlogPost[]> => {
  const allPosts = await loadPosts()
  const originalTagsSet = new Set(
    originalPost.tags?.map((tag) => tag.slug) || []
  )

  const postsWithScores = allPosts
    .filter((post) => post.slug !== originalPost.slug)
    .map((post) => {
      let score = 0

      // Same category gets higher score
      if (
        post.category &&
        originalPost.category &&
        post.category.slug === originalPost.category.slug
      ) {
        score += 5
      }

      // Shared tags get points
      if (post.tags) {
        post.tags.forEach((tag) => {
          if (originalTagsSet.has(tag.slug)) {
            score += 1
          }
        })
      }

      return { post, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)

  return postsWithScores.map((item) => item.post)
}

export const getAllCategories = async (): Promise<BlogCategory[]> => {
  const posts = await loadPosts()
  const categoryMap = new Map<string, BlogCategory>()

  posts.forEach((post) => {
    if (post.category) {
      categoryMap.set(post.category.slug, post.category)
    }
  })

  return Array.from(categoryMap.values()).sort((a, b) =>
    a.title.localeCompare(b.title)
  )
}

export const getAllTags = async (): Promise<BlogTag[]> => {
  const posts = await loadPosts()
  const tagMap = new Map<string, BlogTag>()

  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        tagMap.set(tag.slug, tag)
      })
    }
  })

  return Array.from(tagMap.values()).sort((a, b) =>
    a.title.localeCompare(b.title)
  )
}

export const getPaginatedPosts = async (
  page = 1,
  postsPerPage: number = POSTS_PER_PAGE
) => {
  const allPosts = await loadPosts()
  const totalPages = Math.ceil(allPosts.length / postsPerPage)
  const startIndex = (page - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage

  // Handle case where page number is too high
  if (page > totalPages && totalPages > 0) {
    return {
      posts: [],
      totalPages,
      currentPage: page,
      hasNext: false,
      hasPrev: true,
      nextUrl: null,
      prevUrl: totalPages > 1 ? `/page/${totalPages}` : null,
    }
  }

  const posts = allPosts.slice(startIndex, endIndex)

  return {
    posts,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    nextUrl: page < totalPages ? `/page/${page + 1}` : null,
    prevUrl: page > 1 ? `/page/${page - 1}` : null,
  }
}

export const getLatestPosts = async (
  count = 4
): Promise<Omit<BlogPost, 'content'>[]> => {
  const posts = await loadPosts()
  return posts.slice(0, count)
}

// Static path generators for Next.js
export const getAllPostSlugs = async (): Promise<string[]> => {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      return []
    }

    const files = fs.readdirSync(CONTENT_DIR)
    const markdownFiles = files.filter(
      (file) =>
        file.endsWith('.md') || file.endsWith('.mdx') || file.endsWith('.html')
    )

    // Generate slugs from all files (including drafts) so Next.js creates pages for them
    return markdownFiles.map((file) => {
      const fileName = path.basename(file, path.extname(file))
      return cleanSlug(fileName)
    })
  } catch (error) {
    console.error('Error getting all post slugs:', error)
    return []
  }
}

export const getAllCategorySlugs = async (): Promise<string[]> => {
  const categories = await getAllCategories()
  return categories.map((category) => category.slug)
}

export const getAllTagSlugs = async (): Promise<string[]> => {
  const tags = await getAllTags()
  return tags.map((tag) => tag.slug)
}

export const getPaginatedPostsByTag = async (
  tagSlug: string,
  page = 1,
  postsPerPage: number = POSTS_PER_PAGE
) => {
  const allTagPosts = await getPostsByTag(tagSlug)
  const totalPages = Math.ceil(allTagPosts.length / postsPerPage)
  const startIndex = (page - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage

  // Handle case where page number is too high
  if (page > totalPages && totalPages > 0) {
    return {
      posts: [],
      totalPages,
      currentPage: page,
      hasNext: false,
      hasPrev: true,
      nextUrl: null,
      prevUrl: totalPages > 1 ? `/page/${totalPages}` : null,
      tag:
        allTagPosts.length > 0
          ? allTagPosts[0].tags?.find((tag) => tag.slug === tagSlug)
          : null,
      totalCount: allTagPosts.length,
    }
  }

  const posts = allTagPosts.slice(startIndex, endIndex)

  return {
    posts,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    nextUrl: page < totalPages ? `/page/${page + 1}` : null,
    prevUrl: page > 1 ? `/page/${page - 1}` : null,
    tag:
      allTagPosts.length > 0
        ? allTagPosts[0].tags?.find((tag) => tag.slug === tagSlug)
        : null,
    totalCount: allTagPosts.length,
  }
}

export const getPaginatedPostsByCategory = async (
  categorySlug: string,
  page = 1,
  postsPerPage: number = POSTS_PER_PAGE
) => {
  const allCategoryPosts = await getPostsByCategory(categorySlug)
  const totalPages = Math.ceil(allCategoryPosts.length / postsPerPage)
  const startIndex = (page - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage

  // Handle case where page number is too high
  if (page > totalPages && totalPages > 0) {
    return {
      posts: [],
      totalPages,
      currentPage: page,
      hasNext: false,
      hasPrev: true,
      nextUrl: null,
      prevUrl: totalPages > 1 ? `/page/${totalPages}` : null,
      category:
        allCategoryPosts.length > 0 ? allCategoryPosts[0].category : null,
    }
  }

  const posts = allCategoryPosts.slice(startIndex, endIndex)

  return {
    posts,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    nextUrl: page < totalPages ? `/page/${page + 1}` : null,
    prevUrl: page > 1 ? `/page/${page - 1}` : null,
    category: allCategoryPosts.length > 0 ? allCategoryPosts[0].category : null,
  }
}
