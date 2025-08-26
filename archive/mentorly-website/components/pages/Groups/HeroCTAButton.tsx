import { ButtonLink } from 'components/Button'
import { getFeatureFlag } from 'components/Feature'
import { SignUpButton } from 'components/Forms/SignUp/SignUpLink'
import { useCurrentGroup } from 'lib/GroupContext'
import { authUrl } from 'lib/login'
import { useCurrentUser } from 'lib/UserContext'
import Link from 'next/link'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'

import { GroupProp } from './Hero'

const HeroCTAButton: FC<GroupProp> = ({ group, loading }) => {
  const { formatMessage, locale } = useIntl()
  const { currentUser } = useCurrentUser()
  const { currentGroup } = useCurrentGroup()

  if (!getFeatureFlag(currentGroup, 'login')) {
    return null
  }

  if (loading) {
    return <Skeleton borderRadius="999px" width="12rem" className="px-8 h-12" />
  }

  const groupButtonStyle = {
    backgroundColor: group?.styles?.accentColor,
    color: group?.styles?.accentTextColor,
  }

  const providerUrl = authUrl(currentGroup)
  const logInUrl = providerUrl || `/${locale}/login`

  return currentUser ? (
    <Link href={`/${locale}/personal`} passHref>
      <ButtonLink
        testId="hero-cta-button"
        className="flex-0 w-1/2 md:w-2/3 text-sm lg:text-base"
        style={groupButtonStyle}
      >
        {formatMessage({
          id: 'group.dashboard',
        })}
      </ButtonLink>
    </Link>
  ) : (
    <div className="flex gap-4">
      <Link href={logInUrl} passHref>
        <ButtonLink style={groupButtonStyle} testId="hero-login-button">
          {formatMessage({ id: 'button.signIn' })}
        </ButtonLink>
      </Link>
      <SignUpButton testId="hero-signup-button" />
    </div>
  )
}

export default HeroCTAButton
