import classNames from 'classnames'
import Button from 'components/Button/Button'
import Tooltip from 'components/display/Tooltip'
import { useModal } from 'components/Modal/ModalContext'
import { useRouter } from 'lib/router'
import { event } from 'nextjs-google-analytics'
import { FC } from 'react'
import { useIntl } from 'react-intl'

import { useBooking } from './BookingContext'

type PanelNavigationProps = {
  back?: boolean
  next?: string
  advance?: boolean
  sendRequest?: () => any
  redirect?: any
  loading?: boolean
  tooltipId?: string
}

const PanelNavigation: FC<PanelNavigationProps> = ({
  back,
  next,
  advance,
  sendRequest,
  redirect,
  loading,
  tooltipId = 'completeToAdvance',
}) => {
  const { locale, formatMessage } = useIntl()
  const { push } = useRouter()
  const { hideModal } = useModal()

  const { step, setStep } = useBooking()

  const buttonAction = () => {
    if (redirect) {
      push(`/${locale}/personal`)
      hideModal()
    } else if (
      advance &&
      sendRequest &&
      next === formatMessage({ id: 'button.confirm' })
    ) {
      event('Booking Request', {
        category: 'Booking',
        label: 'booking_request_sent',
      })
      sendRequest()
    } else {
      event('Booking Step', {
        category: 'Booking',
        label: `completed_booking_step_${step + 1}`,
      })
      movePanel(+1)
    }
  }

  const movePanel = (dir: number) => {
    if (step < 1 && dir < 0) return null

    setStep(step + dir)
  }

  const tooltip = formatMessage({ id: `bookingModal.tooltip.${tooltipId}` })

  return (
    <div
      className="w-full flex flex-0 justify-between align-center mt-8 pb-6 md:pb-0"
      title="Nav"
    >
      <Button
        className={classNames('font-bold my-auto', { invisible: !back })}
        onClick={() => movePanel(-1)}
        wide
        variant="secondary"
      >
        {formatMessage({ id: 'button.back' })}
      </Button>
      <div>
        <Tooltip hide={advance} text={tooltip}>
          <Button
            className={classNames(
              'rounded-full',
              !advance && 'opacity-25 cursor-not-allowed'
            )}
            disabled={!advance}
            onClick={buttonAction}
            loading={loading}
            wide
          >
            {next}
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

export default PanelNavigation
