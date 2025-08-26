import ErrorMessage from 'components/Error/Error'
import { useModal } from 'components/Modal/ModalContext'
import { useCurrentUser } from 'lib/UserContext'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

import { useBooking } from '../BookingContext'
import PanelDisplay from '../PanelDisplay'
import PanelNavigation from '../PanelNavigation'
import ConfirmationPanel from './ConfirmationPanel'
import DatePanel from './DatePanel'
import DetailsPanel from './DetailsPanel'
import InvitesPanel from './InvitesPanel'
import SessionPanel from './SessionPanel'
import TimePanel from './TimePanel'
import UserPanel from './UserPanel'
import WhatsNextPanel from './WhatsNextPanel'

type PanelsProps = {
  sendingRequest: boolean
}

const Panels: VFC<PanelsProps> = ({ sendingRequest }) => {
  const {
    selectedSession,
    wantsGroupSession,
    chosenDay,
    hideFirstStep,
    bookingDetails,
    bookingResult,
    participants,
    sendRequest,
    step,
  } = useBooking()
  const { currentUser } = useCurrentUser()
  const { formatMessage } = useIntl()
  const { hideModal } = useModal()

  const panels = [
    <>
      <PanelDisplay>
        <SessionPanel />
        <DatePanel />
      </PanelDisplay>
      <PanelNavigation
        advance={!!(selectedSession && chosenDay)}
        next={formatMessage({ id: 'button.next' })}
        tooltipId="sessionDate"
      />
    </>,
    <>
      <PanelDisplay>
        <DatePanel className="-ml-2 -mt-2" />
        <TimePanel />
      </PanelDisplay>
      <PanelNavigation
        back={!hideFirstStep}
        advance={
          !!(chosenDay && bookingDetails?.startTime && bookingDetails?.endTime)
        }
        next={formatMessage({ id: 'button.next' })}
        tooltipId="dateTime"
      />
    </>,
    <>
      <PanelDisplay>
        <DetailsPanel />
        <UserPanel />
      </PanelDisplay>
      <PanelNavigation
        back={!hideFirstStep}
        advance={!!(bookingDetails?.userMessage && currentUser)}
        next={formatMessage({ id: 'button.confirm' })}
        tooltipId="describe"
        sendRequest={sendRequest}
        loading={sendingRequest}
      />
    </>,
    <>
      <PanelDisplay>
        {bookingResult?.success ? (
          <>
            <ConfirmationPanel />
            <WhatsNextPanel mentorName={bookingDetails?.mentor?.name} />
          </>
        ) : (
          <div>
            <ErrorMessage errorDetails={bookingResult?.errorDetails || {}} />
          </div>
        )}
      </PanelDisplay>
      <PanelNavigation
        back={!bookingResult?.success}
        advance={!!bookingResult}
        next={formatMessage({ id: 'button.goToDashboard' })}
        redirect
      />
    </>,
  ]

  // @TODO: change the setStep in useEffect for skipping to last panel when this is enabled
  // @TODO: use state for panels
  const groupInvites = (
    <>
      <PanelDisplay>
        <InvitesPanel />
      </PanelDisplay>
      <PanelNavigation
        back={true}
        advance={participants.length > 0}
        next={formatMessage({ id: 'button.next' })}
      />
    </>
  )
  wantsGroupSession && panels.splice(panels.length - 2, 0, groupInvites)

  if (step >= panels.length) {
    hideModal()
    return null
  }

  return <>{panels[step]}</>
}

export default Panels
