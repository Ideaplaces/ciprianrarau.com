import { faker } from '@faker-js/faker'

const mocks = {
  ISO8601DateTime: () => {
    return new Date().toISOString()
  },
  Avatar: () => ({
    imageUrl: faker.image.people(300, 300, !!'randomize'),
  }),
}

export default mocks
