const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

/**
 * Sort object keys recursively in case-insensitive alphabetical order
 *
 * @param {Object} obj - The object to sort keys for
 * @returns {Object} - New object with sorted keys
 */
function sortObjectKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return obj

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  }

  const sortedObj = {}
  const keys = Object.keys(obj).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  )

  for (const key of keys) {
    sortedObj[key] = sortObjectKeys(obj[key])
  }

  return sortedObj
}

/**
 * Add translation key and sort file
 *
 * @param {string} filePath - Path to the translation file
 * @param {string} key - Translation key to add
 * @param {string} value - Translation value
 * @returns {boolean} - Success status
 */
async function addTranslation(filePath, key, value) {
  try {
    // Read the file
    const data = await fs.promises.readFile(filePath, 'utf8')

    // Parse JSON
    const jsonData = JSON.parse(data)

    // Check if key already exists
    if (jsonData[key] !== undefined) {
      console.log(
        `Key '${key}' already exists in ${path.basename(
          filePath
        )} with value: "${jsonData[key]}"`
      )

      // Ask to override
      if (process.argv.includes('--force')) {
        console.log(`Overriding with new value: "${value}"`)
      } else {
        const answer = await askQuestion(
          `Do you want to override it with "${value}"? (y/N): `
        )
        if (answer.toLowerCase() !== 'y') {
          console.log('Skipping this file.')
          return false
        }
      }
    }

    // Add/update the key
    jsonData[key] = value

    // Sort keys
    const sortedData = sortObjectKeys(jsonData)

    // Format with proper indentation
    const formattedJson = JSON.stringify(sortedData, null, 2)

    // Write back to file with trailing newline
    await fs.promises.writeFile(filePath, formattedJson + '\n', 'utf8')

    console.log(`✓ Added/updated '${key}' in ${path.basename(filePath)}`)
    return true
  } catch (error) {
    console.error(
      `✗ Error processing ${path.basename(filePath)}:`,
      error.message
    )
    return false
  }
}

/**
 * Ask a question in the console and get the answer
 *
 * @param {string} query - Question to ask
 * @returns {Promise<string>} - User's answer
 */
function askQuestion(query) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    readline.question(query, (answer) => {
      readline.close()
      resolve(answer)
    })
  })
}

/**
 * Main function
 */
async function main() {
  // Check arguments
  if (process.argv.length < 4) {
    console.log(`
Usage: node add-translation.js <key> <english_value> [french_value]

Arguments:
  key             Translation key (e.g., 'menu.newFeature')
  english_value   English translation value
  french_value    (Optional) French translation value. If not provided, you'll be prompted for it.

Options:
  --force         Skip confirmation when overriding existing translations

Examples:
  node add-translation.js menu.newFeature "New Feature" "Nouvelle Fonctionnalité"
  node add-translation.js analytics.insights "Program Analytics Insights"
    `)
    process.exit(1)
  }

  const key = process.argv[2]
  const enValue = process.argv[3]
  let frValue = process.argv[4]

  // Validate key format
  if (!/^[a-zA-Z0-9.]+$/.test(key)) {
    console.error('Error: Key should only contain letters, numbers, and dots.')
    process.exit(1)
  }

  // If French translation is not provided, ask for it
  if (!frValue) {
    frValue = await askQuestion(
      `Enter French translation for '${key}' (English: "${enValue}"): `
    )
    if (!frValue.trim()) {
      console.log('Using English value for French translation.')
      frValue = enValue
    }
  }

  console.log('\nAdding translations:')
  console.log(`Key: ${key}`)
  console.log(`English: "${enValue}"`)
  console.log(`French: "${frValue}"`)
  console.log('-----------------------------------')

  const langDir = path.join(__dirname, 'lang')
  const enPath = path.join(langDir, 'en.json')
  const frPath = path.join(langDir, 'fr.json')

  // Add to English file
  const enSuccess = await addTranslation(enPath, key, enValue)

  // Add to French file
  const frSuccess = await addTranslation(frPath, key, frValue)

  if (enSuccess && frSuccess) {
    console.log('\n✓ Translations added successfully!')

    // Sort all files to ensure proper ordering
    try {
      console.log('\nSorting all translation files...')
      execSync('./sort-translations.sh', { stdio: 'inherit' })
    } catch (error) {
      console.error('Error sorting translation files:', error.message)
    }
  } else {
    console.log(
      '\n× Some translations were not added. Please check the errors above.'
    )
  }
}

// Run the script
main().catch(console.error)
