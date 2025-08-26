import { Maybe } from 'types/graphql'

import en from '../lang/en.json'
import fr from '../lang/fr.json'
import enOverride from '../lang/override.en.json'
import frOverride from '../lang/override.fr.json'

const getMessages = (
  locale: string,
  groupId?: Maybe<keyof typeof frOverride>
) => {
  if (locale === 'fr') {
    if (groupId && frOverride[groupId]) {
      return {
        ...en,
        ...fr,
        // ...frOverride['b2b-overrides'],
        ...frOverride[groupId],
      }
    }
    return { ...en, ...fr } as Record<string, any>
  }

  if (groupId && enOverride[groupId]) {
    return {
      ...en,
      // ...enOverride['b2b-overrides'],
      ...enOverride[groupId],
    } as Record<string, any>
  }

  return en as Record<string, any>
}

export default getMessages
