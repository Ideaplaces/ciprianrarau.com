import env from 'lib/env'

import {
  conferenceUrl,
  groupHost,
  memberUrl,
  parseHost,
  parseUrl,
  profileUrl,
  sessionsHome,
} from './urls'

let windowSpy

const setDev = () => {
  env.development = true
  env.staging = true
  env.production = false
  env.hostnames = ['localhost']
  env.port = '3010'
}
const setProd = () => {
  env.development = false
  env.staging = false
  env.production = true
  env.hostnames = ['mentorly.co']
  env.port = ''
}
const setStaging = () => {
  env.development = false
  env.staging = true
  env.production = false
  env.hostnames = ['mentorly.dev']
  env.port = ''
}

beforeEach(() => {
  windowSpy = jest.spyOn(window, 'window', 'get')
  setProd()
})
afterEach(() => windowSpy.mockRestore())

describe('conferenceUrl', () => {
  const booking = {
    id: 'Zr2edKiGZZVqgeMXCppw',
  }
  const group = {
    meetingProvider: 'jitsi_internal',
  }

  test('does not require user for jitsi_internal', () => {
    const validGroupNoUser = conferenceUrl({ booking, group })
    expect(validGroupNoUser).toBe('/en/conferences/Zr2edKiGZZVqgeMXCppw/jitsi')
  })

  test('updates locale when present', () => {
    const validGroupNoUser = conferenceUrl({ booking, group, locale: 'fr' })
    expect(validGroupNoUser).toBe('/fr/conferences/Zr2edKiGZZVqgeMXCppw/jitsi')
  })

  test('does not require user for jitsi_external', () => {
    const groupJitsiExternal = { ...group, meetingProvider: 'jitsi_external' }
    const result = conferenceUrl({ booking, group: groupJitsiExternal })
    expect(result).toBe('https://meet.jit.si/Zr2edKiGZZVqgeMXCppw')
  })
})

describe('groupHost', () => {
  test('without group', () => {
    setDev()

    const result = groupHost()
    expect(result).toBe('http://marketplace.localhost:3010')
  })
  test('with a custom domain', () => {
    setDev()

    const result = groupHost({ customDomain: 'company.com' })
    expect(result).toBe('https://company.com')
  })
  test('with a slug', () => {
    setDev()

    const result = groupHost({ slug: 'test' })
    expect(result).toBe('http://test.localhost:3010')
  })
  test('in preview branch', () => {
    setStaging()

    windowSpy.mockImplementation(() => ({
      location: {
        host: 'preview.pr-1234.mentorly.dev',
        hostname: 'preview.pr-1234.mentorly.dev',
      },
    }))

    const result = groupHost({ slug: 'preview' })

    expect(result).toEqual('http://preview.pr-1234.mentorly.dev')
  })
})

describe('parseUrl', () => {
  test('it parses a valid url', () => {
    const result = parseUrl('http://something.com')

    expect(result).toEqual('something.com')
  })
  test('returns null for non-valid url', () => {
    const result = parseUrl('http::thisisbad')

    expect(result).toBeNull
  })
})

describe('parseHost', () => {
  test('it extracts the ticket number', () => {
    const result = parseHost('http://preview.pr-1234.mentorly.dev')

    expect(result).toEqual('pr-1234')
  })

  test('it returns null if there is no ticket number', () => {
    const result = parseHost('http://preview.mentorly.dev')

    expect(result).toEqual(null)
  })
})

describe('profileUrl', () => {
  test('no user returns same window', () => {
    const result = profileUrl()
    expect(result).toBe('http://localhost/')
  })
  test('user object without slug or id returns same window', () => {
    const result = profileUrl({ name: 'John' })
    expect(result).toBe('http://localhost/')
  })
  test('url is generated with group slug `test`', () => {
    const user = { name: 'John', slug: 'johnnyboy', group: { slug: 'test' } }
    const result = profileUrl(user)
    expect(result).toBe('/en/mentees/johnnyboy')
  })
  test('bptn-networking is generated with custom mentor override', () => {
    const user = {
      name: 'Ed',
      slug: 'ed',
      mentor: true,
      group: { slug: 'bptn-networking' },
    }
    const result = profileUrl(user)
    expect(result).toBe('/en/members/ed')
  })
})

describe('memberUrl', () => {
  test('bptn-networking returns /members', () => {
    const group = { slug: 'bptn-networking' }
    const result = memberUrl(group)
    expect(result).toBe('/members')
  })
  test('non-mentor users return /mentees', () => {
    const group = { slug: 'another-group' }
    const user = { mentor: false }
    const result = memberUrl(group, '', user)
    expect(result).toBe('/mentees')
  })
  test('missing user props will return /mentors', () => {
    const group = { slug: 'another-group' }
    const result = memberUrl(group)
    expect(result).toBe('/mentors')
  })
  test('userId will return /mentors/userId', () => {
    const group = { slug: 'another-group' }
    const result = memberUrl(group, 'userId')
    expect(result).toBe('/mentors/userId')
  })
})

describe('sessionsHome', () => {
  test('is in /en/dashboard with a custom domain', () => {
    const result = sessionsHome({ customDomain: 'company.com' }, 'en', true)
    expect(result).toBe('https://company.com/en/dashboard/sessions')
  })

  test('is in /fr/dashboard with a slug', () => {
    setDev()

    const result = sessionsHome({ slug: 'test' }, 'fr', true)
    expect(result).toBe('http://test.localhost:3010/fr/dashboard/sessions')
  })

  test('is in /en/personal with a custom domain', () => {
    const result = sessionsHome({ customDomain: 'company.com' }, 'en', false)
    expect(result).toBe('https://company.com/en/personal')
  })

  test('is in /fr/personal with a slug', () => {
    setDev()

    const result = sessionsHome({ slug: 'test' }, 'fr', false)
    expect(result).toBe('http://test.localhost:3010/fr/personal')
  })
})
