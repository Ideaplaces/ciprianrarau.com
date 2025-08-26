import { gql } from '@apollo/client'
import { ButtonLink } from 'components/Button/Button'
import MatchingArrows from 'components/icons/MatchingArrows'
import { useCurrentGroup } from 'lib/GroupContext'
import { settingsUrl } from 'lib/urls'
import { groupUserPermissionsForForm } from 'lib/userFormPermissions'
import Link from 'next/link'
import { AlertCircle, Calendar, Clock, Eye, Icon, User } from 'react-feather'
import { useIntl } from 'react-intl'
import { Maybe, NextStepsFieldsFragment } from 'types/graphql'

gql`
  fragment NextStepsFields on CurrentUser {
    calendarId
    calendarProvider
    hasAvailability
    matchingPercent
    mentor
    needsAuth
    needsCalendarConnection
    profilePercent
  }
`

type NextStepsProps = {
  hasBookings?: boolean
  hasConnectedCalendar?: boolean
  loading?: boolean
  user?: Maybe<NextStepsFieldsFragment>
}

type OptionType = {
  title: string
  description: string
  buttonText: string
  href: string
  icon: Icon
  show: boolean
}

const status = (user: NextStepsFieldsFragment) => {
  return {
    profileComplete: user.profilePercent === 100,
    matchingComplete: user.matchingPercent === 100,
  }
}

const NextSteps = ({ hasBookings, loading, user }: NextStepsProps) => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()

  if (!currentGroup || !user || loading) return null

  const { hasReadOnly: profileLimited } = groupUserPermissionsForForm(
    currentGroup,
    user,
    'userProfile'
  )

  const { profileComplete, matchingComplete } = status(user)
  const groupHasMatching =
    currentGroup?.autoMatching || currentGroup?.manualMatching || false

  const options: OptionType[] = [
    {
      title: 'header.connectCalendar',
      description: 'header.connectCalendar.description',
      buttonText: 'button.connect',
      href: settingsUrl(locale, currentGroup, '/connections'),
      icon: Calendar,
      show: user.needsCalendarConnection,
    },
    {
      title: 'header.connectCalendarError',
      description: 'header.connectCalendarError.description',
      buttonText: 'button.connect',
      href: settingsUrl(locale, currentGroup, '/connections'),
      icon: AlertCircle,
      show: user.needsAuth,
    },
    {
      title: 'header.completingProfile',
      description: 'header.completingProfile.description',
      buttonText: 'button.complete',
      href: `/${locale}/personal/profile`,
      icon: User,
      show: !profileComplete && !profileLimited,
    },
    {
      title: 'header.completingMatching',
      description: 'header.completingMatching.description',
      buttonText: 'button.complete',
      href: `/${locale}/personal/questions`,
      icon: MatchingArrows,
      show: groupHasMatching && !matchingComplete,
    },
    {
      title: 'header.discoveringMatches',
      description: 'header.discoveringMatches.description',
      buttonText: 'button.discover',
      href: `/${locale}/personal/matches`,
      icon: MatchingArrows,
      show: groupHasMatching && matchingComplete && !user.mentor,
    },
    {
      title: 'header.addingAvailabilities',
      description: 'header.addingAvailabilities.description',
      buttonText: 'button.addAvailabilities',
      href: `/${locale}/personal/calendar`,
      icon: Clock,
      show: user.mentor && !user.hasAvailability,
    },
    {
      title: 'header.browsingMentors',
      description: 'header.browsingMentors.description',
      buttonText: 'button.browse',
      href: `/${locale}/mentors`,
      icon: Eye,
      show: !user.mentor && !hasBookings && !currentGroup?.hideMentors,
    },
  ]

  const activeOptions = options.filter((option) => option.show)

  if (activeOptions.length === 0) {
    return null
  }

  return (
    <>
      <h1 className="mb-3 text-2xl font-black">
        {formatMessage({ id: 'header.nextSteps' })}
      </h1>
      <div className="max-w-xl bg-white rounded">
        <ul className="flex flex-col divide-y">
          {activeOptions.map((option, index) => (
            <Task key={index} option={option} />
          ))}
        </ul>
      </div>
    </>
  )
}

type TaskProps = {
  option: OptionType
}

const Task = ({ option }: TaskProps) => {
  const { formatMessage } = useIntl()

  const Icon = option.icon

  return (
    <li className="py-6 px-6 border-gray gap-4 flex flex-col md:flex-row items-center">
      <div className="hidden sm:block">{Icon && <Icon />}</div>
      <div className="flex-1">
        <div className="text-lg font-bold mb-1">
          {formatMessage({ id: option.title })}
        </div>
        <div className="text-sm text-evenDarkerGray">
          {formatMessage({ id: option.description })}
        </div>
      </div>
      <Link href={option.href} passHref>
        <ButtonLink className="w-full sm:w-auto" variant="secondary">
          {formatMessage({ id: option.buttonText })}
        </ButtonLink>
      </Link>
    </li>
  )
}

export default NextSteps
