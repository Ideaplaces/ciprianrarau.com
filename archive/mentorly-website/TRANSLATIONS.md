# Translation Management Scripts

This directory contains utility scripts to help manage translations for the Mentorly website.

## Available Scripts

### 1. Sort Translation Files

This script sorts all translation keys alphabetically in all language files.

```bash
./sort-translations.sh
```

**What it does:**

- Alphabetically sorts all keys in all language files (en.json, fr.json, etc.)
- Helps maintain consistent ordering in translation files
- Ensures linter rules are satisfied when keys are added

### 2. Add New Translations

This script adds new translation keys to all language files.

```bash
./add-translation.sh <key> <english_value> [french_value]
```

**Arguments:**

- `key`: The translation key (e.g., `menu.newFeature`)
- `english_value`: The English translation text
- `french_value`: (Optional) The French translation text. If not provided, you'll be prompted for it.

**Options:**

- `--force`: Add this flag to override existing translations without confirmation

**Examples:**

```bash
# Add a translation with both English and French values
./add-translation.sh menu.newFeature "New Feature" "Nouvelle Fonctionnalité"

# Add a translation with just English value (you'll be prompted for French)
./add-translation.sh analytics.insights "Program Analytics Insights"

# Force override an existing translation
./add-translation.sh menu.home "Home" "Accueil" --force
```

## Using Translations in Code

After adding a translation, you can use it in your React components:

```tsx
import { useIntl } from 'react-intl'

const MyComponent = () => {
  const { formatMessage } = useIntl()

  return <div>{formatMessage({ id: 'your.translation.key' })}</div>
}
```

## Best Practices

1. **Use Hierarchical Keys**:

   - Group related translations with prefixes (e.g., `menu.`, `term.`, `error.`)
   - Makes translations easier to find and maintain

2. **Keep Keys Consistent**:

   - Use consistent naming patterns for similar elements
   - E.g., `button.save`, `button.cancel`, `button.delete`

3. **Add New Translations Right Away**:

   - Add translations as soon as you add new UI text
   - Don't wait until the end of development

4. **Sort Regularly**:

   - Run the sort script regularly, especially before commits
   - Avoids linting errors during CI/CD

5. **Document Context**:
   - Add comments in code when translation usage might not be clear
   - Helps translators understand the context of the message
