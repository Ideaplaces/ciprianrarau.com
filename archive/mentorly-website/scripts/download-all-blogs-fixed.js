/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

const fs = require('fs')
const path = require('path')
const https = require('https')
const he = require('he')

// WordPress blog base URL
const BLOG_BASE_URL = 'https://mentorlyblog.co'
const REST_API_URL = `${BLOG_BASE_URL}/wp-json/wp/v2/posts`

// HTML entity decoding function using the 'he' library
function decodeHtmlEntities(text) {
  if (!text) return ''
  return he.decode(text)
}

// Utility function to fetch JSON data
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`))
          }
        })
      })
      .on('error', reject)
  })
}

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

// Get all posts from WordPress REST API
async function getAllPosts() {
  const allPosts = []
  let page = 1
  let hasMorePosts = true
  const perPage = 20 // WordPress default

  console.log('🔍 Discovering all blog posts...')

  while (hasMorePosts) {
    try {
      const url = `${REST_API_URL}?page=${page}&per_page=${perPage}&status=publish`
      console.log(`📄 Fetching page ${page}...`)

      const posts = await fetchJson(url)

      if (posts.length === 0) {
        hasMorePosts = false
        break
      }

      allPosts.push(...posts)
      console.log(`✓ Found ${posts.length} posts on page ${page}`)

      page++

      // Add a small delay to be respectful to the server
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('400')) {
        // No more pages
        hasMorePosts = false
      } else {
        console.error(`❌ Error fetching page ${page}:`, error.message)
        hasMorePosts = false
      }
    }
  }

  return allPosts
}

// Extract and clean blog content from HTML
function extractAndCleanBlogContent(html) {
  console.log('🔧 Extracting and cleaning blog content...')

  // Try multiple strategies to find the main content
  let content = null
  let contentStartIndex = -1
  let contentEndIndex = -1

  // Strategy 1: Look for entry-content div with proper nesting
  const entryContentMatch = html.match(
    /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>/i
  )
  if (entryContentMatch) {
    contentStartIndex =
      html.indexOf(entryContentMatch[0]) + entryContentMatch[0].length

    // Find the matching closing div by counting open/close tags
    let openDivs = 1
    let currentIndex = contentStartIndex

    while (openDivs > 0 && currentIndex < html.length) {
      const nextOpenDiv = html.indexOf('<div', currentIndex)
      const nextCloseDiv = html.indexOf('</div>', currentIndex)

      if (nextCloseDiv === -1) break

      if (nextOpenDiv !== -1 && nextOpenDiv < nextCloseDiv) {
        openDivs++
        currentIndex = nextOpenDiv + 4
      } else {
        openDivs--
        currentIndex = nextCloseDiv + 6
        if (openDivs === 0) {
          contentEndIndex = nextCloseDiv
        }
      }
    }

    if (contentEndIndex > contentStartIndex) {
      content = html.substring(contentStartIndex, contentEndIndex)
      console.log('✓ Found blog content using entry-content strategy')
    }
  }

  // Strategy 2: Look for article tag if first strategy failed
  if (!content) {
    const articleMatch = html.match(
      /<article[^>]*class="[^"]*post[^"]*"[^>]*>(.*?)<\/article>/s
    )
    if (articleMatch) {
      content = articleMatch[1]
      console.log('✓ Found blog content using article strategy')
    }
  }

  // Strategy 3: Look for main content area
  if (!content) {
    const mainMatch = html.match(/<main[^>]*>(.*?)<\/main>/s)
    if (mainMatch) {
      content = mainMatch[1]
      console.log('✓ Found blog content using main strategy')
    }
  }

  if (!content) {
    console.log('⚠ Could not find specific content area')
    return null
  }

  // Clean up WordPress-specific elements we don't need
  content = content
    // Remove WordPress navigation elements
    .replace(/<nav[^>]*>.*?<\/nav>/gs, '')
    // Remove comment sections
    .replace(/<div[^>]*class="[^"]*comment[^"]*"[^>]*>.*?<\/div>/gs, '')
    // Remove WordPress meta elements (but keep article content)
    .replace(/<div[^>]*class="[^"]*post-meta[^"]*"[^>]*>.*?<\/div>/gs, '')
    // Remove share buttons and social elements
    .replace(/<div[^>]*class="[^"]*share[^"]*"[^>]*>.*?<\/div>/gs, '')
    .replace(/<div[^>]*class="[^"]*social[^"]*"[^>]*>.*?<\/div>/gs, '')
    // Remove WordPress admin elements
    .replace(/<div[^>]*class="[^"]*admin[^"]*"[^>]*>.*?<\/div>/gs, '')
    // Remove WordPress post navigation
    .replace(/<div[^>]*class="[^"]*post-navigation[^"]*"[^>]*>.*?<\/div>/gs, '')
    .replace(/<div[^>]*class="[^"]*nav-links[^"]*"[^>]*>.*?<\/div>/gs, '')
    // Remove related posts sections
    .replace(/<div[^>]*class="[^"]*related[^"]*"[^>]*>.*?<\/div>/gs, '')
    // Remove comment forms
    .replace(/<div[^>]*id="[^"]*respond[^"]*"[^>]*>.*?<\/div>/gs, '')
    .replace(/<form[^>]*class="[^"]*comment-form[^"]*"[^>]*>.*?<\/form>/gs, '')
    // Clean up excessive whitespace but preserve structure
    .replace(/\s{3,}/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()

  // Decode HTML entities
  content = decodeHtmlEntities(content)

  console.log('✓ Cleaned WordPress content and decoded HTML entities')
  console.log(`📊 Content length: ${content.length} characters`)

  return content
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

// Import WordPress blog with correct metadata from REST API
async function importWordPressBlogWithCorrectDate(postData) {
  try {
    console.log(`🚀 Importing: ${postData.title.rendered}`)

    // Fetch the actual blog page HTML
    console.log(`📥 Fetching HTML from: ${postData.link}`)
    const html = await fetchHtml(postData.link)
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

    // Use the title from WordPress REST API as primary, fallback to extracted title
    const finalTitle =
      decodeHtmlEntities(postData.title.rendered) ||
      seoData.title ||
      'Untitled Blog Post'

    // Generate filename
    const filename = createSlug(finalTitle) + '.html'

    // Extract main image using enhanced function
    const mainImage = extractMainImage(contentHtml) || seoData.image || ''

    // Generate better excerpt using enhanced function
    let betterExcerpt = ''
    if (seoData.description) {
      betterExcerpt = seoData.description
    } else {
      // Use the enhanced excerpt generation
      betterExcerpt = generateExcerpt(contentHtml, finalTitle)
    }

    // If still no good excerpt, fall back to REST API data
    if (!betterExcerpt || betterExcerpt.trim() === '') {
      betterExcerpt =
        decodeHtmlEntities(
          postData.excerpt.rendered.replace(/<[^>]*>/g, '').trim()
        ) || 'Read more about this topic.'
    }

    // Extract tags using enhanced function
    const tags = extractTags(
      contentHtml,
      finalTitle,
      seoData.category || 'Community'
    )

    // Use author from SEO data or fallback to default
    const finalAuthor = seoData.author || 'Mentorly Team'

    // Use category from SEO data or fallback to default
    const finalCategory = seoData.category || 'Community'

    // Create frontmatter with enhanced SEO data and CORRECT date from WordPress REST API
    const frontmatter = `---
publishDate: ${postData.date}
author: ${finalAuthor}
title: ${JSON.stringify(finalTitle)}
excerpt: ${JSON.stringify(betterExcerpt)}
image: ${mainImage}
category: ${finalCategory}
tags: ${JSON.stringify(tags)}
contentType: html

metadata:
  canonical: https://mentorly.com/blog/${createSlug(finalTitle)}
---

`

    // Combine frontmatter and HTML content
    const fileContent = frontmatter + contentHtml

    // Save to content/blog directory
    const filepath = path.join(__dirname, '../content/blog', filename)

    fs.writeFileSync(filepath, fileContent, 'utf8')
    console.log(`✅ Imported and saved as HTML: ${filename}`)
    console.log(`📅 Publish date: ${postData.date}`)
    console.log(`📄 File size: ${Math.round(fileContent.length / 1024)}KB`)
    console.log(`🏷️ Tags added: ${tags.join(', ')}`)
    console.log(`🖼️ Image: ${mainImage || 'None found'}`)
    console.log(`📝 Excerpt length: ${betterExcerpt.length} characters`)

    return {
      filename,
      filepath,
      contentLength: contentHtml.length,
      publishDate: postData.date,
      tags,
      image: mainImage,
      excerpt: betterExcerpt,
    }
  } catch (error) {
    console.error('💥 Fatal error:', error)
    throw error
  }
}

// Download and convert all posts with correct dates
async function downloadAllBlogs(options = {}) {
  const { skipExisting = true, maxPosts = null, delay = 1000 } = options

  try {
    console.log(
      '🚀 Starting bulk WordPress blog download with correct dates...\n'
    )

    // Get all posts from REST API
    const allPosts = await getAllPosts()
    console.log(`\n📊 Total posts found: ${allPosts.length}`)

    if (maxPosts && allPosts.length > maxPosts) {
      allPosts.splice(maxPosts)
      console.log(`🔄 Limiting to first ${maxPosts} posts`)
    }

    // Output directory for downloaded files
    const contentDir = path.join(__dirname, '../content/blog')
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true })
    }

    const results = {
      successful: [],
      failed: [],
      skipped: [],
    }

    console.log('\n📥 Starting download process...\n')

    for (let i = 0; i < allPosts.length; i++) {
      const post = allPosts[i]

      console.log(
        `\n[${i + 1}/${allPosts.length}] Processing: "${post.title.rendered}"`
      )
      console.log(`🔗 URL: ${post.link}`)
      console.log(`📅 Original publish date: ${post.date}`)

      // Generate filename
      const filename = createSlug(post.title.rendered) + '.html'
      const filepath = path.join(contentDir, filename)

      // Check if file already exists
      if (skipExisting && fs.existsSync(filepath)) {
        console.log(`⏭️  Skipping - file already exists: ${filename}`)
        results.skipped.push({
          title: post.title.rendered,
          filename,
          reason: 'File already exists',
        })
        continue
      }

      try {
        // Import with correct date from REST API
        const result = await importWordPressBlogWithCorrectDate(post)

        console.log(`✅ Successfully downloaded: ${filename}`)
        console.log(`📊 Content: ${result.contentLength} characters`)

        results.successful.push({
          title: post.title.rendered,
          filename: result.filename,
          contentLength: result.contentLength,
          publishDate: result.publishDate,
          url: post.link,
        })
      } catch (error) {
        console.error(
          `❌ Failed to download "${post.title.rendered}":`,
          error.message
        )
        results.failed.push({
          title: post.title.rendered,
          url: post.link,
          error: error.message,
        })
      }

      // Add delay between downloads to be respectful
      if (i < allPosts.length - 1) {
        console.log(`⏳ Waiting ${delay}ms before next download...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    // Generate summary report
    console.log('\n' + '='.repeat(60))
    console.log('📋 DOWNLOAD SUMMARY REPORT')
    console.log('='.repeat(60))
    console.log(`✅ Successful downloads: ${results.successful.length}`)
    console.log(`❌ Failed downloads: ${results.failed.length}`)
    console.log(`⏭️  Skipped downloads: ${results.skipped.length}`)
    console.log(`📊 Total processed: ${allPosts.length}`)

    if (results.successful.length > 0) {
      console.log('\n✅ Successfully downloaded:')
      results.successful.forEach((item, index) => {
        console.log(
          `   ${index + 1}. ${item.filename} (${Math.round(
            item.contentLength / 1024
          )}KB) - ${item.publishDate}`
        )
      })
    }

    if (results.failed.length > 0) {
      console.log('\n❌ Failed downloads:')
      results.failed.forEach((item, index) => {
        console.log(`   ${index + 1}. "${item.title}" - ${item.error}`)
      })
    }

    // Save detailed report
    const reportPath = path.join(__dirname, '../download-report-fixed.json')
    const report = {
      timestamp: new Date().toISOString(),
      totalPosts: allPosts.length,
      summary: {
        successful: results.successful.length,
        failed: results.failed.length,
        skipped: results.skipped.length,
      },
      details: results,
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📄 Detailed report saved: ${reportPath}`)

    return results
  } catch (error) {
    console.error('💥 Fatal error during bulk download:', error)
    throw error
  }
}

// Export for use as module
module.exports = { downloadAllBlogs, getAllPosts }

// If run directly from command line
if (require.main === module) {
  const args = process.argv.slice(2)

  // Parse command line options
  const options = {}

  args.forEach((arg) => {
    if (arg.startsWith('--max-posts=')) {
      options.maxPosts = parseInt(arg.split('=')[1])
    }
    if (arg.startsWith('--delay=')) {
      options.delay = parseInt(arg.split('=')[1])
    }
    if (arg === '--overwrite') {
      options.skipExisting = false
    }
  })

  downloadAllBlogs(options)
    .then((results) => {
      console.log(
        '\n🎉 Bulk download with correct dates completed successfully!'
      )
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Bulk download failed:', error.message)
      process.exit(1)
    })
}
