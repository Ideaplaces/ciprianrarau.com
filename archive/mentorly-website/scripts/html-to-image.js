#!/usr/bin/env node

const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

async function htmlToImage(htmlFile, outputFile, options = {}) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
    ],
  })

  try {
    const page = await browser.newPage()

    // Set viewport size
    await page.setViewport({
      width: options.width || 1200,
      height: options.height || 800,
      deviceScaleFactor: options.scale || 2, // For high-quality images
    })

    // Convert HTML file to absolute file URL
    const htmlPath = path.resolve(htmlFile)
    const fileUrl = `file://${htmlPath}`

    // Navigate to the HTML file (this allows relative paths to work)
    await page.goto(fileUrl, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
    })

    // Wait a bit more for any custom fonts or animations
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Take screenshot - either of specific element or full page
    const screenshotOptions = {
      path: outputFile,
      type: options.format || 'png',
      omitBackground: options.transparent || false,
    }

    if (
      options.quality &&
      (options.format === 'jpeg' || options.format === 'jpg')
    ) {
      screenshotOptions.quality = options.quality
    }

    // If selector is provided, screenshot just that element
    if (options.selector) {
      const element = await page.$(options.selector)
      if (!element) {
        throw new Error(`Element not found: ${options.selector}`)
      }
      await element.screenshot(screenshotOptions)
    } else {
      // Full page screenshot
      screenshotOptions.fullPage = options.fullPage !== false
      await page.screenshot(screenshotOptions)
    }

    // eslint-disable-next-line no-console
    console.log(`✅ Image saved to: ${outputFile}`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error converting HTML to image:', error)
    throw error
  } finally {
    await browser.close()
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    // eslint-disable-next-line no-console
    console.log(`
Usage: node html-to-image.js <input.html> [output.png] [options]

Options:
  --width <number>     Viewport width (default: 1200)
  --height <number>    Viewport height (default: 800)
  --scale <number>     Device scale factor (default: 2)
  --format <format>    Image format: png, jpeg, webp (default: png)
  --quality <number>   JPEG quality 0-100 (default: 90)
  --transparent        Make background transparent (PNG only)
  --no-full-page       Don't capture full page
  --selector <string>  CSS selector to capture specific element only

Examples:
  node html-to-image.js input.html
  node html-to-image.js input.html output.png
  node html-to-image.js input.html output.jpg --format jpeg --quality 95
  node html-to-image.js input.html output.png --width 1920 --height 1080
  node html-to-image.js input.html output.png --selector .footer-container
    `)
    process.exit(1)
  }

  const inputFile = args[0]

  // Determine if args[1] is an output file or an option
  let outputFile
  let optionsStartIndex

  if (args[1] && !args[1].startsWith('--')) {
    // args[1] is the output file
    outputFile = args[1]
    optionsStartIndex = 2
  } else {
    // No output file specified, generate it automatically
    outputFile = inputFile.replace(/\.[^/.]+$/, '.png')
    optionsStartIndex = 1
  }

  // Parse options
  const options = {}
  for (let i = optionsStartIndex; i < args.length; i += 2) {
    const option = args[i]
    const value = args[i + 1]

    switch (option) {
      case '--width':
        options.width = parseInt(value)
        break
      case '--height':
        options.height = parseInt(value)
        break
      case '--scale':
        options.scale = parseFloat(value)
        break
      case '--format':
        options.format = value
        break
      case '--quality':
        options.quality = parseInt(value)
        break
      case '--transparent':
        options.transparent = true
        i-- // No value for this flag
        break
      case '--no-full-page':
        options.fullPage = false
        i-- // No value for this flag
        break
      case '--selector':
        options.selector = value
        break
    }
  }

  if (!fs.existsSync(inputFile)) {
    // eslint-disable-next-line no-console
    console.error(`❌ Input file not found: ${inputFile}`)
    process.exit(1)
  }

  try {
    await htmlToImage(inputFile, outputFile, options)
  } catch (_error) {
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { htmlToImage }
