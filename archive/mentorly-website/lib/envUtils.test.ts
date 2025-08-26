import { parseDomain } from './envUtils'

describe('parseDomain', () => {
  test('works with multiple roots', () => {
    const result = parseDomain('mentorly.com', ['mentorly.co', 'mentorly.com'])
    expect(result).toStrictEqual({
      root: true,
      groupId: null,
      branch: null,
      activeRoot: 'mentorly.com',
    })
  })

  test('works with the root', () => {
    const result = parseDomain('mentorly.dev', ['mentorly.dev'])
    expect(result).toStrictEqual({
      root: true,
      groupId: null,
      branch: null,
      activeRoot: 'mentorly.dev',
    })
  })

  test('works with www', () => {
    const result = parseDomain('www.mentorly.dev', ['mentorly.dev'])
    expect(result).toStrictEqual({
      root: true,
      groupId: null,
      branch: null,
      activeRoot: 'mentorly.dev',
    })
  })

  test('works with just a group', () => {
    const result = parseDomain('test.mentorly.dev', ['mentorly.dev'])
    expect(result).toStrictEqual({
      root: false,
      groupId: 'test',
      branch: null,
      activeRoot: 'mentorly.dev',
    })
  })

  test('works with just a branch', () => {
    const result = parseDomain('web-100.mentorly.dev', ['mentorly.dev'])
    expect(result).toStrictEqual({
      root: true,
      groupId: null,
      branch: 'web-100',
      activeRoot: 'mentorly.dev',
    })
  })

  test('works with both group and branch', () => {
    const result = parseDomain('test.web-100.mentorly.dev', ['mentorly.dev'])
    expect(result).toStrictEqual({
      root: false,
      groupId: 'test',
      branch: 'web-100',
      activeRoot: 'mentorly.dev',
    })
  })

  test('returns host as group when root does not match', () => {
    const result = parseDomain('custom-domain.com', ['mentorly.dev'])
    expect(result).toStrictEqual({
      root: false,
      groupId: 'custom-domain.com',
      branch: null,
      activeRoot: 'custom-domain.com',
    })
  })

  test('returns host as group when root does not match', () => {
    const result = parseDomain('mentorly.dlataas.com', ['dlataas.com'], true)
    expect(result).toStrictEqual({
      root: false,
      groupId: 'mentorly.dlataas.com',
      branch: null,
      activeRoot: 'mentorly.dlataas.com',
    })
  })
})
