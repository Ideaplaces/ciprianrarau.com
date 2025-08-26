import classNames from 'classnames'
import Box from 'components/Auth/Box'
import Panel from 'components/Auth/Panel'
import { ButtonLink } from 'components/Button/Button'
import { H3 } from 'components/Headings'
import { SocialIcon } from 'components/icons/SocialIcon'
import { useCurrentGroup } from 'lib/GroupContext'
import useMounted from 'lib/hooks/useMounted'
import { connectServerSideProps } from 'lib/ssg'
import { SocialLoginActions, socialLoginUrl } from 'lib/urls'
import { capitalize } from 'lodash'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { AuthProviderEnum } from 'types/graphql'

const colors = {
  google: 'bg-white border-brands-google text-black text-opacity-50',
  internal: '',
  facebook: 'bg-brands-facebook text-white',
  linkedin: 'bg-brands-linkedIn text-white',
  microsoft: 'bg-white border-brands-microsoftBorder text-brands-microsoftText',
}

type SocialButtonProps = {
  action: SocialLoginActions
  type: AuthProviderEnum
}

const SocialButton: VFC<SocialButtonProps> = ({ action, type }) => {
  const { currentGroup, loading } = useCurrentGroup()
  const { formatMessage } = useIntl()
  const mounted = useMounted()

  if (loading || !mounted) {
    return null
  }

  const href = socialLoginUrl({
    type,
    action,
    group: currentGroup,
  })

  return (
    <ButtonLink
      className={classNames('bg-white border-transparent', colors[type])}
      href={href}
      variant="none"
      full
    >
      <div className="relative w-full py-1 text-center">
        <div className="absolute left-0 top-0 bottom-0 flex justify-center items-center">
          <SocialIcon color="white" type={type} size="21" />
        </div>
        <div className="font-bold">
          {formatMessage(
            { id: 'button.signInWithService' },
            { service: capitalize(type) }
          )}
        </div>
      </div>
    </ButtonLink>
  )
}

const SocialLogin = () => {
  const { formatMessage } = useIntl()

  const action = 'signin'

  return (
    <Panel>
      <Box className="max-w-112 mb-40">
        <H3 className="pb-4 mb-4 border-b border-darkerGray">
          {formatMessage({ id: 'button.signInWithSocial' })}
        </H3>
        <div className="flex flex-col space-y-4">
          <SocialButton action={action} type={AuthProviderEnum.Google} />
          <SocialButton action={action} type={AuthProviderEnum.Microsoft} />
          <SocialButton action={action} type={AuthProviderEnum.Facebook} />
          <SocialButton action={action} type={AuthProviderEnum.Linkedin} />
        </div>
      </Box>
    </Panel>
  )
}

export const getServerSideProps = connectServerSideProps(SocialLogin)
export default SocialLogin
