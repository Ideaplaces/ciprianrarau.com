import classNames from 'classnames'
import Avatar from 'components/display/Avatar'
import HoverDropdown from 'components/Dropdown/HoverDropdown'
import env from 'lib/env'
import { useCurrentGroup } from 'lib/GroupContext'
import { groupDomain, groupHost } from 'lib/urls'
import useAuth from 'lib/useAuth'
import useClickOutside from 'lib/useClickOutside'
import Link from 'next/link'
import { FC } from 'react'
import { ChevronDown } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  CurrentUser,
  GroupEssentialsFieldsFragment,
  Maybe,
} from 'types/graphql'

type UserInfoProps = {
  onClick?: (props: any) => void
  user: CurrentUser
  inline?: boolean
}

const UserInfo: FC<UserInfoProps> = ({ onClick, user, inline }) => {
  const { formatMessage } = useIntl()

  const showGroup = user?.alternates?.length > 0

  return (
    <button
      className={classNames(
        'flex flex-shrink-0 items-center rounded',
        inline && 'cursor-default'
      )}
      onClick={!inline ? onClick : () => {}}
    >
      <Avatar {...user.avatar} className="mr-2" />
      <div className="text-left">
        <div className="text-sm font-black">{user.name}</div>
        {showGroup && user.group && (
          <div className="text-xs">{user.group.name}</div>
        )}
        <div className="text-xs">
          {formatMessage({
            id: `term.${user.userRole}`,
            defaultMessage: user.role || 'user',
          })}
          {!inline && <ChevronDown size={14} className="inline" />}
        </div>
      </div>
    </button>
  )
}

type AccountInfoProps = {
  user: CurrentUser
}

const AccountInfo: FC<AccountInfoProps> = ({ user }) => {
  const { group } = user
  const { logout } = useAuth()

  const handleClick = async () => {
    await logout(group?.customDomain)

    if (group?.loginUrl && window) {
      window.location.href = `${group.loginUrl}`
    } else {
      window.location.href = 'https://marketplace.mentorly.co/'
    }
  }

  const name = group ? group.name : 'Marketplace'

  return (
    <button
      className="block hover:bg-gray px-4 py-1 w-full text-left"
      onClick={handleClick}
    >
      {name} ({user.userRole})
    </button>
  )
}

const selectGroup = (
  user: CurrentUser,
  currentGroup: GroupEssentialsFieldsFragment
) => {
  if (!user || !user.accounts || !user.accounts[0]) {
    return null
  }

  if (env.development || env.staging) {
    return currentGroup
  }

  const groups = user.accounts[0].groups

  if (!currentGroup) {
    return groups[0]
  }

  if (groups.find((g: any) => g.id === currentGroup.id)) {
    return currentGroup
  }

  return groups[0]
}

type MenuProps = {
  group?: {
    customDomain?: Maybe<string>
  }
  onClick?: (props?: any) => void
  user: CurrentUser
  inline?: boolean
  toggleOpen?: (props?: any) => void
}

const Menu: FC<MenuProps> = ({ group, onClick, user, inline, toggleOpen }) => {
  const { logout } = useAuth()
  const { locale, formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const legacy = false // !currentGroup || currentGroup.legacy

  const ref = useClickOutside<HTMLDivElement>(onClick)
  const managedGroup = selectGroup(user, currentGroup)

  const handleClose = () => {
    onClick && onClick() //for desktop
    toggleOpen && toggleOpen() //for mobile
  }

  const handleLogoutClick = () => {
    logout(group?.customDomain)
    window.location.href = `/${locale}`
  }

  const dashboardUrl = `${
    managedGroup && groupHost(managedGroup)
  }/${locale}/dashboard`

  return (
    <div
      ref={inline ? () => {} : ref}
      className={classNames(
        inline
          ? 'relative'
          : 'absolute py-2 rounded border border-gray shadow top-full mt-2 min-w-full whitespace-nowrap right-0',
        'font-normal text-black bg-white text-left text-sm '
      )}
    >
      {!legacy && user?.group && (
        <Link href={`${groupDomain(user.group.slug)}/${locale}/personal`}>
          <a
            className={classNames(
              'block py-1',
              inline ? 'hover:underline' : 'px-4 hover:bg-gray'
            )}
            onClick={handleClose}
          >
            {formatMessage({ id: 'menu.dashboard' })}
          </a>
        </Link>
      )}
      {legacy && (
        <a
          href={`${env.clientDomain}/settings/personal`}
          className={classNames('block py-1', !inline && 'px-4 hover:bg-gray')}
          onClick={handleClose}
        >
          {formatMessage({ id: 'menu.dashboard' })}
        </a>
      )}
      {managedGroup && (
        <Link href={dashboardUrl}>
          <a
            className={classNames(
              'block py-1',
              inline ? 'hover:underline' : 'px-4 hover:bg-gray'
            )}
            onClick={handleClose}
          >
            {formatMessage({ id: 'menu.programDashboard' })}
          </a>
        </Link>
      )}

      {user.alternates.length > 0 && (
        <>
          <div className="border-t border-gray mt-1 pt-1"></div>
          <div
            className={classNames(
              inline ? 'hover:underline' : 'px-4',
              'text-xs uppercase text-darkerGray font-bold'
            )}
          >
            Other accounts
          </div>
          {user.alternates.map((alternate: any) => (
            <AccountInfo key={alternate.id} user={alternate} />
          ))}
        </>
      )}

      {!inline && (
        <div className="border-t border-gray mt-1 pt-1">
          <button
            className={classNames(
              'block py-1 w-full text-left',
              !inline && 'px-4 hover:bg-gray'
            )}
            onClick={handleLogoutClick}
          >
            {formatMessage({ id: 'menu.signOut' })}
          </button>
        </div>
      )}
    </div>
  )
}

const UserPanel: FC<MenuProps> = ({ group, user, inline, toggleOpen }) => {
  if (!user) {
    return null
  }

  if (inline) {
    return (
      <div className="space-y-2">
        <UserInfo user={user} inline />
        <Menu
          group={user.group || undefined}
          user={user}
          toggleOpen={toggleOpen}
          inline
        />
      </div>
    )
  }

  return (
    <HoverDropdown
      openDelay={500}
      trigger={({ toggle }: { toggle: (props?: any) => void }) => (
        <UserInfo user={user} onClick={toggle} />
      )}
    >
      {({ close }: { close: (props?: any) => void }) => (
        <Menu group={group} user={user} onClick={close} />
      )}
    </HoverDropdown>
  )
}

export default UserPanel
