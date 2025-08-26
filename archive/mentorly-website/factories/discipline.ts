import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'
import { Discipline } from 'types/graphql'

export const disciplineFactory = Factory.define<Discipline>(({ sequence }) => ({
  id: sequence.toString(),
  name: faker.name.jobType(),
  slug: faker.lorem.slug(),
  userCount: 0,
}))
