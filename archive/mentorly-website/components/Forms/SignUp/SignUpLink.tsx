import classNames from 'classnames'
import { ButtonLink } from 'components/Button'
import { contrastBW } from 'lib/color'
import { useCurrentGroup } from 'lib/GroupContext'
import { authUrl } from 'lib/login'
import { allowSignUpGroupUser } from 'lib/signUp'
import Link from 'next/link'
import { FC, VFC } from 'react'
import { useIntl } from 'react-intl'
import { GroupEssentialsFieldsFragment } from 'types/graphql'

type SignUpProps = {
  children: VFC
}
const SignUp: FC<SignUpProps> = ({ children }) => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup, loading: loadingGroup } = useCurrentGroup()

  if (loadingGroup) {
    return null
  }

  const signUp = allowSignUpGroupUser(currentGroup)

  const providerUrl = authUrl(currentGroup)

  let signUpUrl = `/${locale}/thank-you`
  if (currentGroup) {
    signUpUrl = providerUrl || `/${locale}/sign-up`
  }

  const label = currentGroup
    ? formatMessage({ id: 'button.signUp' })
    : formatMessage({ id: 'button.getStarted' })

  return signUp ? children(signUpUrl, label) : null
}

const SignUpLink = () => {
  return <SignUp>{(url, label) => <Link href={url}>{label}</Link>}</SignUp>
}

type SignUpButtonProps = {
  onClick?: () => void
  className?: string
  group?: GroupEssentialsFieldsFragment
  testId?: string
}
const SignUpButton: FC<SignUpButtonProps> = ({
  onClick,
  className,
  group,
  testId,
}) => {
  return (
    <SignUp>
      {(signUpUrl, label) => (
        <div className={classNames('mr-3 inline-block')} onClick={onClick}>
          <Link href={signUpUrl} passHref>
            <ButtonLink
              variant={
                contrastBW(group?.styles?.backgroundColor || 'yellow') ===
                'white'
                  ? 'invertedPrimary'
                  : 'primary'
              }
              testId={testId || 'signup-header-button'}
              className={className}
            >
              {label}
            </ButtonLink>
          </Link>
        </div>
      )}
    </SignUp>
  )
}

export { SignUpLink, SignUpButton }
