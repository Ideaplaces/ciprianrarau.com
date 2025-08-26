import { TabListProps } from 'components/Generic/Tabs'
import { useRouter } from 'lib/router'
import { useIntl } from 'react-intl'

import PageMenu from './PageMenu'

type ResponsiveMenuProps = {
  headerId?: string
  CTAbutton?: React.ReactNode | JSX.Element
  tabs: TabListProps[]
  loading?: boolean
}

const ResponsiveMenu = ({
  headerId,
  tabs,
  CTAbutton,
  loading,
}: ResponsiveMenuProps) => {
  const router = useRouter()
  const { locale } = useIntl()
  const base = `/${locale}/dashboard/`

  // Fix the navigation by properly constructing URLs
  const handleTabSwitch = ({ id, href }: TabListProps) => {
    // Determine the path to navigate to
    const path = href || id

    // Ensure path doesn't have undefined or double slashes
    const cleanPath = path
      .replace('undefined', '')
      .replace(/\/+/g, '/')
      .replace(/^\//, '')

    // Build final URL properly
    const finalUrl = `${base}${cleanPath}`

    // Use router.push for navigation to avoid 404s
    router.push(finalUrl)
  }

  return (
    <PageMenu
      loading={loading}
      headerId={headerId}
      tabs={tabs}
      CTAbutton={CTAbutton}
      switchTab={handleTabSwitch}
    />
  )
}

export default ResponsiveMenu
