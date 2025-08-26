import BlankLayout from 'components/BlankLayout'
import Spinner from 'components/feedback/Spinner'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import useAuth from 'lib/useAuth'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'

const TokenLogin = () => {
  const { login } = useAuth()
  const { currentGroup } = useCurrentGroup()
  const { query, push } = useRouter()
  const { formatMessage, locale } = useIntl()

  const token = query.token as string
  const action = query.action as string | undefined
  const customDomain = currentGroup?.customDomain

  useEffect(() => {
    login(token, customDomain).then(() => {
      if (action === 'signup') {
        push(`/${locale}/onboarding`)
      } else {
        push(`/${locale}/personal`)
      }
    })
  }, [action, customDomain, locale, token])

  return (
    <>
      <Spinner className="w-12" />
      <h1 className="text-2xl mt-4 font-bold" data-testid="loading">
        {formatMessage({ id: 'loading' })}
      </h1>
    </>
  )
}

TokenLogin.Layout = BlankLayout

export const getServerSideProps = connectServerSideProps(TokenLogin)
export default TokenLogin
