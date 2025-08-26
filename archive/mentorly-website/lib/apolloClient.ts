import { ApolloClient } from '@apollo/client'
import { InMemoryCache } from '@apollo/client/cache'
import { ApolloLink, HttpLink } from '@apollo/client/core'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import cookie from 'js-cookie'
import { apolloLog } from 'lib/debug'
import { storageAvailable } from 'lib/featureDetection'

import { tokenName } from './env'
import isBrowser from './isBrowser'

const GRAPHQL_URI = `${process.env.NEXT_PUBLIC_API_URL}/graphql`
const DEFAULT_TIME_ZONE = 'UTC'

const timeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (_e) {
    return DEFAULT_TIME_ZONE
  }
}

export const getAuthToken = () => {
  return cookie.get(tokenName)
}

const customFetch = async (uri: RequestInfo, options: any) => {
  let token = getAuthToken()

  if (token) {
    if (!token.startsWith('Bearer')) {
      token = `Bearer ${token}`
    }

    options.headers['authorization'] = token
  }

  if (storageAvailable('localStorage')) {
    const impersonateUserId = localStorage.getItem('impersonateUserId')
    if (impersonateUserId) {
      options.headers['X-Impersonate-User-Id'] = impersonateUserId
    }
  }

  options.headers['X-Time-Zone'] = timeZone()

  const showLogs = true // apolloLog.enabled && !isBrowser()

  if (showLogs) {
    const parsedBody = JSON.parse(options.body)

    if (Array.isArray(parsedBody)) {
      parsedBody.forEach((e) => {
        apolloLog(e.operationName, e.variables)
      })
    } else {
      apolloLog(parsedBody.operationName, parsedBody.variables)
    }
  }

  const response = await fetch(uri, options)
  if (showLogs) {
    apolloLog(` -> ${response.statusText}`)
  }
  return response
}

const cacheConfig = {
  typePolicies: {
    CurrentUser: {
      fields: {
        conversations: {
          // Don't cache separate results based on
          // any of this field's arguments.
          keyArgs: ['search'],
          // Concatenate the incoming list items with
          // the existing list items.
          merge(existing: any[] = [], incoming: any[]) {
            return [...existing, ...incoming]
          },
        },
        timeSlots: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          merge(_: any[] = [], incoming: any[]) {
            return incoming
          },
        },
      },
    },
    Group: {
      fields: {
        styles: {
          merge(existing: any = {}, incoming: any) {
            return { ...existing, ...incoming }
          },
        },
      },
    },
  },
}

export default function createApolloClient(
  initialState: any = {},
  ctx: any = undefined,
  props: any = {}
) {
  const headers = {
    'X-Group-Id': props.groupId ? props.groupId : '',
    'X-Host': props.host ? props.host : '',
  }

  const Link = process.env.NODE_ENV !== 'production' ? HttpLink : BatchHttpLink

  const link = ApolloLink.from([
    new Link({
      uri: GRAPHQL_URI, // Server URL (must be absolute)
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      fetch: customFetch,
      headers: headers,
    }),
  ])

  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: !isBrowser() || Boolean(ctx),
    link: link,
    cache: new InMemoryCache(cacheConfig).restore(initialState),
    connectToDevTools: true,
  })
}
