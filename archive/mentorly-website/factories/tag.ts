import faker from '@faker-js/faker'
import { Factory } from 'fishery'
import { Tag } from 'types/graphql'

type Locale = 'en' | 'fr'

type TagTransientParams = {
  locale?: Locale
}

export const tagFactory = Factory.define<Tag, TagTransientParams>(
  ({ transientParams, sequence }) => {
    const name = {
      en: faker.lorem.word(),
      fr: faker.lorem.word(),
    }
    return {
      id: sequence.toString(),
      key: faker.datatype.uuid(),
      isFiltering: faker.datatype.boolean(),
      isPublic: faker.datatype.boolean(),
      nameEn: name['en'],
      nameFr: name['fr'],
      name: name[transientParams.locale as Locale],
    }
  }
)
