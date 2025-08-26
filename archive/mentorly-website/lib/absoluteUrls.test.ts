import { IncomingMessage } from 'http'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'

import absoluteUrl from './absoluteUrl'

beforeEach(() => {
  const href = 'http://localhost:8000/test/?value=something'
  const host = 'localhost:8000'

  global.window = Object.create(window)

  Object.defineProperty(window, 'location', { value: { href, host } })

  expect(window.location.href).toEqual(href)
  expect(window.location.host).toEqual(host)
})

describe('absoluteUrl', () => {
  test('adds https protocol', () => {
    const microsoftReq: Record<string, any> = {
      headers: {
        'x-forwarded-host': 'microsoft.com',
        host: 'Microsoft',
      },
    }

    const result = absoluteUrl(
      microsoftReq as IncomingMessage & { cookies: NextApiRequestCookies }
    )
    expect(result).toStrictEqual({
      host: 'microsoft.com',
      hostname: 'microsoft.com',
      origin: 'https://microsoft.com',
      port: '',
      protocol: 'https:',
    })
  })

  test('adds http protocol for localhost', () => {
    const localhostReq: Record<string, any> = {
      headers: {
        'x-forwarded-host': 'localhost:3010',
        host: 'Mentorly Local',
      },
    }

    const result = absoluteUrl(
      localhostReq as IncomingMessage & { cookies: NextApiRequestCookies }
    )
    expect(result).toStrictEqual({
      host: 'localhost:3010',
      hostname: 'localhost',
      origin: 'http://localhost:3010',
      port: '3010',
      protocol: 'http:',
    })
  })

  test('adds window.location.href when no request', () => {
    const result = absoluteUrl()

    expect(result).toStrictEqual({
      host: 'localhost:8000',
      hostname: 'localhost',
      origin: 'http://localhost:8000',
      port: '8000',
      protocol: 'http:',
    })
  })

  test('sets setLocalhost', () => {
    const localhostReq: Record<string, any> = {
      headers: {
        'x-forwarded-host': 'localhost:3010',
        host: 'Mentorly Local',
      },
    }

    const result = absoluteUrl(
      localhostReq as IncomingMessage & { cookies: NextApiRequestCookies },
      'lvh.me'
    )

    expect(result).toStrictEqual({
      host: 'lvh.me',
      hostname: 'lvh.me',
      origin: 'http://lvh.me',
      port: '',
      protocol: 'http:',
    })
  })
})
