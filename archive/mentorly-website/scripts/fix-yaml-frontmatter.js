/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')

// Function to decode HTML entities
function decodeHtmlEntities(text) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#8217;': "'",
    '&#8216;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8211;': '–',
    '&#8212;': '—',
    '&nbsp;': ' ',
    '&hellip;': '...',
    '&mdash;': '—',
    '&ndash;': '–',
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
  }

  let decoded = text
  for (const [entity, replacement] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), replacement)
  }
  return decoded
}

// Function to properly escape YAML values
function escapeYamlValue(value) {
  if (!value) return ''

  // Decode HTML entities first
  let escaped = decodeHtmlEntities(value)

  // If the value contains special characters, wrap in quotes
  if (/[:"'@`|>{}[\]&*#?-]/.test(escaped) || escaped.includes('\n')) {
    // Escape quotes within the string
    escaped = escaped.replace(/"/g, '\\"')
    return `"${escaped}"`
  }

  return escaped
}

// Function to fix a single blog post file
function fixBlogPost(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')

    // Split frontmatter and content
    const parts = content.split('---')
    if (parts.length < 3) {
      console.log(`Skipping ${path.basename(filePath)} - no frontmatter found`)
      return false
    }

    const frontmatterContent = parts[1]
    const postContent = parts.slice(2).join('---')

    // Parse and fix frontmatter line by line
    const lines = frontmatterContent.split('\n')
    const fixedLines = []

    for (let line of lines) {
      const trimmedLine = line.trim()

      // Skip empty lines
      if (!trimmedLine) {
        fixedLines.push('')
        continue
      }

      // Handle tags section specially
      if (trimmedLine === 'tags:') {
        fixedLines.push('tags:')
        continue
      }

      // Fix key-value pairs
      if (trimmedLine.includes(':')) {
        const colonIndex = trimmedLine.indexOf(':')
        const key = trimmedLine.substring(0, colonIndex).trim()
        const value = trimmedLine.substring(colonIndex + 1).trim()

        // Special handling for different fields
        if (key === 'title' || key === 'excerpt') {
          if (value) {
            fixedLines.push(`${key}: ${escapeYamlValue(value)}`)
          } else {
            fixedLines.push(`${key}: ""`)
          }
        } else if (key === 'tags' && !value) {
          // Empty tags - add default tag
          fixedLines.push('tags:')
          fixedLines.push('  - blog')
        } else {
          fixedLines.push(`${key}: ${value}`)
        }
      } else if (trimmedLine.startsWith('- ')) {
        // It's a list item (like tags)
        const tagValue = trimmedLine.substring(2).trim()
        if (tagValue) {
          fixedLines.push(`  - ${tagValue}`)
        }
      } else if (trimmedLine.startsWith('  ')) {
        // Indented content (like metadata)
        fixedLines.push(line)
      } else {
        fixedLines.push(line)
      }
    }

    // Reconstruct the file
    const fixedContent = `---\n${fixedLines.join('\n')}\n---${postContent}`

    // Write back to file
    fs.writeFileSync(filePath, fixedContent, 'utf8')
    console.log(`✅ Fixed: ${path.basename(filePath)}`)
    return true
  } catch (error) {
    console.error(`❌ Error fixing ${path.basename(filePath)}:`, error.message)
    return false
  }
}

// Main function
function main() {
  const blogDir = path.join(__dirname, '../content/blog')

  if (!fs.existsSync(blogDir)) {
    console.error('Blog directory not found:', blogDir)
    return
  }

  const files = fs.readdirSync(blogDir)
  const markdownFiles = files.filter((file) => file.endsWith('.md'))

  console.log(
    `🔧 Fixing YAML frontmatter in ${markdownFiles.length} blog posts...\n`
  )

  let fixed = 0
  let failed = 0

  for (const file of markdownFiles) {
    const filePath = path.join(blogDir, file)
    if (fixBlogPost(filePath)) {
      fixed++
    } else {
      failed++
    }
  }

  console.log(`\n🎉 Summary:`)
  console.log(`✅ Fixed: ${fixed} files`)
  console.log(`❌ Failed: ${failed} files`)
}

// Run the script
main()
