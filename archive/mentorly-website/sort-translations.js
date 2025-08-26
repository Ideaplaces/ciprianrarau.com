const fs = require('fs')
const path = require('path')

/**
 * Sort object keys recursively in case-insensitive alphabetical order
 *
 * @param {Object} obj - The object to sort keys for
 * @returns {Object} - New object with sorted keys
 */
function sortObjectKeys(obj) {
  // If not an object or null, return as is
  if (typeof obj !== 'object' || obj === null) return obj

  // If array, sort each element
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  }

  // Sort keys case-insensitively
  const sortedObj = {}
  const keys = Object.keys(obj).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  )

  // Add each key-value pair to the sorted object
  for (const key of keys) {
    sortedObj[key] = sortObjectKeys(obj[key])
  }

  return sortedObj
}

/**
 * Sort translation file keys and save back to the file
 *
 * @param {string} filePath - Path to the translation file
 * @returns {Promise<void>}
 */
async function sortTranslationFile(filePath) {
  try {
    // Read the file
    const data = await fs.promises.readFile(filePath, 'utf8')

    // Parse and sort
    const jsonData = JSON.parse(data)
    const sortedData = sortObjectKeys(jsonData)

    // Format JSON with proper indentation
    const formattedJson = JSON.stringify(sortedData, null, 2)

    // Write back to file with trailing newline
    await fs.promises.writeFile(filePath, formattedJson + '\n', 'utf8')

    console.log(`✓ Sorted keys in ${path.basename(filePath)}`)
  } catch (error) {
    console.error(
      `✗ Error processing ${path.basename(filePath)}:`,
      error.message
    )
  }
}

/**
 * Main function to process all translation files
 */
async function main() {
  const langDir = path.join(__dirname, 'lang')

  try {
    // Get all files in the lang directory
    const files = await fs.promises.readdir(langDir)

    // Process .json files
    const jsonFiles = files.filter((file) => file.endsWith('.json'))

    if (jsonFiles.length === 0) {
      console.log('No JSON files found in the lang directory.')
      return
    }

    console.log(`Found ${jsonFiles.length} translation files to process...`)

    // Sort each file
    const promises = jsonFiles.map((file) => {
      const filePath = path.join(langDir, file)
      return sortTranslationFile(filePath)
    })

    await Promise.all(promises)

    console.log('All translation files sorted successfully!')
  } catch (error) {
    console.error('Error:', error.message)
  }
}

// Execute the script
main().catch(console.error)
