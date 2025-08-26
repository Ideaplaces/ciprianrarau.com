import env from 'lib/env'

import { gateRedirectGroup } from './gateRedirectGroup'

const setProd = () => {
  env.development = false
  env.staging = false
  env.production = true
}
const setDev = () => {
  env.development = false
  env.staging = false
  env.production = true
}

beforeEach(() => setProd())
afterEach(() => setDev())

describe('gateRedirectGroup', () => {
  test('no currentGroup is present', () => {
    const currentGroup = undefined
    const user = { group: { id: 2 } }
    const result = gateRedirectGroup(user, currentGroup)
    expect(result.id).toBe(2)
  })

  test('user not managing the group in the url', () => {
    const currentGroup = { id: 1 }
    const user = { group: { id: 2 } }
    const result = gateRedirectGroup(user, currentGroup)
    expect(result.id).toBe(2)
  })

  test('user managing the group in the url', () => {
    const currentGroup = { id: 1 }
    const user = {
      group: { id: 4 },
      accounts: [
        { groups: { id: 1 } },
        {
          groups: [{ id: 2 }, { id: 3 }],
        },
      ],
    }
    const result = gateRedirectGroup(user, currentGroup)
    expect(result.id).toBe(1)
  })
})
