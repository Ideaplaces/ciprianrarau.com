import classNames from 'classnames'
import { contrastBW } from 'lib/color'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { useCurrentUser } from 'lib/UserContext'
import { groupUserPermissionsForForm } from 'lib/userFormPermissions'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { User } from 'react-feather'
import { useIntl } from 'react-intl'
import { useViewerOnboardingProgressQuery } from 'types/graphql'

import ProgressRing from './ProgressRing'

const OnboardingProgress = () => {
  const { locale, formatMessage } = useIntl()
  const { data, loading } = useViewerOnboardingProgressQuery()
  const { currentGroup } = useCurrentGroup()
  const { currentUser } = useCurrentUser()
  const { pathname, push } = useRouter()

  const [previousPercent, setPreviousPercent] = useState<number>()
  const [currentPercent, setCurrentPercent] = useState<number>()

  useEffect(() => {
    if (data && !previousPercent) {
      setPreviousPercent(onboardingPercent)
    }
    setCurrentPercent(onboardingPercent)
  }, [data])

  useEffect(() => {
    if (currentPercent === 100 && previousPercent && previousPercent < 100) {
      push(`/${locale}/personal`)
    }
  }, [currentPercent])

  if (!currentGroup || !currentUser) return null

  const { hasReadOnly: profileLimited } = groupUserPermissionsForForm(
    currentGroup,
    currentUser,
    'userProfile'
  )

  if (loading || !data?.viewer || !currentGroup || !currentUser) return null

  const { profilePercent, onboardingPercent, matchingPercent } = data.viewer
  const { manualMatching, autoMatching } = currentGroup

  const matching = autoMatching || manualMatching

  if (!matching && profileLimited) return null

  const showMatching = matching && matchingPercent !== 100
  const showProfile = !profileLimited && profilePercent !== 100
  const showProgress = !loading && (showMatching || showProfile)

  const percent =
    showMatching && showProfile
      ? onboardingPercent
      : showMatching
      ? matchingPercent
      : profilePercent

  const path =
    showProfile && pathname !== '/[locale]/personal/profile'
      ? 'profile'
      : 'questions'
  const href = `/${locale}/personal/${path}`
  const groupBgColor = currentGroup.styles?.backgroundColor

  const bgOpacity =
    groupBgColor && contrastBW(groupBgColor) === 'black'
      ? 'bg-opacity-0 hover:bg-opacity-25'
      : 'bg-opacity-40 hover:bg-opacity-60'

  const message = (type: string, percent: number | string) => {
    const term = formatMessage({ id: `term.${type}` })
    return formatMessage({ id: 'phrase.progress' }, { term: term, percent })
  }

  if (!showProgress) {
    return null
  }

  return (
    <div className="hidden md:flex">
      <Link href={href}>
        <a
          className={classNames(
            'flex items-center mr-4 pr-6 py-1 bg-white rounded cursor-pointer transition duration-200 ease-in-out',
            bgOpacity
          )}
        >
          <ProgressRing icon={User} percent={percent} />
          <div className="text-xs pl-1">
            {showProfile && message('profile', profilePercent)}
            {showProfile && showMatching && <br />}
            {showMatching && message('matching', matchingPercent)}
          </div>
        </a>
      </Link>
    </div>
  )
}

export default OnboardingProgress
