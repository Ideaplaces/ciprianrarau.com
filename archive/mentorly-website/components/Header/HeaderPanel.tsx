import { useCurrentUser } from 'lib/UserContext'
import { FC } from 'react'
import { GroupEssentialsFieldsFragment } from 'types/graphql'

import LoggedOutPanel from './LoggedOutPanel'
import UserPanel from './UserPanel'

type HeaderPanelProps = {
  group: GroupEssentialsFieldsFragment
  toggleOpen?: () => void
  inline?: boolean
}

export const HeaderPanel: FC<HeaderPanelProps> = ({
  group,
  toggleOpen,
  inline,
}) => {
  const { currentUser, loading } = useCurrentUser()

  if (loading) {
    return null
  }

  return currentUser ? (
    <UserPanel
      group={group}
      user={currentUser}
      inline={inline}
      toggleOpen={toggleOpen}
    />
  ) : (
    <LoggedOutPanel group={group} toggleOpen={toggleOpen} />
  )
}

export default HeaderPanel
