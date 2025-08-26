import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'
import { ConnectionInfo, UserConnections } from 'types/graphql'

export const connectionInfoFactory = Factory.define<ConnectionInfo>(() => ({
  calendarProvider: faker.datatype.boolean(),
  connected: faker.datatype.boolean(),
  connectionUrl: faker.internet.url(),
  disconnectable: faker.datatype.boolean(),
  email: faker.internet.email(),
  id: faker.datatype.uuid(),
  loginProvider: faker.datatype.boolean(),
  meetingProvider: faker.datatype.boolean(),
  name: 'None',
  needsAuth: false,
}))

export const userConnectionFactory = Factory.define<UserConnections>(() => ({
  facebook: connectionInfoFactory.build({ name: 'Facebook' }),
  google: connectionInfoFactory.build({ name: 'Google' }),
  linkedin: connectionInfoFactory.build({ name: 'LinkedIn' }),
  microsoft: connectionInfoFactory.build({ name: 'Microsoft' }),
  zoom: connectionInfoFactory.build({ name: 'Zoom' }),
}))
