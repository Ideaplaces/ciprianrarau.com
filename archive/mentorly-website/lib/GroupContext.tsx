import { gql } from '@apollo/client'
import ArchivedError from 'components/statusPage/Archived'
import Loading from 'components/statusPage/Loading'
import NoGroupError from 'components/statusPage/NoGroup'
import { useRouter } from 'lib/router'
import { each } from 'lodash'
import { createContext, ReactNode, useContext, VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  GroupEssentialsFieldsFragment,
  GroupStyles,
  Maybe,
  TrialInfoFieldsFragmentDoc,
  useGroupEssentialsQuery,
} from 'types/graphql'

gql`
  query groupEssentials($id: ID, $locale: String) {
    group(id: $id) {
      ...GroupEssentialsFields
    }
  }
  fragment GroupEssentialsFields on Group {
    id
    key
    analyticsRestricted
    account {
      id
      slug
      ...TrialInfoFields
    }
    archived
    authProvider
    plan {
      id
      name
      groupLimit
      managerLimit
      userLimit
      archivedAt
    }
    managers {
      id
      name
    }
    backgroundImages {
      id
      imageUrl(width: 1000)
    }
    cohorts {
      id
      name
    }
    locations {
      id
      name
      premise
      fullName
      administrativeArea
      locality
      postalCode
      thoroughfare
      country
    }
    customDomain
    allowGroupSessions
    allowMasterclasses
    autoAcceptBookingRequests
    disciplines {
      id
      name(locale: $locale)
      nameEn: name(locale: "en")
      nameFr: name(locale: "fr")
      slug
      subdisciplines(locale: $locale) {
        id
        name(locale: $locale)
        nameEn: name(locale: "en")
        nameFr: name(locale: "fr")
        slug
      }
    }
    independentSubdisciplines {
      id
      name(locale: $locale)
      nameEn: name(locale: "en")
      nameFr: name(locale: "fr")
      slug
    }
    hasIndependentSubdisciplines
    endsAt
    files {
      id
      imageUrl(height: 128, width: 192)
      fileUrl
      type
    }
    legacy
    marketplace
    languages {
      code
    }
    logoImage(locale: $locale) {
      id
      imageUrl(width: 500)
    }
    memberCount
    manualMatching
    autoMatching
    mentorMaxSessions
    menteeMaxSessions
    hideMentors
    name
    sessionLengths
    skipOnboarding
    slug
    startsAt
    styles {
      accentColor
      accentTextColor
      backgroundColor
      backgroundTextColor
      highlightColor
      fontLink
      fontName
      titleFontLink
      titleFontName
    }
    subtitle(locale: $locale)
    tag
    tags {
      id
      name
      key
    }
    meetingProvider
    title(locale: $locale)
    url
    useNylas
    whiteLabel
    pageLogoImage(locale: $locale) {
      id
      imageUrl(height: 100)
    }
    partnerLogoImages(locale: $locale) {
      id
      imageUrl(height: 192)
      url
    }
    languages {
      id
    }
    ${TrialInfoFieldsFragmentDoc}
  }
`

type GroupContextType = {
  currentGroup?: Maybe<GroupEssentialsFieldsFragment>
  groupId?: string
  isDashboard: boolean
  loading: boolean
  isPersonal: boolean
  marketplace: boolean
  hasServerSideProps: boolean
  refetch?: (variables: any) => any
}

const GroupContext = createContext<GroupContextType>({
  isDashboard: false,
  loading: false,
  isPersonal: false,
  marketplace: false,
  currentGroup: undefined,
  hasServerSideProps: false,
  groupId: undefined,
})

type StylesProps = {
  styles?: Maybe<GroupStyles>
}

const Styles: VFC<StylesProps> = ({ styles }) => {
  const styleAttribute: Array<string> = []

  if (styles) {
    each(styles, (v: any, k: string) => {
      if (v && k !== '__typename') {
        styleAttribute.push(`--${k}: ${v}`)
      }
    })
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `body { ${styleAttribute.join(';\n')} }`,
      }}
    />
  )
}

export const MockGroupProvider: VFC<any> = ({
  children,
  group,
  hasServerSideProps = false,
  isDashboard = false,
  isPersonal = false,
  marketplace = false,
}) => {
  return (
    <GroupContext.Provider
      value={{
        currentGroup: group,
        loading: false,
        hasServerSideProps,
        isDashboard,
        isPersonal,
        marketplace,
        refetch: () => {},
      }}
    >
      {children}
    </GroupContext.Provider>
  )
}

type GroupProviderProps = {
  children: ReactNode
  hasServerSideProps: boolean
  groupId?: string
}

export const GroupProvider: VFC<GroupProviderProps> = ({
  children,
  hasServerSideProps,
  groupId,
}) => {
  const { asPath } = useRouter()
  const { formatMessage, locale } = useIntl()

  const isDashboard = asPath.includes('/dashboard')
  const isPersonal = asPath.includes('/personal')
  const marketplace = groupId === 'marketplace'
  const skip = !groupId || !hasServerSideProps || !locale
  const variables = { id: groupId, locale }

  const noGroup = groupId
    ? formatMessage({ id: 'error.noGroupFound' }, { slug: groupId })
    : formatMessage({ id: 'error.noGroup' })

  const { data, loading, error, refetch } = useGroupEssentialsQuery({
    skip,
    variables,
  })

  if (!hasServerSideProps) {
    return <>{children}</>
  }

  if (!groupId) {
    if (isDashboard) {
      return <NoGroupError message={noGroup} />
    }
    return <>{children}</>
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <NoGroupError message="We have been notified of the error and will be resolving it shortly" />
    )
  }

  const currentGroup = data?.group

  // if (!currentGroup?.customDomain && groupId != currentGroup?.slug) {
  //   return <div>Moved!</div>
  // }

  if (currentGroup?.archived) {
    return <ArchivedError group={currentGroup} />
  }

  if (isDashboard && !currentGroup) {
    return <NoGroupError message={noGroup} />
  }

  return (
    <GroupContext.Provider
      value={{
        currentGroup,
        groupId,
        loading,
        hasServerSideProps,
        isDashboard,
        isPersonal,
        marketplace,
        refetch,
      }}
    >
      <Styles
        styles={!isDashboard && currentGroup ? currentGroup.styles : undefined}
      />
      {children}
    </GroupContext.Provider>
  )
}

type UseCurrentGroupResultType = {
  currentGroup: NonNullable<GroupEssentialsFieldsFragment>
  groupId: string
  isDashboard: boolean
  isPersonal: boolean
  loading: boolean
  marketplace: boolean
}

export const useCurrentGroup = () => {
  const result = useContext(GroupContext)

  if (!result.currentGroup && result.hasServerSideProps) {
    console.error('no group')
  }

  return result as UseCurrentGroupResultType
}

export default GroupContext
