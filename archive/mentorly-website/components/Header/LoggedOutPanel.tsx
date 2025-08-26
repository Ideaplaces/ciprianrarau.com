import { ButtonLink } from 'components/Button'
import { getFeatureFlag } from 'components/Feature'
import { SignUpButton } from 'components/Forms/SignUp/SignUpLink'
import { contrastBW } from 'lib/color'
import { authUrl } from 'lib/login'
import Link from 'next/link'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { GroupEssentialsFieldsFragment } from 'types/graphql'

type LoggedOutPanelProps = {
  group?: GroupEssentialsFieldsFragment
  toggleOpen?: (props?: any) => void
}

const LoggedOutPanel: FC<LoggedOutPanelProps> = ({ group, toggleOpen }) => {
  const { formatMessage, locale } = useIntl()
  const backgroundColor = group?.styles?.backgroundColor
  const textColor = contrastBW(backgroundColor || 'yellow')
  const buttonStyle = {
    border: 'none',
    color: textColor,
  }

  if (group && !getFeatureFlag(group, 'login')) {
    return <div>No login</div>
  }

  const providerUrl = authUrl(group)

  if (providerUrl) {
    return (
      <div className="inline-block">
        <ButtonLink
          href={providerUrl}
          style={group && buttonStyle}
          variant="secondary"
        >
          {formatMessage({ id: 'button.signIn' })}
        </ButtonLink>
      </div>
    )
  }

  return (
    <div className="inline-flex gap-4">
      <div onClick={toggleOpen}>
        <Link href={`/${locale}/login`} passHref>
          <ButtonLink
            variant="secondary"
            style={group && buttonStyle}
            testId="login-header-button"
          >
            {formatMessage({ id: 'button.signIn' })}
          </ButtonLink>
        </Link>
      </div>
      <SignUpButton onClick={toggleOpen} group={group} />
    </div>
  )
}

export default LoggedOutPanel
