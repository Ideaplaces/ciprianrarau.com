import cookie from 'js-cookie'
import { Maybe } from 'types/graphql'

import env, { tokenName } from './env'
import { findRoot } from './envUtils'

const removeCookies = (domain?: string) => {
  cookie.remove(tokenName, {
    domain: domain,
  })

  cookie.remove('signedin', { domain: domain })
}

const logout = (domain: Maybe<string> = null) => {
  cookie.remove('token')
  cookie.remove('signedin')

  if (domain) {
    removeCookies(domain)
  }

  const activeRoot = findRoot(window.location.hostname, env.hostnames)

  removeCookies(activeRoot)
}

export default logout
