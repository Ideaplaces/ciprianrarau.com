import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'
import { compact } from 'lodash'
import { Group, Location as LocationType } from 'types/graphql'

import { groupFactory } from './group'

export const locationFactory = Factory.define<LocationType>(
  ({ sequence, params }) => {
    const id = sequence.toString()
    const name = faker.lorem.words(1 + faker.datatype.number(2))
    const premise = faker.lorem.words(faker.datatype.number(2))
    const fullName = compact([name, premise]).join(', ')
    const administrativeArea = faker.datatype.boolean()
      ? faker.address.state()
      : undefined
    const locality = faker.datatype.boolean() ? faker.address.city() : undefined
    const postalCode = faker.datatype.boolean()
      ? faker.address.zipCode()
      : undefined
    const thoroughfare = faker.datatype.boolean()
      ? faker.address.streetAddress()
      : undefined
    const country = faker.datatype.boolean()
      ? faker.address.country()
      : undefined
    const address = compact([
      name,
      premise,
      thoroughfare,
      locality,
      administrativeArea,
      postalCode,
      country,
    ]).join(', ')

    return {
      id,
      key: faker.datatype.uuid(),
      name,
      group: (params.group || groupFactory.build()) as Group,
      premise,
      fullName,
      administrativeArea,
      locality,
      postalCode,
      thoroughfare,
      country,
      address,
    }
  }
)
