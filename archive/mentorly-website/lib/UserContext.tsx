import { gql } from '@apollo/client'
import * as Sentry from '@sentry/browser'
// import Alert from 'components/feedback/Alert'
import Redirect from 'components/Redirect'
import { useRouter } from 'lib/router'
import { startUrl } from 'lib/urls'
import { createContext, ReactNode, useContext, useEffect, VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useCurrentUserQuery } from 'types/graphql'

import isBrowser from './isBrowser'

gql`
  query currentUser {
    viewer {
      ...CurrentUserFields
    }
  }
  fragment CurrentUserFields on CurrentUser {
    id
    isActive
    calendarUrl
    contactEmail
    name
    dateOfBirth
    userRole
    intercomHash
    stripeCustomer {
      id
    }
    alternates {
      id
      group {
        id
        name
        loginUrl
      }
      userRole
    }
    avatar {
      id
      color
      initials
      imageUrl(height: 64, width: 64)
    }
    files {
      id
      imageUrl(height: 128, width: 192)
      mimeType
      fileUrl
    }
    group {
      id
      name
      slug
      startsAt
      endsAt
      allowGroupSessions
      allowMasterclasses
      plan {
        id
        name
      }
    }
    mentorlyAdmin
    menteeSessionsRemaining
    mentorSessionsRemaining
    accounts {
      id
      name
      slug
      groups {
        id
        customDomain
        name
        slug
      }
    }
    legacyGroup
    mentor
    allowGroupSessions
    tags {
      id
      key
      name
      nameEn: name(locale: "en")
      nameFr: name(locale: "fr")
    }
    slug
    managedGroups {
      id
      key
      languages {
        code
      }
    }
    timezone
    createdAt
  }
`

type UserContextProps = {
  currentUser?: any
  loading: boolean
  refetch?: (...args: any) => void
}

const UserContext = createContext<UserContextProps>({
  loading: false,
  currentUser: undefined,
})

const gatedPages = [
  // these are the default pages to gate
  // we could add more to features.json and
  // each group could decide which pages to gate in addition to these

  // values are what immediately follows the /[locale]/ of pathname
  'dashboard',
  'personal',
  'schedule',
  'onboarding',
]

const activeGatedPages = ['dashboard', 'personal', 'schedule']

export type UserProviderProps = {
  children: ReactNode
}

export const UserProvider: VFC<UserProviderProps> = ({ children }) => {
  const { locale } = useIntl()
  const { push, asPath } = useRouter() || {}
  const { data, loading, error, refetch } = useCurrentUserQuery()
  const currentUser = data && data.viewer

  useEffect(() => {
    if (error) {
      Sentry.captureMessage(error.message)
      toast.error('Error loading user')
      console.error(error.message)
    }
  }, [!error])

  // if (error) {
  //   return (
  //     <Alert
  //       className="m-4"
  //       title="Error loading user"
  //       type="error"
  //       showIcon
  //       description={error.message}
  //     />
  //   )
  // }

  const path = asPath?.replace(/\/(en|fr)\//, '')
  const isGatedPage = gatedPages.some((pg) => new RegExp(`^${pg}`).test(path))
  const isActiveGatedPage = activeGatedPages.some((pg) =>
    new RegExp(`^${pg}`).test(path)
  )
  const userMissing = !loading && !currentUser
  const shouldRequireLogin = isBrowser() && userMissing && isGatedPage

  if (isActiveGatedPage && currentUser && !currentUser.isActive) {
    return (
      <Redirect url={startUrl(locale, currentUser?.group || { slug: 'api' })} />
    )
  }

  if (shouldRequireLogin) {
    //   // how to prevent current page from loading before redirect?
    //   // adding to UserContext is fastest so far, but still happens
    push(`/${locale}/login?redirectPath=${path}`)
  }

  return (
    <UserContext.Provider value={{ loading, currentUser, refetch }}>
      {children}
    </UserContext.Provider>
  )
}

export const useCurrentUser = () => {
  return useContext(UserContext)
}

export default UserContext
