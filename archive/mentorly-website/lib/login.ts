import cookie from 'js-cookie'
import { AuthProviderEnum, Maybe } from 'types/graphql'

import env, { tokenName } from './env'
import { findRoot } from './envUtils'
import { socialLoginUrl } from './urls'

type GroupType = {
  authProvider?: Maybe<AuthProviderEnum>
  slug: string
}

export const authProviderForGroup = (group?: GroupType) => {
  if (!group || group.authProvider === AuthProviderEnum.Internal) {
    return null
  }

  return group.authProvider
}

export const authUrl = (group?: GroupType) => {
  const provider = authProviderForGroup(group)

  if (provider) {
    return socialLoginUrl({ group: group, type: provider, action: 'signin' })
  }

  return null
}

export const redirectToSamlIfNeeded = (group?: GroupType): boolean => {
  // Check if this is group1 or group2 and should use SAML authentication
  if (
    (group?.slug === 'group1' || group?.slug === 'group2') &&
    typeof window !== 'undefined'
  ) {
    // Directly initiate SAML flow
    window.location.href = `http://localhost:8080/simplesaml/saml2/idp/SSOService.php?spentityid=https://mentorly.co`

    return true
  }

  // Check if this is dkmentorship or empowheringmentorship and should use Duo SAML authentication
  if (
    (group?.slug === 'dkmentorship' ||
      group?.slug === 'empowheringmentorship' ||
      group?.slug === 'dkelevatementorship' ||
      group?.slug === 'dkfinanceanalytics' ||
      group?.slug === 'dkengineering') &&
    typeof window !== 'undefined'
  ) {
    // Redirect directly to the Duo SSO service
    window.location.href = `https://sso-90f18fc1.sso.duosecurity.com/saml2/sp/DITTG6D2C2XM4OAQ83P7/sso`

    return true
  }

  return false
}

const setCookies = (token: string, domain?: string) => {
  cookie.set(tokenName, token, {
    domain: domain,
    expires: 14,
  })

  cookie.set('signedin', 'true', {
    domain: domain,
    expires: 14,
  })
}

const login = (token?: string, domain?: Maybe<string>) => {
  if (!token) {
    console.error('cannot login without token')
    return false
  }

  if (domain) {
    setCookies(token, domain)
  }

  const activeRoot = findRoot(window.location.hostname, env.hostnames)

  setCookies(token, activeRoot)
}

export default login
