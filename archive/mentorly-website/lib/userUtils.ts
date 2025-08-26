import { isNil, reject, uniq } from 'lodash'

type OtherObjectType<T> =
  | T & {
      id: string
    }

export const otherObjects = <T>(
  users: OtherObjectType<T>[],
  currentUser: OtherObjectType<T>
): T[] => {
  return reject(users, (u) => u.id === currentUser.id)
}

export const removeNils = <T>(collection: (T | null | undefined)[]): T[] => {
  return uniq(reject(collection, isNil)) as T[]
}

// Utility functions for user-related checks

// Email Domain Exclusion Configuration (same as in AnalyticsProvider)
const MENTORLY_EMAIL_DOMAINS = ['mentorly.co', 'mentorly.com']

/**
 * Check if a user is a Mentorly admin based on their email domain
 * @param email - User's email address
 * @returns boolean - true if the user has a Mentorly email domain
 */
export const isMentorlyAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false
  return MENTORLY_EMAIL_DOMAINS.some((domain) =>
    email.toLowerCase().endsWith(`@${domain.toLowerCase()}`)
  )
}

/**
 * Check if a user is a Mentorly admin based on user object
 * @param user - User object with contactEmail property
 * @returns boolean - true if the user has a Mentorly email domain
 */
export const isMentorlyUser = (
  user: { contactEmail?: string | null } | null | undefined
): boolean => {
  if (!user?.contactEmail) return false
  return isMentorlyAdmin(user.contactEmail)
}
