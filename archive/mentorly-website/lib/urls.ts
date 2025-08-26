import { User } from '@sentry/browser'
import { getAuthToken } from 'lib/apolloClient'
import env from 'lib/env'
import { parseDomain } from 'lib/envUtils'
import { isBrowser, isServer } from 'lib/isBrowser'
import { compact } from 'lodash'
import {
  AuthProviderEnum,
  Booking,
  BookingLocationFieldsFragment,
  CurrentUser,
  Group,
  ManagedGroup,
  ManagedUser,
  Maybe,
} from 'types/graphql'

type GroupHostProps = {
  customDomain?: Maybe<string>
  slug: string
  useNylas?: Maybe<boolean>
}
type GroupSlugType = {
  slug: string
}

const PR_REGEX = /pr-[0-9]{3,6}/

const getLocation = () => {
  if (isServer()) {
    return {
      href: '/',
      host: '',
    }
  } else {
    return window.location
  }
}

export const headerLogoLink = (url?: Maybe<string>, locale = 'en') => {
  return url || `/${locale}`
}

export type MemberUrlProps = {
  group?: GroupSlugType
  userId?: string
  user?: Pick<User | ManagedUser, 'mentor'>
}

const SLUG_MAPPING: Record<string, string> = {
  'bptn-networking': '/members',
  // 'lululemon-coaches': '/coaches',
}

export const memberUrl = (
  group?: MemberUrlProps['group'],
  userId?: MemberUrlProps['userId'],
  user?: MemberUrlProps['user']
) => {
  let path = '/mentors'

  if (group?.slug && group.slug in SLUG_MAPPING) {
    path = SLUG_MAPPING[group.slug]
  } else if (user && !user.mentor) {
    path = `/mentees`
  }

  if (userId) {
    path = `${path}/${userId}`
  }
  return path
}

export type ProfileUrlUserProps = {
  mentor: (User | CurrentUser)['mentor']
  slug?: Maybe<(User | CurrentUser)['slug']>
  id: (User | CurrentUser)['id']
  group?: Maybe<Pick<Group | ManagedGroup, 'slug'>>
}

//TODO this is being passed a group as user?
export const profileUrl = (
  user?: ProfileUrlUserProps,
  locale = 'en',
  group = undefined
) => {
  if (!user) return getLocation().href

  if (!('slug' in user) && !('id' in user)) {
    return getLocation().href
  }

  const userUrl = user.slug || user.id

  if (user.mentor) {
    return `/${locale}${memberUrl(user.group || group, userUrl)}`
  }
  return `/${locale}/mentees/${userUrl}`
}

export const apiUrl = (locale = 'en', path = '') => {
  let result = env.apiDomain

  if (locale == 'fr') {
    result += '/fr'
  }

  result += path

  return result
}

export const appUrl = (locale = 'en', group: GroupSlugType, path = '') => {
  let result = groupDomain(group.slug).replace('3010', '3000')

  if (locale == 'fr') {
    result += '/fr'
  }

  result += path

  return result
}

export const startUrl = (locale = 'en', group: GroupSlugType) => {
  const token = getAuthToken()

  return appUrl(locale, group, `/start/${token}`)
}

export const checkoutUrl = (locale = 'en', group: GroupSlugType) => {
  const token = getAuthToken()

  return appUrl(locale, group, `/checkout/new?user_token=${token}`)
}

export const checkoutReturnUrl = (locale = 'en', group: GroupSlugType) => {
  const token = getAuthToken()

  return appUrl(locale, group, `/checkout?user_token=${token}`)
}

export const productsUrl = (locale = 'en', group: GroupSlugType, user: any) => {
  return appUrl(locale, group, `/products?user_token=${user.uid}`)
}

export const settingsUrl = (locale = 'en', group: GroupSlugType, path = '') => {
  let result = '/settings'

  if (path != '') {
    result += path
  }

  return appUrl(locale, group, result)
}

export const parseHost = (host?: string) => {
  if (!host) {
    return null
  }

  const ticket = (host.match(PR_REGEX) || [])[0]

  return ticket || null
}

export const groupDomain = (slug: string) => {
  let root = env.hostnames[0]
  let subDomain = slug

  if (isBrowser()) {
    const domainParts = parseDomain(window.location.hostname, env.hostnames)

    if (domainParts.activeRoot) {
      root = domainParts.activeRoot
    }

    // Check if we're in a preview/PR branch
    if (domainParts.branch && domainParts.branch.match(/pr-\d+/)) {
      // For preview branches like preview.pr-1234.mentorly.dev
      // we need to preserve the PR branch in the URL
      return `${env.scheme}://${slug}.${domainParts.branch}.${domainParts.activeRoot}`
    }

    if (domainParts.branch) {
      // Only use the branch if it doesn't match the slug
      if (domainParts.groupId !== slug) {
        subDomain = `${slug}.${domainParts.branch}`
      }
    }
  }

  // Only add port in development environment, not in staging/production
  if (env.port && env.development === true) {
    root = `${root}:${env.port}`
  }

  return `${env.scheme}://${subDomain}.${root}`
}

export const groupHost = (group?: Maybe<GroupHostProps>) => {
  if (!group) {
    return groupDomain('marketplace')
  }

  if (group.customDomain) {
    return `https://${group.customDomain}`
  }

  // For preview slug, if we're in a PR preview environment, use the hostname with PR number
  if (
    group.slug === 'preview' &&
    isBrowser() &&
    window.location.hostname.includes('pr-')
  ) {
    return `${env.scheme}://${window.location.hostname}`
  }

  if (group.slug) {
    return groupDomain(group.slug)
  }

  return env.clientDomain
}

export const baseUrl = (group?: GroupHostProps, locale?: string) => {
  return `${groupHost(group)}/${locale}`
}

type conferenceUrlProps = {
  booking: Pick<Booking, 'id'>
  group: Pick<Group, 'meetingProvider'>
  locale: string
}
export const conferenceUrl = ({
  booking,
  group,
  locale = 'en',
}: conferenceUrlProps) => {
  const provider = group?.meetingProvider

  switch (provider) {
    case 'jitsi_external':
      return `https://meet.jit.si/${booking.id}`
    case 'jitsi_internal':
      return `/${locale}/conferences/${booking.id}/jitsi`
    default:
      return `/${locale}/conferences/${booking.id}/jitsi`
  }
}

export const parseUrl = (link: string) => {
  try {
    const url = new URL(link)
    return url.hostname + (url.pathname.length > 1 ? '/...' : '')
  } catch (_e) {
    return null
  }
}

export const sessionUrl = (
  booking: { group: GroupHostProps; id: Booking['id'] },
  locale: string,
  group: GroupHostProps
) => {
  const sessionGroup = group || booking.group
  return `${baseUrl(sessionGroup, locale)}/sessions/${booking.id}`
}

export const sessionIndexUrl = (locale: string, isDashboard: boolean) => {
  const suffix = isDashboard ? 'dashboard/sessions' : 'personal'
  return `/${locale}/${suffix}`
}

export const sessionsHome = (
  group: GroupHostProps,
  locale: string,
  isDashboard: boolean
) => {
  const path = isDashboard ? 'dashboard/sessions' : 'personal'
  return `${baseUrl(group, locale)}/${path}`
}

export const sessionEdit = (
  booking: {
    id: Pick<Booking, 'id'>
    group: GroupHostProps
  },
  locale: string,
  isDashboard: boolean
) => {
  const path = sessionsHome(booking.group, locale, isDashboard)
  return `${path}/edit?id=${booking.id}`
}

export const calendarProviderUrl = (provider: string) => {
  return {
    microsoft: 'https://outlook.live.com/calendar/',
    google: 'https://calendar.google.com/calendar/u/',
  }[provider]
}

export const addressFromLocation = (
  location?: Maybe<BookingLocationFieldsFragment>
) => {
  if (!location) return {}

  const {
    fullName,
    name,
    address,
    thoroughfare,
    administrativeArea,
    locality,
    country,
  } = location || {}

  const fullAddress =
    address ||
    compact([thoroughfare, administrativeArea, locality, country]).join(', ')

  const addressString = compact([fullName || name, fullAddress]).join(', ')

  const mapUrl =
    'https://google.com/maps/search/?api=1&query=' + encodeURI(addressString)

  return { fullName, addressString, mapUrl, name }
}

export type SocialLoginActions = 'signin' | 'signup'

type socialLoginUrlProps = {
  type: AuthProviderEnum
  action: SocialLoginActions
  group?: Maybe<GroupHostProps>
}

const NYLAS_SCOPES: Record<AuthProviderEnum, string | undefined> = {
  facebook: undefined,
  google: undefined,
  internal: undefined,
  linkedin: undefined,
  microsoft: undefined,
}

export const socialLoginUrl = ({
  type,
  action,
  group,
}: socialLoginUrlProps) => {
  let href = process.env.NEXT_PUBLIC_API_URL
  let ticket = null
  let host = null

  if (isBrowser()) {
    ticket = parseHost(window?.location?.host)

    const domainParts = parseDomain(window.location.hostname, env.hostnames)

    if (domainParts.activeRoot) {
      host = domainParts.activeRoot
    }

    if (env.port) {
      host = `${host}:${env.port}`
    }
  }

  href += `/auth/${type}?action=${action}`
  if (group) {
    href += `&group=${group.slug}`
  }

  if (ticket) {
    href += `&ticket=${ticket}`
  }

  if (group?.useNylas && NYLAS_SCOPES[type]) {
    href += `&scope=${NYLAS_SCOPES[type]}`
  }

  if (host) {
    href += `&host=${host}`
  }

  return href
}

export const reportsUrl = (
  groupKey: string,
  report: string,
  format = 'csv',
  locale = 'en'
) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/groups/${groupKey}/reports/${report}.${format}?locale=${locale}`
}
