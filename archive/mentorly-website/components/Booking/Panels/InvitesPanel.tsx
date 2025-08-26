import MemberSelect from 'components/controls/MemberSelect'
import { useCurrentUser } from 'lib/UserContext'
import { FC } from 'react'
import { useIntl } from 'react-intl'

import { useBooking } from '../BookingContext'

const InvitesPanel: FC = () => {
  const { participants, setParticipants } = useBooking()
  const { formatMessage } = useIntl()
  const { currentUser } = useCurrentUser()

  return (
    <div className="pb-3 w-full h-96">
      <h2 className="font-black text-xl mb-4 p-1 pb-0">
        {formatMessage({ id: 'form.addUser' })}
      </h2>
      <div className="p-1 pt-0">
        <MemberSelect
          memberId={currentUser.id}
          onValueChange={setParticipants}
          value={participants}
          isMulti
        />
      </div>
    </div>
  )
}

export default InvitesPanel
