import classNames from 'classnames'
import { Header } from 'components/Header'
import PlanWarning from 'components/Header/PlanWarning'
import { SidebarNav } from 'components/navigation/SidebarNav'
import Loading from 'components/statusPage/Loading'
import cookie from 'js-cookie'
import { useHideElement } from 'lib/DOMInteraction'
import { useCurrentGroup } from 'lib/GroupContext'
import { groupMenu } from 'lib/groupMenu'
import { useRouter } from 'lib/router'
import useWindowSize from 'lib/useWindowSize'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

export type LayoutProps = {
  children: ReactNode
}

const HideIntercomMessenger = () => {
  useHideElement('#intercom-container')
  return null
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { isMobile } = useWindowSize()
  const { asPath } = useRouter()
  const { locale } = useIntl()
  const { loading, currentGroup, isDashboard } = useCurrentGroup()
  const [collapsed, setCollapsed] = useState<boolean>(false)

  const expandSidebar = () => {
    cookie.remove('miniSidebar')
    setCollapsed(false)
  }
  const collapseSidebar = () => {
    cookie.set('miniSidebar', 'true', { expires: 365 })
    setCollapsed(true)
  }

  useEffect(() => {
    if (isMobile || cookie.get('miniSidebar') === 'true') {
      collapseSidebar()
    }
  }, [isMobile])

  const hideIntercom =
    !asPath.includes('/help') &&
    !asPath.includes('/dashboard/members') &&
    !asPath.includes('/program/templates')

  useHideElement('.intercom-launcher')

  if (loading) {
    return <Loading />
  }

  const handleSidebar = () => {
    cookie.get('miniSidebar') === 'true' ? expandSidebar() : collapseSidebar()
  }

  return (
    <>
      {hideIntercom && <HideIntercomMessenger />}
      <header className="col-span-2 fixed top-0 left-0 w-full z-30">
        <Header
          fullscreen={true}
          logoLink={`/${locale}/${isDashboard ? 'dashboard' : 'personal'}`}
          ignoreGroupStyles={isDashboard}
          data={groupMenu(currentGroup)}
          showOnboardingProgress
        />
      </header>
      <main className="flex h-screen-minus-navbar main-margin relative w-full">
        <SidebarNav collapsed={collapsed} setCollapsed={handleSidebar} />
        <div
          className={classNames(
            'p-5 bg-gray relative z-0 overflow-auto',
            isMobile ? 'w-full' : 'w-screen',
            isMobile ? 'ml-0' : collapsed ? 'ml-22' : 'ml-56'
          )}
        >
          <PlanWarning account={currentGroup.account} />
          {children}
        </div>
      </main>
    </>
  )
}

export default Layout
