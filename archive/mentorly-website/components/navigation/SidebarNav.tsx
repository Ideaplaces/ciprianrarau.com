import classNames from 'classnames'
import AccountMenu from 'components/Dashboard/AccountMenu'
import GroupInfo from 'components/Dashboard/GroupInfo'
import { getFeatureFlag } from 'components/Feature'
import MatchingArrows from 'components/icons/MatchingArrows'
import env from 'lib/env'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { profileUrl, settingsUrl } from 'lib/urls'
import { useCurrentUser } from 'lib/UserContext'
import useWindowSize from 'lib/useWindowSize'
import Link, { LinkProps } from 'next/link'
import { FC, MouseEventHandler } from 'react'
import {
  Archive,
  BookOpen,
  Calendar,
  ChevronsLeft,
  CreditCard,
  DollarSign,
  Eye,
  HelpCircle,
  Home,
  Icon,
  List,
  MessageSquare,
  Radio,
  Settings,
  User,
  Users,
  Zap,
} from 'react-feather'
import { useIntl } from 'react-intl'
import { useViewerActiveMatchesQuery } from 'types/graphql'

type MenuItemType = {
  id: string
  href: string
  icon: Icon
  exact?: boolean
  matchNumber?: number
  marketplace?: boolean
  beta?: boolean
  poweredByAI?: boolean
}

type SidebarNavProps = {
  collapsed: boolean
  setCollapsed: MouseEventHandler<HTMLButtonElement>
}

type SidebarNavItemProps = {
  icon: Icon
  href: string
  external?: boolean
  id?: string
  collapsed?: boolean
  mentorOnly?: boolean
  test?: string
  marketplace?: boolean
  matchNumber?: number
  beta?: boolean
  poweredByAI?: boolean
}

export const SidebarNav: FC<SidebarNavProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const { locale } = useIntl()
  const { currentUser }: any = useCurrentUser()
  const { currentGroup, isDashboard }: any = useCurrentGroup()
  const { data } = useViewerActiveMatchesQuery()
  const { isMobile } = useWindowSize()

  if (!currentGroup || !currentUser) return null

  const settingsLink = getFeatureFlag(currentGroup, 'newSettings')
    ? settingsUrl(locale, currentGroup)
    : '/settings'

  // @TODO: remove filter once backend stops sending null users
  const mentorMatchesCount =
    data?.viewer?.mentorMatches?.filter((m) => m.mentor).length || 0
  const menteeMatchesCount =
    data?.viewer?.menteeMatches?.filter((m) => m.mentee).length || 0

  const MENU_ITEMS = isDashboard
    ? PM_MENU_ITEMS
    : PERSONAL_MENU_ITEMS(mentorMatchesCount + menteeMatchesCount)

  return (
    <nav
      className={classNames(
        'fixed flex flex-col items-center min-h-screen-minus-navbar z-30 bg-white left-0 justify-between',
        isMobile && 'shadow-xl',
        collapsed ? (isMobile ? 'w-0' : 'w-22') : 'w-56'
      )}
    >
      <div
        className={classNames(
          'absolute right-0 transition-spacing duration-200',
          isDashboard && '-mr-8',
          !isDashboard && '-mr-3',
          isMobile && collapsed && '-mr-7',
          isMobile ? '-top-3 z-30' : 'top-2 z-10'
        )}
      >
        <MenuToggleButton collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className="w-full overflow-x-hidden">
        {isDashboard && <AccountMenu />}
        {!isDashboard && (
          <div className="mb-4">
            <GroupInfo group={currentGroup} collapsed={collapsed} />
          </div>
        )}
        {MENU_ITEMS.map((menuData) => (
          <SidebarNavLink
            key={menuData.id}
            collapsed={collapsed}
            {...menuData}
          />
        ))}
        {!isDashboard && (
          <SidebarNavLink
            id={'viewProfile'}
            collapsed={collapsed}
            href={profileUrl(currentUser, locale)}
            icon={Eye}
            external
          />
        )}
      </div>
      <div className="w-full overflow-x-hidden">
        <hr className="w-full border border-gray my-0" />
        {!isDashboard && (
          <SidebarNavLink
            id="settings"
            collapsed={collapsed}
            href={settingsLink}
            icon={Settings}
          />
        )}

        <SidebarNavLink
          id="help"
          collapsed={collapsed}
          href="/help"
          icon={HelpCircle}
        />
        {isDashboard && (
          <>
            <SidebarNavLink
              id="account"
              collapsed={collapsed}
              href={`${env.apiDomain}/accounts`}
              icon={Settings}
            />

            <SidebarNavLink
              id="productboard"
              collapsed={collapsed}
              external
              href="https://portal.productboard.com/howxtqgqwx3sajhaz9z4got4/tabs/3-launched"
              icon={Radio}
            />
          </>
        )}
      </div>
    </nav>
  )
}

const MenuToggleButton: FC<SidebarNavProps> = ({ collapsed, setCollapsed }) => {
  return (
    <button
      onClick={setCollapsed}
      className={classNames(
        'flex flex-row-reverse rounded-full bg-white p-1 border border-darkGray shadow-sm z-30',
        collapsed ? 'rotate-180' : 'rotate-0'
      )}
    >
      <ChevronsLeft size="18" />
    </button>
  )
}

export const SidebarNavLink: FC<SidebarNavItemProps> = ({
  icon,
  href,
  external,
  id,
  mentorOnly,
  test,
  marketplace,
  collapsed,
  matchNumber,
  beta,
  poweredByAI,
}) => {
  const { asPath } = useRouter()
  const { locale } = useIntl()
  const { formatMessage } = useIntl()
  const { currentUser }: any = useCurrentUser()
  const { currentGroup, isDashboard }: any = useCurrentGroup()

  const name = formatMessage({ id: `menu.${id}` })

  if (test && env.production) return null

  if (!currentUser || !currentGroup) return null

  if (marketplace && currentGroup.slug !== 'marketplace') return null

  // @TODO: sidebar elements were previously all determined by feature flags
  // we should improve this logic to be as automatic as possible again
  if (!getFeatureFlag(currentGroup, `sidebar.${id}`, currentUser)) {
    return null
  }

  const userRole = currentUser.mentor ? 'mentor' : 'mentee'
  if (userRole === 'mentee' && mentorOnly) return null

  const { autoMatching, manualMatching } = currentGroup
  if (id === 'matches' && !autoMatching && !manualMatching) return null

  const base = `/${locale}/${isDashboard ? 'dashboard' : 'personal'}`
  const path: LinkProps['href'] =
    href.startsWith('http') ||
    href.startsWith('/en/') ||
    href.startsWith('/fr/')
      ? href
      : base + href
  const Icon = icon
  const active =
    asPath === base && href === ''
      ? true
      : asPath.includes(path.toString()) && href !== ''
  let badge = null

  if (matchNumber && matchNumber > 0) {
    badge = (
      <span
        className={classNames(
          `absolute bottom-1 rounded-full bg-darkerGray text-white text-xs w-5 h-5 flex items-center justify-center`,
          !collapsed ? 'left-16' : 'left-7'
        )}
      >
        {matchNumber}
      </span>
    )
  }

  if (beta) {
    badge = (
      <span className="ml-2 rounded-full text-darkerGray text-xs font-normal">
        beta
      </span>
    )
  }

  return (
    <Linkable
      href={path}
      className={classNames(
        'group overflow-hidden w-auto flex mr-auto items-left pr-8 py-4 text-sm items-center',
        'hover:bg-lightGray hover:group-block',
        active && 'bg-gray font-black'
      )}
      target={external ? '_blank' : '_self'}
    >
      <div className="flex-0 ml-8 relative">
        <Icon />
        {collapsed && badge}
      </div>
      {!collapsed && (
        <div
          className={classNames(
            'relative whitespace-nowrap ml-3',
            poweredByAI && 'flex flex-col'
          )}
        >
          {name}
          {badge}
          {poweredByAI && (
            <span className="text-xs text-darkerGray mt-1">
              {formatMessage({ id: 'statistics.poweredByAI' })}
            </span>
          )}
        </div>
      )}
    </Linkable>
  )
}

export const Linkable = ({ children, href, ...props }: any) => {
  const absolute = href.startsWith('http')

  if (absolute) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href}>
      <a {...props}>{children}</a>
    </Link>
  )
}

const PERSONAL_MENU_ITEMS = (matchNumber?: number): MenuItemType[] => {
  return [
    {
      id: 'sessions',
      href: '',
      icon: BookOpen,
    },
    {
      id: 'matches',
      href: '/matches',
      icon: Users,
      matchNumber: matchNumber,
    },
    {
      id: 'availabilities',
      href: '/calendar',
      icon: Calendar,
    },
    {
      id: 'messaging',
      href: '/messaging',
      icon: MessageSquare,
    },
    {
      id: 'payments',
      href: '/payments',
      icon: CreditCard,
    },
    {
      id: 'profile',
      href: '/profile',
      icon: User,
    },
    {
      id: 'resources',
      href: '/resources',
      icon: Archive,
    },
  ]
}
const PM_MENU_ITEMS: MenuItemType[] = [
  {
    id: 'home',
    href: '',
    icon: Home,
    exact: true,
  },
  {
    id: 'program',
    href: '/program',
    icon: List,
  },
  {
    id: 'members',
    href: '/members',
    icon: User,
  },
  {
    id: 'matching',
    href: '/matching',
    icon: MatchingArrows,
  },
  {
    id: 'sessions',
    href: '/sessions',
    icon: Calendar,
  },
  {
    id: 'messaging',
    href: '/messaging',
    icon: MessageSquare,
  },
  // {
  //   id: 'surveys',
  //   href: '/surveys',
  //   icon: File,
  //   test: true,
  // },
  {
    id: 'reporting',
    href: '/reporting',
    icon: Zap,
    poweredByAI: true,
  },
  {
    id: 'monetization',
    href: '/monetization',
    icon: DollarSign,
  },
]
