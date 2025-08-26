import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'
import { Account } from 'types/graphql'

export const accountFactory = Factory.define<Account>(({ sequence }) => {
  return {
    id: sequence.toString(),
    name: faker.company.companyName(),
    slug: faker.lorem.slug(),
    groups: [],
    inAppBilling: true,
    requiresPlan: false,
  }
})
