import { gql } from '@apollo/client'
import Dropdown from 'components/Dropdown/Dropdown'
import { useCurrentGroup } from 'lib/GroupContext'
import { useNow } from 'lib/useNow'
import { useCurrentUser } from 'lib/UserContext'
import { some } from 'lodash'
import { VFC } from 'react'
import { MoreVertical } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  SessionCardMenuFieldsFragment,
  SessionMenuOptionsFieldsFragmentDoc,
} from 'types/graphql'

import { SessionCardFormat } from '.'
import SessionCardLinks from './SessionCardLinks'
import sessionMenuOptions from './sessionMenuOptions'

export const SessionCardMenuFields = gql`
  fragment SessionCardMenuFields on Booking {
    ...SessionMenuOptionsFields
  }
  ${SessionMenuOptionsFieldsFragmentDoc}
`

type SessionCardMenuProps = {
  booking: SessionCardMenuFieldsFragment
  handleSelect: (type: any) => void
  format: SessionCardFormat
}

const SessionCardMenu: VFC<SessionCardMenuProps> = ({
  booking,
  handleSelect,
  format,
}) => {
  const { locale } = useIntl()
  const { currentGroup, isDashboard } = useCurrentGroup()
  const { currentUser } = useCurrentUser()

  const { now } = useNow()

  const options = sessionMenuOptions({
    booking,
    currentUser,
    currentGroup,
    isDashboard,
    locale,
    now,
  })

  if (!some(options, (option) => option.show)) return null

  if (format === 'dropdown') {
    return (
      <Dropdown
        trigger={({ toggle }: any) => (
          <MoreVertical
            onClick={toggle}
            className="opacity-75 duration-200 ease-in-out cursor-pointer transition-opacity hover:opacity-100"
          />
        )}
      >
        {({ close }: { close: () => void }) => (
          <SessionCardLinks
            onClick={close}
            booking={booking}
            triggersModal={(type: any) => handleSelect(type)}
            options={options}
            format={format}
          />
        )}
      </Dropdown>
    )
  } else {
    return (
      <SessionCardLinks
        onClick={() => true}
        booking={booking}
        triggersModal={(type: any) => handleSelect(type)}
        options={options}
        format={format}
      />
    )
  }
}

export default SessionCardMenu
