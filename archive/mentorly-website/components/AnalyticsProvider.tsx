import isBrowser from 'lib/isBrowser'
import { useCurrentUser } from 'lib/UserContext'
import { event } from 'nextjs-google-analytics'
import { ReactNode, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

// Add gtag to window type
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Record<string, unknown>,
      config?: Record<string, unknown>
    ) => void
  }
}

// IP Exclusion Configuration
const EXCLUDED_IPS = [
  '24.200.112.112', // Chip's IP
  '74.59.216.185', // Ashley's IP
  // Add more team member IPs here:
  // '192.168.1.100', // Team member 1
  // '10.0.0.50',     // Team member 2
]

// Email Domain Exclusion Configuration
const EXCLUDED_EMAIL_DOMAINS = [
  'mentorly.co',
  'mentorly.com',
  // Add more internal domains if needed:
  // 'mentorly.com',
]

// Function to check if email should be excluded
const isExcludedEmail = (email: string | null | undefined): boolean => {
  if (!email) return false
  return EXCLUDED_EMAIL_DOMAINS.some((domain) =>
    email.toLowerCase().endsWith(`@${domain.toLowerCase()}`)
  )
}

// Function to get user's IP address
const getUserIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Could not fetch IP address for analytics exclusion:', error)
    return null
  }
}

// Cookie handling utilities
const setCookie = (name: string, value: string, days = 365) => {
  if (!isBrowser()) return
  const expires = new Date(Date.now() + 864e5 * days).toUTCString()
  document.cookie =
    name +
    '=' +
    encodeURIComponent(value) +
    '; expires=' +
    expires +
    '; path=/; SameSite=Lax'
}

const getCookie = (name: string): string | null => {
  if (!isBrowser()) return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2)
    return decodeURIComponent(parts.pop()?.split(';').shift() || '')
  return null
}

// Custom implementation of global properties since nextjs-google-analytics doesn't export GA
let globalProperties: Record<string, any> = {}

// Custom function to set global properties for all events
const setGlobalProperties = (properties: Record<string, any>) => {
  globalProperties = { ...globalProperties, ...properties }
}

// Custom function to get global properties
const getGlobalProperties = () => {
  return { ...globalProperties }
}

// Wrap the event function to automatically include global properties
const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  event(eventName, { ...getGlobalProperties(), ...params })
}

interface AnalyticsProviderProps {
  children: ReactNode
}

const ANONYMOUS_ID_COOKIE = 'mentorly_anonymous_id'
const IP_CHECK_COOKIE = 'mentorly_ip_checked'

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const { currentUser, loading } = useCurrentUser()
  const [anonymousId, setAnonymousId] = useState<string | null>(null)
  const [isExcludedIP, setIsExcludedIP] = useState<boolean>(false)
  const [ipCheckComplete, setIpCheckComplete] = useState<boolean>(false)

  // Check if current user should be excluded based on email
  const isExcludedUser = currentUser
    ? isExcludedEmail(currentUser.contactEmail)
    : false

  // Determine if analytics should be disabled (either IP or email exclusion)
  const shouldDisableAnalytics = isExcludedIP || isExcludedUser

  // Check if current IP is excluded
  useEffect(() => {
    if (!isBrowser()) return

    const checkIP = async () => {
      // Check if we've already verified this session
      const ipChecked = getCookie(IP_CHECK_COOKIE)
      if (ipChecked) {
        setIsExcludedIP(ipChecked === 'excluded')
        setIpCheckComplete(true)
        return
      }

      // Get current IP and check against exclusion list
      const currentIP = await getUserIP()
      if (currentIP && EXCLUDED_IPS.includes(currentIP)) {
        setIsExcludedIP(true)
        setCookie(IP_CHECK_COOKIE, 'excluded', 1) // Cache for 1 day
      } else {
        setIsExcludedIP(false)
        setCookie(IP_CHECK_COOKIE, 'allowed', 1) // Cache for 1 day
      }
      setIpCheckComplete(true)
    }

    checkIP()
  }, [])

  // Log exclusion status for debugging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && ipCheckComplete) {
      if (isExcludedUser) {
        // eslint-disable-next-line no-console
        console.log(
          `🚫 Analytics disabled for team email: ${currentUser?.contactEmail}`
        )
      } else if (isExcludedIP) {
        // eslint-disable-next-line no-console
        console.log('🚫 Analytics disabled for excluded IP address')
      } else {
        // eslint-disable-next-line no-console
        console.log('✅ Analytics enabled')
      }
    }
  }, [isExcludedUser, isExcludedIP, ipCheckComplete, currentUser?.contactEmail])

  // Set up or retrieve anonymous ID on first render
  useEffect(() => {
    if (isBrowser() && !shouldDisableAnalytics) {
      let id = getCookie(ANONYMOUS_ID_COOKIE)

      if (!id) {
        id = uuidv4()
        setCookie(ANONYMOUS_ID_COOKIE, id)
      }

      setAnonymousId(id)
    }
  }, [shouldDisableAnalytics])

  // Configure GA with user information when available
  useEffect(() => {
    if (!isBrowser() || loading || !ipCheckComplete || shouldDisableAnalytics)
      return

    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

    // For authenticated users, use their ID as primary identifier
    if (currentUser?.id) {
      // Configure measurement with the ID and user properties
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        user_id: currentUser.id.toString(),
        send_page_view: false,
      })

      // Set user properties for BigQuery export
      window.gtag?.('set', {
        user_id: currentUser.id.toString(),
        user_properties: {
          user_email: currentUser.contactEmail || 'unknown',
          user_role: currentUser.mentor ? 'mentor' : 'mentee',
          user_group: currentUser.group?.id || 'none',
          user_name: currentUser.name || 'unknown',
          authenticated: true,
          anonymous_id: anonymousId,
        },
      })

      // Track authenticated user session
      window.gtag?.('event', 'user_authenticated', {
        user_id: currentUser.id.toString(),
        user_email: currentUser.contactEmail || 'unknown',
        anonymous_id: anonymousId,
        first_session: !localStorage.getItem(`authenticated_${currentUser.id}`),
        is_mentor: !!currentUser.mentor,
        group_id: currentUser.group?.id || 'none',
      })

      // Mark this user as having been authenticated before
      localStorage.setItem(`authenticated_${currentUser.id}`, 'true')

      // Set custom user property for all future events
      setGlobalProperties({
        user_id: currentUser.id.toString(),
        user_email: currentUser.contactEmail || 'unknown',
        user_role: currentUser.mentor ? 'mentor' : 'mentee',
        user_group: currentUser.group?.id || 'none',
        authenticated: true,
        anonymous_id: anonymousId,
      })
    } else if (anonymousId) {
      // For anonymous users, use the consistent anonymous ID

      // Configure measurement
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        user_id: anonymousId,
        send_page_view: false,
      })

      // Set user properties
      window.gtag?.('set', {
        user_id: anonymousId,
        user_properties: {
          authenticated: false,
          anonymous_id: anonymousId,
        },
      })

      // Track anonymous session
      window.gtag?.('event', 'anonymous_session', {
        anonymous_id: anonymousId,
      })

      // Set custom properties for all future events
      setGlobalProperties({
        anonymous_id: anonymousId,
        authenticated: false,
      })
    }
  }, [
    currentUser,
    anonymousId,
    loading,
    ipCheckComplete,
    shouldDisableAnalytics,
  ])

  return <>{children}</>
}

// Export the provider and utilities
export default AnalyticsProvider
export { trackEvent, setGlobalProperties, getGlobalProperties }
