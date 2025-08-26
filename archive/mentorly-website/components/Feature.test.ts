import { Group, User } from 'types/graphql'

import { findFeatureFlag, getFeatureFlag } from './Feature'

const config = {
  default: {
    tagLimit: 1,
    baz: false,
  },
  test: {
    tagLimit: 2,
    baz: ({ user }: { user: User }) => user.name,
  },
}

const group = {
  id: '1',
  slug: 'test',
} as Group

const user = {
  name: 'hello',
}

describe('findFeatureFlag', () => {
  test('finds a numeric flag with a group', () => {
    expect(findFeatureFlag(group, 'tagLimit', config)).toBe(2)
  })

  test('finds the default without a group', () => {
    expect(findFeatureFlag(undefined, 'tagLimit', config)).toBe(1)
  })
})

describe('getFeatureFlag', () => {
  test('finds a numeric flag with a group', () => {
    expect(getFeatureFlag(group, 'tagLimit', { user }, config)).toBe(2)
  })

  test('finds the default without a group', () => {
    expect(getFeatureFlag(undefined, 'tagLimit', { user }, config)).toBe(1)
  })

  test('calls a function flag with a group', () => {
    expect(getFeatureFlag(group, 'baz', { user }, config)).toBe('hello')
  })

  test('reads main config', () => {
    expect(getFeatureFlag(group, 'calendar.socialSync')).toBe(true)
  })
})
