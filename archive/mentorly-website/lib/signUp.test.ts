import env from 'lib/env'
import { Group } from 'types/graphql'

import { allowSignUpGroupUser } from './signUp'

const groupWithSignUp = { id: '1', slug: 'test' } as Group
const groupWithoutSignUp = { id: '1', slug: 'sxsw-2022' } as Group

const setProd = () => {
  env.development = false
  env.staging = false
  env.production = true
  env.hostnames = ['mentorly.co']
}
const setDev = () => {
  env.development = true
  env.staging = false
  env.production = false
  env.hostnames = ['mentorly.dev']
}

beforeEach(() => {
  setProd()
})

describe('signUp', () => {
  test(`production env follows config`, () => {
    setProd()
    expect(allowSignUpGroupUser(groupWithSignUp)).toBe(true)
    expect(allowSignUpGroupUser(groupWithoutSignUp)).toBe(false)
  })
  test(`non-production env follows config`, () => {
    setDev()
    expect(allowSignUpGroupUser(groupWithSignUp)).toBe(true)
    expect(allowSignUpGroupUser(groupWithoutSignUp)).toBe(false)
  })
})
