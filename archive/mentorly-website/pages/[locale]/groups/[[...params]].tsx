import { useRouter } from 'lib/router'
import { groupDomain } from 'lib/urls'
import { FC, ReactNode, useEffect } from 'react'
import { useIntl } from 'react-intl'

const newUrl = (locale: string, params: string | string[]) => {
  if (!params) {
    return null
  }

  const [groupSlug, ...pathParts] = params

  return `${groupDomain(groupSlug)}/${locale}/${pathParts.join('/')}`
}

const GroupsRedirect = () => {
  const { query } = useRouter()
  const { locale, formatMessage } = useIntl()

  useEffect(() => {
    const url = newUrl(locale, query.params || [])

    if (url) {
      window.location.href = url
    }
  }, [])

  return <div className="m-4">{formatMessage({ id: 'alert.redirecting' })}</div>
}

type LayoutProps = {
  children: ReactNode
}
const Layout: FC<LayoutProps> = ({ children }) => <div>{children}</div>
GroupsRedirect.Layout = Layout
export default GroupsRedirect
