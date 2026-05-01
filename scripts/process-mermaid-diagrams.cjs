#!/usr/bin/env node

/* eslint-disable */
// Mermaid diagram processor for ciprianrarau.com (Next.js).
// Scans content/blog/*.md for ```mermaid blocks, renders each to a hashed PNG
// in public/images/diagrams/, inserts/updates ![Diagram N](...) references,
// and stitches an author-specific footer when ImageMagick is available.

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const crypto = require('crypto')

const BLOG_DIR = path.join(__dirname, '../content/blog')
const IMAGES_DIR = path.join(__dirname, '../public/images/diagrams')
const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images')
const MERMAID_FOOTER_DIR = path.join(__dirname, 'mermaid-footer')

const args = process.argv.slice(2)
const FORCE_REGENERATE = args.includes('--force')

const MERMAID_REGEX = /```mermaid\n([\s\S]*?)\n```/g

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true })
}

function extractAuthorFromFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) {
    console.log('  ⚠️  No frontmatter found')
    return null
  }

  const frontmatter = frontmatterMatch[1]
  const authorMatch = frontmatter.match(/^author:\s*(.+)$/m)
  if (!authorMatch) {
    console.log('  ⚠️  No author field found in frontmatter')
    return null
  }

  const author = authorMatch[1].trim().replace(/^["']|["']$/g, '')
  console.log(`  👤 Found author: ${author}`)
  return author
}

function authorToFilename(authorName) {
  if (!authorName) return null

  return authorName
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function getAuthorFooterPath(author) {
  if (!author) return null

  const footerFilename = authorToFilename(author)
  if (!footerFilename) return null

  const footerPath = path.join(MERMAID_FOOTER_DIR, `${footerFilename}.png`)

  if (fs.existsSync(footerPath)) {
    console.log(`  🎯 Using author footer: ${footerFilename}.png`)
    return footerPath
  } else {
    console.log(`  ⚠️  Author footer not found: ${footerPath}`)
    console.log(`      Looking for: ${footerFilename}.png`)
    console.log(`      Available footers: ${fs.existsSync(MERMAID_FOOTER_DIR) ?
      fs.readdirSync(MERMAID_FOOTER_DIR).filter(f => f.endsWith('.png')).join(', ') : 'directory not found'
    }`)
    return null
  }
}

function convertImageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath)
    const imageExtension = path.extname(imagePath).toLowerCase()
    let mimeType = 'image/png'

    switch (imageExtension) {
      case '.png':
        mimeType = 'image/png'
        break
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg'
        break
      case '.gif':
        mimeType = 'image/gif'
        break
      case '.svg':
        mimeType = 'image/svg+xml'
        break
      case '.webp':
        mimeType = 'image/webp'
        break
    }

    const base64Data = imageBuffer.toString('base64')
    return `data:${mimeType};base64,${base64Data}`
  } catch (error) {
    console.warn(`⚠️  Could not convert image ${imagePath} to Base64: ${error.message}`)
    return null
  }
}

function processImagesInMermaidCode(mermaidCode) {
  const imageRegex = /<img\s+[^>]*src=['"]\/images?\/([^'"]+)['"][^>]*>/g

  let processedCode = mermaidCode
  let match

  while ((match = imageRegex.exec(mermaidCode)) !== null) {
    const originalTag = match[0]
    const imagePath = match[1]
    const fullImagePath = path.join(PUBLIC_IMAGES_DIR, imagePath)

    console.log(`  🖼️  Processing image: /images/${imagePath}`)

    if (fs.existsSync(fullImagePath)) {
      const base64Data = convertImageToBase64(fullImagePath)

      if (base64Data) {
        const updatedTag = originalTag.replace(
          /src=['"]\/images?\/[^'"]+['"]/,
          `src="${base64Data}"`
        )

        processedCode = processedCode.replace(originalTag, updatedTag)
        console.log(`  ✅ Converted image to Base64: ${imagePath}`)
      } else {
        console.warn(`  ❌ Failed to convert image to Base64: ${imagePath}`)
      }
    } else {
      console.warn(`  ❌ Image file not found: ${fullImagePath}`)
    }
  }

  return processedCode
}

function generateContentHash(content) {
  const processedContent = processImagesInMermaidCode(content)
  return crypto.createHash('sha256').update(processedContent.trim()).digest('hex').substring(0, 8)
}

function generateScriptHash() {
  try {
    const scriptPath = __filename
    const scriptContent = fs.readFileSync(scriptPath, 'utf8')
    const scriptHash = crypto.createHash('sha256').update(scriptContent).digest('hex').substring(0, 8)
    return scriptHash
  } catch (error) {
    console.warn(`  ⚠️  Could not generate script hash: ${error.message}`)
    return 'fallback'
  }
}

function collectExpectedHashes() {
  console.log('🔍 Scanning blog files to collect expected diagram hashes...')

  const expectedHashes = new Set()
  const blogFiles = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => path.join(BLOG_DIR, file))

  blogFiles.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8')
    const baseName = path.basename(filePath, path.extname(filePath))
    let match

    while ((match = MERMAID_REGEX.exec(content)) !== null) {
      const mermaidCode = match[1].trim()
      const contentHash = generateContentHash(mermaidCode)
      const filename = `${baseName}-diagram-${contentHash}.png`
      expectedHashes.add(filename)
    }
  })

  console.log(`  📊 Found ${expectedHashes.size} expected diagram files`)
  return expectedHashes
}

function cleanupOrphanedDiagrams(expectedHashes) {
  console.log('🧹 Cleaning up orphaned diagram images...')

  try {
    const files = fs.readdirSync(IMAGES_DIR)
    const diagramFiles = files.filter(file => file.endsWith('.png') && file.includes('diagram'))
    let deletedCount = 0

    diagramFiles.forEach(file => {
      if (!expectedHashes.has(file)) {
        const filePath = path.join(IMAGES_DIR, file)
        fs.unlinkSync(filePath)
        console.log(`  🗑️  Deleted orphaned: ${file}`)
        deletedCount++
      }
    })

    console.log(`✅ Cleaned up ${deletedCount} orphaned diagram files`)
  } catch (error) {
    console.warn(`⚠️  Error cleaning up orphaned diagrams: ${error.message}`)
  }
}

function checkMermaidCLI() {
  try {
    execSync('mmdc --version', { stdio: 'pipe' })
    console.log('✅ Mermaid CLI is available')
    return true
  } catch (error) {
    console.log('❌ Mermaid CLI not found. Please install it globally first.')
    console.log('Run: npm install -g @mermaid-js/mermaid-cli')
    return false
  }
}

function checkImageMagick() {
  try {
    execSync('magick -version', { stdio: 'pipe' })
    console.log('✅ ImageMagick is available for image stitching')
    return true
  } catch (error) {
    try {
      execSync('convert -version', { stdio: 'pipe' })
      console.log('✅ ImageMagick (legacy) is available for image stitching')
      return 'legacy'
    } catch (error2) {
      console.log('⚠️  ImageMagick not found. Footer stitching disabled.')
      console.log('   Install ImageMagick for automatic footer stitching.')
      return false
    }
  }
}

function getImageDimensions(imagePath) {
  try {
    const imageMagick = checkImageMagick()
    if (!imageMagick) return null

    const command = imageMagick === 'legacy'
      ? `identify -format "%wx%h" "${imagePath}"`
      : `magick identify -format "%wx%h" "${imagePath}"`

    const output = execSync(command, { stdio: 'pipe' }).toString().trim()
    const [width, height] = output.split('x').map(Number)
    return { width, height }
  } catch (error) {
    console.warn(`  ⚠️  Failed to get image dimensions: ${error.message}`)
    return null
  }
}

function padImageToWidth(sourcePath, targetWidth, outputPath, isFooter = false) {
  const imageMagick = checkImageMagick()
  if (!imageMagick) return false

  try {
    const dimensions = getImageDimensions(sourcePath)
    if (!dimensions) {
      console.log(`  ❌ Could not get ${isFooter ? 'footer' : 'diagram'} dimensions`)
      return false
    }

    console.log(`  📏 ${isFooter ? 'Footer' : 'Diagram'} source: ${dimensions.width}x${dimensions.height}`)

    if (dimensions.width === targetWidth) {
      fs.copyFileSync(sourcePath, outputPath)
      console.log(`  ✅ ${isFooter ? 'Footer' : 'Diagram'} width matches target`)
      return true
    }

    if (dimensions.width > targetWidth) {
      console.log(`  ⚠️  ${isFooter ? 'Footer' : 'Diagram'} is wider than target, this shouldn't happen`)
      fs.copyFileSync(sourcePath, outputPath)
      return true
    }

    const command = imageMagick === 'legacy'
      ? `convert "${sourcePath}" -background white -gravity center -extent ${targetWidth}x${dimensions.height} "${outputPath}"`
      : `magick "${sourcePath}" -background white -gravity center -extent ${targetWidth}x${dimensions.height} "${outputPath}"`

    execSync(command, { stdio: 'pipe' })
    console.log(`  🎯 Padded ${isFooter ? 'footer' : 'diagram'}: ${dimensions.width}px → ${targetWidth}px`)
    return true
  } catch (error) {
    console.warn(`  ⚠️  Failed to pad ${isFooter ? 'footer' : 'diagram'}: ${error.message}`)
    return false
  }
}

function stitchWithFooter(diagramPath, outputPath, authorFooterPath = null) {
  const imageMagick = checkImageMagick()

  if (!imageMagick) {
    if (diagramPath !== outputPath) {
      fs.copyFileSync(diagramPath, outputPath)
    }
    return false
  }

  try {
    const dimensions = getImageDimensions(diagramPath)
    if (!dimensions) {
      console.log('  ⚠️  Could not determine diagram width, using original')
      if (diagramPath !== outputPath) {
        fs.copyFileSync(diagramPath, outputPath)
      }
      return false
    }

    const diagramDimensions = dimensions
    console.log(`  📐 Diagram dimensions: ${diagramDimensions.width}x${diagramDimensions.height}`)

    let sourceFooterPath = authorFooterPath

    if (!sourceFooterPath || !fs.existsSync(sourceFooterPath)) {
      sourceFooterPath = path.join(PUBLIC_IMAGES_DIR, 'mermaid-footer.png')
      if (!fs.existsSync(sourceFooterPath)) {
        console.log('  ⚠️  No footer image found, using original diagram')
        if (!authorFooterPath) {
          console.log('      No author-specific footer available')
        }
        console.log(`      Fallback footer not found: ${sourceFooterPath}`)
        if (diagramPath !== outputPath) {
          fs.copyFileSync(diagramPath, outputPath)
        }
        return false
      } else {
        console.log('  📄 Using fallback footer: mermaid-footer.png')
      }
    }

    const footerDimensions = getImageDimensions(sourceFooterPath)
    if (!footerDimensions) {
      console.log('  ⚠️  Could not get footer dimensions, using original diagram')
      if (diagramPath !== outputPath) {
        fs.copyFileSync(diagramPath, outputPath)
      }
      return false
    }

    console.log(`  📐 Footer dimensions: ${footerDimensions.width}x${footerDimensions.height}`)

    const targetWidth = Math.max(diagramDimensions.width, footerDimensions.width)
    console.log(`  🎯 Target width: ${targetWidth}px`)

    const paddedDiagramPath = path.join(__dirname, `diagram-padded-${targetWidth}.png`)
    const paddedFooterPath = path.join(__dirname, `footer-padded-${targetWidth}.png`)

    const diagramPadded = padImageToWidth(diagramPath, targetWidth, paddedDiagramPath, false)
    if (!diagramPadded) {
      console.log('  ⚠️  Failed to pad diagram, using original')
      if (diagramPath !== outputPath) {
        fs.copyFileSync(diagramPath, outputPath)
      }
      return false
    }

    const footerPadded = padImageToWidth(sourceFooterPath, targetWidth, paddedFooterPath, true)
    if (!footerPadded) {
      console.log('  ⚠️  Failed to pad footer, using original diagram')
      if (diagramPath !== outputPath) {
        fs.copyFileSync(diagramPath, outputPath)
      }
      if (fs.existsSync(paddedDiagramPath)) {
        fs.unlinkSync(paddedDiagramPath)
      }
      return false
    }

    const command = imageMagick === 'legacy'
      ? `convert "${paddedDiagramPath}" "${paddedFooterPath}" -append "${outputPath}"`
      : `magick "${paddedDiagramPath}" "${paddedFooterPath}" -append "${outputPath}"`

    execSync(command, { stdio: 'pipe' })
    console.log('  🔗 Stitched diagram with properly aligned footer')

    if (fs.existsSync(paddedDiagramPath)) {
      fs.unlinkSync(paddedDiagramPath)
    }
    if (fs.existsSync(paddedFooterPath)) {
      fs.unlinkSync(paddedFooterPath)
    }

    return true
  } catch (error) {
    console.warn(`  ⚠️  Failed to stitch footer: ${error.message}`)
    if (diagramPath !== outputPath) {
      fs.copyFileSync(diagramPath, outputPath)
    }
    return false
  }
}

function convertMermaidToImage(mermaidCode, outputPath, authorFooterPath = null) {
  const tempMermaidFile = path.join(__dirname, 'temp-diagram.mmd')
  const configFile = path.join(__dirname, 'mermaid-config.json')
  const tempOutputPath = outputPath.replace('.png', '-temp.png')

  try {
    const processedMermaidCode = processImagesInMermaidCode(mermaidCode)

    const config = {
      theme: 'base',
      background: 'white',
      themeVariables: {
        background: '#ffffff',
        primaryColor: '#ffffff',
        primaryTextColor: '#000000',
        primaryBorderColor: '#1565C0',
        secondaryColor: '#ffffff',
        secondaryTextColor: '#000000',
        secondaryBorderColor: '#1565C0',
        tertiaryColor: '#ffffff',
        tertiaryTextColor: '#000000',
        tertiaryBorderColor: '#1565C0',
        lineColor: '#333333',
        textColor: '#000000',
        mainBkg: '#ffffff',
        actorBkg: '#ffffff',
        actorBorder: '#1565C0',
        actorTextColor: '#000000',
        actorLineColor: '#333333',
        signalColor: '#333333',
        signalTextColor: '#000000',
        labelBoxBkgColor: '#ffffff',
        labelBoxBorderColor: '#1565C0',
        labelTextColor: '#000000',
        loopTextColor: '#000000',
        noteBkgColor: '#ffffcc',
        noteBorderColor: '#aaaa33',
        noteTextColor: '#000000',
        activationBkgColor: '#e3f2fd',
        activationBorderColor: '#1565C0',
        sequenceNumberColor: '#ffffff',
        nodeBorder: '#1565C0',
        clusterBkg: '#f5f5f5',
        clusterBorder: '#1565C0',
        defaultLinkColor: '#333333',
        titleColor: '#000000',
        edgeLabelBackground: '#ffffff',
        fontFamily: 'arial, sans-serif',
        fontSize: '16px',
        actorFontSize: '18px',
        actorFontFamily: 'arial, sans-serif',
        actorFontWeight: 'bold',
        messageFontSize: '14px',
        messageFontFamily: 'arial, sans-serif',
        noteFontSize: '14px',
        noteFontFamily: 'arial, sans-serif'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        nodeSpacing: 30,
        rankSpacing: 40,
        padding: 15
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
        mirrorActors: false,
        useMaxWidth: true
      },
      puppeteerConfig: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      }
    }

    fs.writeFileSync(configFile, JSON.stringify(config, null, 2))
    fs.writeFileSync(tempMermaidFile, processedMermaidCode)

    const command = `mmdc -i "${tempMermaidFile}" -o "${tempOutputPath}" -c "${configFile}" --scale 2 --width 1200 --height 800`
    execSync(command, { stdio: 'pipe' })

    const stitched = stitchWithFooter(tempOutputPath, outputPath, authorFooterPath)

    if (fs.existsSync(tempOutputPath)) {
      fs.unlinkSync(tempOutputPath)
    }

    const footerInfo = stitched ?
      (authorFooterPath ? ' (with author footer)' : ' (with fallback footer)') :
      ''
    console.log(`✅ Generated: ${path.basename(outputPath)}${footerInfo}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to generate ${path.basename(outputPath)}:`, error.message)
    return false
  } finally {
    if (fs.existsSync(tempMermaidFile)) {
      fs.unlinkSync(tempMermaidFile)
    }
    if (fs.existsSync(configFile)) {
      fs.unlinkSync(configFile)
    }
    if (fs.existsSync(tempOutputPath)) {
      fs.unlinkSync(tempOutputPath)
    }
  }
}

function updateFrontmatterImage(content, firstDiagramPath) {
  const frontmatterMatch = content.match(/^(---\n)([\s\S]*?)(\n---)/)
  if (!frontmatterMatch) {
    return content
  }

  const frontmatterStart = frontmatterMatch[1]
  const frontmatterContent = frontmatterMatch[2]
  const frontmatterEnd = frontmatterMatch[3]

  const imageMatch = frontmatterContent.match(/^image:\s*.+$/m)

  let updatedFrontmatter
  if (imageMatch) {
    updatedFrontmatter = frontmatterContent.replace(
      /^image:\s*.+$/m,
      `image: ${firstDiagramPath}`
    )
    console.log(`  🖼️  Updated frontmatter image to first diagram`)
  } else {
    const excerptMatch = frontmatterContent.match(/^excerpt:.*(?:\n(?![\w]).*)*$/m)
    if (excerptMatch) {
      const insertIndex = excerptMatch.index + excerptMatch[0].length
      updatedFrontmatter =
        frontmatterContent.substring(0, insertIndex) +
        `\nimage: ${firstDiagramPath}` +
        frontmatterContent.substring(insertIndex)
    } else {
      updatedFrontmatter = frontmatterContent + `\nimage: ${firstDiagramPath}`
    }
    console.log(`  🖼️  Added frontmatter image field`)
  }

  return frontmatterStart + updatedFrontmatter + frontmatterEnd + content.substring(frontmatterMatch[0].length)
}

function processMarkdownFile(filePath) {
  console.log(`\n📄 Processing: ${path.basename(filePath)}`)

  const content = fs.readFileSync(filePath, 'utf8')
  const baseName = path.basename(filePath, path.extname(filePath))
  let updatedContent = content
  let diagramCount = 0
  let firstDiagramPath = null

  const author = extractAuthorFromFrontmatter(content)
  const authorFooterPath = getAuthorFooterPath(author)

  if (FORCE_REGENERATE) {
    console.log('  🔄 Force regeneration enabled - will recreate all diagrams')
  }

  const matches = []
  let match

  while ((match = MERMAID_REGEX.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      mermaidCode: match[1].trim(),
      index: match.index
    })
  }

  if (matches.length > 0) {
    const firstMatch = matches[0]
    const firstContentHash = generateContentHash(firstMatch.mermaidCode)
    const firstFilename = `${baseName}-diagram-${firstContentHash}.png`
    firstDiagramPath = `/images/diagrams/${firstFilename}`
  }

  const totalDiagrams = matches.length
  matches.reverse().forEach((matchData, reverseIndex) => {
    const diagramNumber = totalDiagrams - reverseIndex
    diagramCount++

    const contentHash = generateContentHash(matchData.mermaidCode)
    const filename = `${baseName}-diagram-${contentHash}.png`
    const imagePath = path.join(IMAGES_DIR, filename)
    const relativeImagePath = `/images/diagrams/${filename}`

    let imageGenerated = false
    const shouldGenerate = !fs.existsSync(imagePath) || FORCE_REGENERATE

    if (shouldGenerate) {
      imageGenerated = convertMermaidToImage(matchData.mermaidCode, imagePath, authorFooterPath)
      if (imageGenerated) {
        const reason = FORCE_REGENERATE ? 'force regenerated' : 'generated new'
        console.log(`  📊 ${reason} diagram ${diagramCount} (hash: ${contentHash})`)
      }
    } else {
      console.log(`  ⏩ Skipped diagram ${diagramCount} (already exists, hash: ${contentHash})`)
      imageGenerated = true
    }

    if (imageGenerated) {
      const scriptHash = generateScriptHash()
      const cacheBustedImagePath = `${relativeImagePath}?v=${scriptHash}`

      const afterMermaidIndex = matchData.index + matchData.fullMatch.length
      const afterMermaidContent = updatedContent.substring(afterMermaidIndex, afterMermaidIndex + 200)
      const existingImageMatch = afterMermaidContent.match(/^\s*\n\s*!\[Diagram [^\]]*\]\([^)]+\)/)

      if (existingImageMatch) {
        const newImageRef = `![Diagram ${diagramNumber}](${cacheBustedImagePath})`
        updatedContent = updatedContent.substring(0, afterMermaidIndex) +
                        afterMermaidContent.replace(existingImageMatch[0], `\n\n${newImageRef}`) +
                        updatedContent.substring(afterMermaidIndex + afterMermaidContent.length)
        console.log(`  🔄 Updated diagram ${diagramCount} image reference (script hash: ${scriptHash})`)
      } else {
        const replacement = `${matchData.fullMatch}\n\n![Diagram ${diagramNumber}](${cacheBustedImagePath})`
        updatedContent = updatedContent.substring(0, matchData.index) +
                        replacement +
                        updatedContent.substring(matchData.index + matchData.fullMatch.length)
        console.log(`  ➕ Added diagram ${diagramCount} image reference (script hash: ${scriptHash})`)
      }
    }
  })

  if (firstDiagramPath) {
    updatedContent = updateFrontmatterImage(updatedContent, firstDiagramPath)
  }

  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent)
    console.log(`  ✅ Updated markdown file with ${diagramCount} diagram(s)`)
  } else if (diagramCount === 0) {
    console.log(`  ℹ️  No mermaid diagrams found`)
  }

  return diagramCount
}

function main() {
  console.log('🚀 Starting Mermaid Diagram Processing...\n')

  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node scripts/process-mermaid-diagrams.cjs [options]')
    console.log('Options:')
    console.log('  --force    Force regeneration of all diagrams even if hash unchanged')
    console.log('  --help     Show this help message')
    console.log('')
    console.log('Features:')
    console.log('  📊 Automatically extracts author from markdown frontmatter')
    console.log('  🎯 Uses author-specific footer from scripts/mermaid-footer/')
    console.log('  🔄 Smart hash-based caching (unless --force is used)')
    process.exit(0)
  }

  if (!checkMermaidCLI()) {
    process.exit(1)
  }

  checkImageMagick()

  if (FORCE_REGENERATE) {
    console.log('⚡ Force regeneration mode enabled')
  }

  const expectedHashes = collectExpectedHashes()
  cleanupOrphanedDiagrams(expectedHashes)

  const blogFiles = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => path.join(BLOG_DIR, file))

  console.log(`\n📁 Found ${blogFiles.length} blog post(s) to process\n`)

  let totalDiagrams = 0
  blogFiles.forEach((filePath) => {
    totalDiagrams += processMarkdownFile(filePath)
  })

  console.log(`\n🎉 Processing complete!`)
  console.log(`   📊 Total diagrams processed: ${totalDiagrams}`)
  console.log(`   📁 Images saved to: ${path.relative(process.cwd(), IMAGES_DIR)}`)
}

if (require.main === module) {
  main()
}

module.exports = { processMarkdownFile, convertMermaidToImage }
