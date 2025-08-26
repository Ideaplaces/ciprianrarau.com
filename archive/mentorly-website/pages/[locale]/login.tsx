import Box from 'components/Auth/Box'
import Panel from 'components/Auth/Panel'
import Feature from 'components/Feature'
import LoginForm from 'components/Forms/Login/Login'
import { SignUpLink } from 'components/Forms/SignUp/SignUpLink'
import { H3 } from 'components/Headings'
import { useCurrentGroup } from 'lib/GroupContext'
import { redirectToSamlIfNeeded } from 'lib/login'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import Link from 'next/link'
import { useEffect, VFC } from 'react'
import { useIntl } from 'react-intl'

const Login: VFC = () => {
  const { formatMessage, locale } = useIntl()
  const { query /* push */ } = useRouter()
  const { redirectTo } = query
  const { currentGroup } = useCurrentGroup()

  // Automatic redirection for group1 or group2 subdomain to use SAML authentication
  useEffect(() => {
    redirectToSamlIfNeeded(currentGroup)
  }, [currentGroup])

  return (
    <Feature id="login">
      <Panel>
        <Box className="max-w-2xs mb-40">
          <H3 className="pb-4 mb-4 border-b border-darkerGray">
            {formatMessage({ id: 'button.signIn' })}
          </H3>
          <LoginForm redirectPath={redirectTo as string} />
          <Feature id="loginActions">
            <div className="flex justify-center mt-3 text-center opacity-50 divide-x space-x-4">
              <SignUpLink />
              <Link href={`/${locale}/reset-password`}>
                <a className="even:pl-4">
                  {formatMessage({ id: 'header.resetPassword' })}
                </a>
              </Link>
            </div>
          </Feature>

          {/* <div className="my-8 border-t border-black pt-4">
            <p>or continue with</p>
          </div>
          <div className="flex flex-col justify-center">
            <FacebookLogin />
            <LinkedinLogin />
            <GoogleLogin />
            <ZoomLogin />
          </div> */}
        </Box>
      </Panel>
    </Feature>
  )
}

export const getServerSideProps = connectServerSideProps(Login)
export default Login
