import classNames from 'classnames'
import { useCurrentGroup } from 'lib/GroupContext'
import { mentorHasAvailability } from 'lib/mentorHasAvailability'
import { disableBookingProps } from 'lib/userBookingChecks'
import { useCurrentUser } from 'lib/UserContext'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  MentorCardTableFieldsFragment,
  MentorScheduleCardAvailabilitiesFragment,
} from 'types/graphql'

import MentorCardAvailabilities from './MentorCardAvailabilities'
import MentorCardHeader from './MentorCardHeader'
import MentorCardTable from './MentorCardTable'

export type MentorScheduleCardProps = {
  availabilities: MentorScheduleCardAvailabilitiesFragment[]
  user: MentorCardTableFieldsFragment
}
const MentorScheduleCard: VFC<MentorScheduleCardProps> = ({
  availabilities,
  user,
}) => {
  const [open, setOpen] = useState(false)
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const { currentUser } = useCurrentUser()

  const disabledProps = disableBookingProps(currentGroup, currentUser, {
    ...user,
    hasAvailability: mentorHasAvailability(availabilities, currentGroup),
  })

  return (
    <div className="bg-lightGray rounded-md p-6 mb-6 shadow-sm text-black relative w-full">
      <MentorCardHeader mentor={user} open={open} setOpen={setOpen} />

      <div className="sm:flex mt-2 ml-0 sm:ml-0">
        <div className="w-full">
          {!disabledProps?.disabled && (
            <MentorCardAvailabilities
              availabilities={availabilities}
              mentor={user}
            />
          )}
          {disabledProps?.messageId && (
            <p
              className={classNames(
                'opacity-50',
                disabledProps?.disabled ? 'p-4 pt-8' : 'py-0 px-1'
              )}
            >
              {formatMessage({ id: disabledProps?.messageId })}
            </p>
          )}
        </div>
      </div>
      {open && <MentorCardTable mentor={user} open={open} setOpen={setOpen} />}
    </div>
  )
}

export default MentorScheduleCard
