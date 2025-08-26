import BlankLayout from 'components/BlankLayout'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import useAuth from 'lib/useAuth'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'

const Impersonate = () => {
  const { login } = useAuth()
  const { currentGroup } = useCurrentGroup()
  const { query, push } = useRouter()
  const { locale } = useIntl()

  useEffect(() => {
    localStorage.setItem('impersonateUserId', query.id as string)
    login(query.token as string, currentGroup?.customDomain).then(() => {
      push(`/${locale}/personal`)
    })
  }, [query.id, query.token])

  return <div className="m-2">Impersonating user #{query.id}...</div>
}

Impersonate.Layout = BlankLayout

export default Impersonate
