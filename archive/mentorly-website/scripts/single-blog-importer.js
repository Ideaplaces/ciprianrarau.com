/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

const fs = require('fs')
const path = require('path')
const https = require('https')

// WordPress blog base URL
const BLOG_BASE_URL = 'https://mentorlyblog.co'

// Utility function to fetch HTML content directly
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          resolve(data)
        })
      })
      .on('error', reject)
  })
}

// Extract meta tags and SEO data from WordPress HTML
function extractSEOData(html) {
  console.log('🔍 Extracting SEO data from WordPress...')

  const seoData = {}

  // Extract title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
  if (titleMatch) {
    // First decode HTML entities, then remove " – Mentorly Blog" suffix
    seoData.title = titleMatch[1]
      .replace(/&#8211;/g, '–')
      .replace(/&#8217;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/\s*[–-]\s*Mentorly Blog.*$/i, '')
      .trim()
  }

  // Extract meta description (look for various possible meta description tags)
  const descMatch =
    html.match(
      /<meta[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/i
    ) ||
    html.match(
      /<meta[^>]*content\s*=\s*["']([^"']*)["'][^>]*name\s*=\s*["']description["'][^>]*>/i
    )
  if (descMatch) {
    seoData.description = descMatch[1]
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .trim()
  }

  // Extract canonical URL
  const canonicalMatch = html.match(
    /<link[^>]*rel\s*=\s*["']canonical["'][^>]*href\s*=\s*["']([^"']*)["'][^>]*>/i
  )
  if (canonicalMatch) {
    seoData.canonical = canonicalMatch[1]
  }

  // Extract categories from the HTML content
  const categoryMatch = html.match(
    /Categorized as\s*<a[^>]*href="[^"]*category\/([^"/]*)"[^>]*>([^<]*)<\/a>/i
  )
  if (categoryMatch) {
    seoData.category = categoryMatch[2].trim()
  }

  // Extract publish date from meta or structured data
  const publishMatch =
    html.match(/<time[^>]*datetime\s*=\s*["']([^"']*)["'][^>]*>/i) ||
    html.match(/Published[^<]*<time[^>]*datetime\s*=\s*["']([^"']*)["'][^>]*>/i)
  if (publishMatch) {
    seoData.publishDate = publishMatch[1]
  }

  // Extract author
  const authorMatch =
    html.match(/By\s*<a[^>]*rel\s*=\s*["']author["'][^>]*>([^<]*)<\/a>/i) ||
    html.match(
      /<meta[^>]*name\s*=\s*["']author["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/i
    )
  if (authorMatch) {
    seoData.author = authorMatch[1].trim()
  }

  console.log('✓ Extracted SEO data:', seoData)
  return seoData
}

// Extract and clean blog content from WordPress HTML
function extractAndCleanBlogContent(html) {
  console.log('🔧 Extracting and cleaning blog content...')

  // Look for the main content area in WordPress
  const contentMatch =
    html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*?)<\/div>/s) ||
    html.match(/<article[^>]*class="[^"]*post[^"]*"[^>]*>(.*?)<\/article>/s) ||
    html.match(/<main[^>]*>(.*?)<\/main>/s)

  if (!contentMatch) {
    console.log('⚠ Could not find specific content area')
    return null
  }

  let content = contentMatch[1]
  console.log('✓ Found blog content in HTML')

  // Clean up WordPress-specific elements we don't need
  content = content
    // Remove WordPress navigation elements
    .replace(/<nav[^>]*>.*?<\/nav>/gs, '')
    // Remove comment sections
    .replace(/<div[^>]*class="[^"]*comment[^"]*"[^>]*>.*?<\/div>/gs, '')
    // Remove WordPress meta elements
    .replace(/<div[^>]*class="[^"]*post-meta[^"]*"[^>]*>.*?<\/div>/gs, '')
    // Remove share buttons and social elements
    .replace(/<div[^>]*class="[^"]*share[^"]*"[^>]*>.*?<\/div>/gs, '')
    // Remove WordPress admin elements
    .replace(/<div[^>]*class="[^"]*admin[^"]*"[^>]*>.*?<\/div>/gs, '')
    // Remove header sections (title, publish date, author)
    .replace(
      /<header[^>]*class="[^"]*entry-header[^"]*"[^>]*>.*?<\/header>/gs,
      ''
    )
    // Remove footer sections (categories, navigation)
    .replace(
      /<footer[^>]*class="[^"]*entry-footer[^"]*"[^>]*>.*?<\/footer>/gs,
      ''
    )
    // Remove navigation links
    .replace(/<div[^>]*class="[^"]*nav-links[^"]*"[^>]*>.*?<\/div>/gs, '')
    // Clean up excessive whitespace
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()

  console.log('✓ Cleaned WordPress content')
  console.log('📝 Sample cleaned content:', content.substring(0, 300) + '...')

  return content
}

// Extract the main image from content
function extractMainImage(content) {
  console.log('🖼️ Extracting main image...')

  // Look for the first meaningful image (not icons or small images)
  const imgMatches = content.match(
    /<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/gi
  )

  if (imgMatches) {
    for (const imgMatch of imgMatches) {
      const srcMatch = imgMatch.match(/src\s*=\s*["']([^"']+)["']/i)
      if (srcMatch) {
        let imageSrc = srcMatch[1]

        // Skip very small images (likely icons)
        if (
          imageSrc.includes('32x32') ||
          imageSrc.includes('64x64') ||
          imageSrc.includes('1x1')
        ) {
          continue
        }

        // Convert relative URLs to absolute
        if (imageSrc.startsWith('//')) {
          imageSrc = 'https:' + imageSrc
        } else if (imageSrc.startsWith('/')) {
          imageSrc = BLOG_BASE_URL + imageSrc
        }

        console.log('✓ Found main image:', imageSrc)
        return imageSrc
      }
    }
  }

  console.log('⚠ No suitable main image found')
  return ''
}

// Generate better excerpt from content
function generateExcerpt(content, title) {
  console.log('📝 Generating excerpt...')

  // Remove HTML tags and get clean text
  const cleanText = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    .trim()

  // Find the first substantial paragraph (more than 50 characters)
  const sentences = cleanText.split(/[.!?]+/)
  let excerpt = ''

  for (const sentence of sentences) {
    const trimmed = sentence.trim()
    if (
      trimmed.length > 30 &&
      !trimmed.toLowerCase().includes(title.toLowerCase().split(' ')[0])
    ) {
      excerpt = trimmed
      break
    }
  }

  // If no good sentence found, take first 150 characters
  if (!excerpt && cleanText.length > 100) {
    excerpt = cleanText.substring(0, 150).trim()
    // Try to end at a word boundary
    const lastSpace = excerpt.lastIndexOf(' ')
    if (lastSpace > 100) {
      excerpt = excerpt.substring(0, lastSpace)
    }
  }

  // Add ellipsis if excerpt was truncated
  if (excerpt && excerpt.length < cleanText.length - 10) {
    excerpt += '...'
  }

  console.log('✓ Generated excerpt:', excerpt.substring(0, 100) + '...')
  return excerpt || title
}

// Extract relevant tags/keywords from content
function extractTags(content, title, category) {
  console.log('🏷️ Extracting tags...')

  const commonTags = [
    'mentorship',
    'mentor',
    'mentee',
    'guidance',
    'career',
    'professional development',
    'leadership',
    'coaching',
    'advice',
    'growth',
    'skills',
    'networking',
    'workplace',
    'business',
    'success',
    'learning',
    'development',
  ]

  const cleanContent = content.toLowerCase().replace(/<[^>]*>/g, ' ')
  const cleanTitle = title.toLowerCase()

  const foundTags = []

  // Add category as a tag if it's meaningful
  if (category && category.toLowerCase() !== 'uncategorized') {
    foundTags.push(category)
  }

  // Look for common mentorship-related terms
  for (const tag of commonTags) {
    if (
      (cleanContent.includes(tag) || cleanTitle.includes(tag)) &&
      !foundTags.includes(tag)
    ) {
      foundTags.push(tag)
    }
  }

  // Extract key terms from title
  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 3 &&
        ![
          'make',
          'their',
          'first',
          'them',
          'avoid',
          'with',
          'from',
          'this',
          'that',
          'your',
          'have',
          'will',
          'been',
          'were',
          'said',
          'each',
          'which',
          'such',
          'into',
          'more',
          'very',
          'what',
          'know',
          'just',
          'time',
          'year',
          'work',
          'part',
          'take',
          'only',
          'like',
          'back',
          'also',
          'after',
          'well',
          'many',
          'most',
          'some',
          'good',
          'much',
          'even',
          'still',
        ].includes(word)
    )

  for (const word of titleWords) {
    if (
      !foundTags.some((tag) => tag.toLowerCase().includes(word)) &&
      foundTags.length < 8
    ) {
      foundTags.push(word)
    }
  }

  console.log('✓ Extracted tags:', foundTags)
  return foundTags.slice(0, 6) // Limit to 6 tags
}

// Create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Main function to convert the Top 5 Mistakes blog
async function main() {
  try {
    console.log(
      '🚀 Starting WordPress HTML import with enhanced SEO extraction...\n'
    )

    // Fetch the actual blog page HTML
    const blogUrl =
      'https://mentorlyblog.co/community/top-5-mistakes-mentees-make-in-their-first-mentor-meeting-and-how-to-avoid-them/'
    console.log(`📥 Fetching HTML from: ${blogUrl}`)

    const html = await fetchHtml(blogUrl)
    console.log(`✓ Fetched ${html.length} characters of HTML`)

    // Extract SEO data from the HTML head section
    const seoData = extractSEOData(html)

    // Extract and clean the main blog content
    const contentHtml = extractAndCleanBlogContent(html)

    if (!contentHtml) {
      throw new Error('Could not extract blog content from HTML')
    }

    console.log(
      `✓ Extracted ${contentHtml.length} characters of clean HTML content`
    )

    // Extract main image
    const mainImage = extractMainImage(contentHtml)

    // Generate better excerpt
    const betterExcerpt = generateExcerpt(
      contentHtml,
      seoData.title || 'Blog Post'
    )

    // Extract tags
    const tags = extractTags(
      contentHtml,
      seoData.title || '',
      seoData.category || ''
    )

    // Create frontmatter with enhanced SEO data
    const frontmatter = `---
publishDate: ${seoData.publishDate || '2025-03-17T16:28:31.000Z'}
author: ${seoData.author || 'Mentorly Team'}
title: ${JSON.stringify(
      seoData.title ||
        'Top 5 Mistakes Mentees Make in Their First Mentor Meeting (And How to Avoid Them)'
    )}
excerpt: ${JSON.stringify(betterExcerpt)}
image: ${mainImage}
category: ${seoData.category || 'Community'}
tags: ${JSON.stringify(tags)}
contentType: html

metadata:
  canonical: https://mentorly.com/blog/${createSlug(
    seoData.title ||
      'top-5-mistakes-mentees-make-in-their-first-mentor-meeting-and-how-to-avoid-them'
  )}
---

`

    // Combine frontmatter and HTML content
    const fileContent = frontmatter + contentHtml

    // Save as .html file
    const filename =
      'top-5-mistakes-mentees-make-in-their-first-mentor-meeting-and-how-to-avoid-them.html'
    const filepath = path.join(__dirname, '../content/blog', filename)

    fs.writeFileSync(filepath, fileContent, 'utf8')
    console.log(`✅ Imported and saved with enhanced SEO: ${filename}`)
    console.log(`📄 File size: ${Math.round(fileContent.length / 1024)}KB`)
    console.log(`🏷️ Tags added: ${tags.join(', ')}`)
    console.log(`🖼️ Image: ${mainImage || 'None found'}`)
    console.log(`📝 Excerpt length: ${betterExcerpt.length} characters`)
  } catch (error) {
    console.error('💥 Fatal error:', error)
  }
}

// Run the script
main()
