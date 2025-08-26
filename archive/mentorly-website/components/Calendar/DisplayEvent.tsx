import ToggleSwitch from 'components/controls/ToggleSwitch'
import Feature from 'components/Feature'
import FormatDateTime from 'components/general/DateTime'
import DateTime from 'components/Sessions/DateTime'
import { useWindowSize } from 'lib/useWindowSize'
import { FC } from 'react'
import { Edit, Repeat, Trash } from 'react-feather'
import { useIntl } from 'react-intl'
import { Booking } from 'types/graphql'

type DisplayEventProps = {
  event: any
  setModalState: (props?: any) => void
  editable?: boolean
}

const DisplayEvent: FC<DisplayEventProps> = ({
  event,
  setModalState,
  editable,
}) => {
  const { formatMessage } = useIntl()
  const { isMobile } = useWindowSize()

  if (!event) return null

  const {
    startTime,
    endTime,
    selectedStartTime,
    selectedEndTime,
    recurringWeekly,
    title,
    location,
    calendarLinks,
  } = event

  const thisSession = {
    startTime: selectedStartTime,
    endTime: selectedEndTime,
    location,
    calendarLinks,
  } as Booking

  const originSession = {
    startTime,
    endTime,
    location,
    calendarLinks,
  } as Booking

  return (
    <>
      <div className="p-8">
        <h4 className="text-2xl font-black mb-4 capitalize w-min">
          {title || formatMessage({ id: 'term.available' })}
        </h4>
        <div className="flex flex-col space-y-6">
          <div>
            <DateTime
              booking={recurringWeekly ? thisSession : originSession}
              singleLine={false}
            />
            {recurringWeekly && startTime && (
              <div className="flex items-start">
                <Repeat className="h-5 mr-1" />
                {formatMessage({ id: 'tooltip.isRecurringSince' })}
                <FormatDateTime
                  date={new Date(startTime)}
                  format={isMobile ? 'date.weekdayMonthDay' : 'date.fullDate'}
                />
              </div>
            )}
          </div>
          {editable && (
            <Feature id="manualWeeklyRecurringAvailabilities">
              <div>
                <div className="font-bold mr-2 mb-1">
                  {formatMessage({ id: 'form.makeRecurring' })}
                </div>
                <ToggleSwitch
                  value={recurringWeekly}
                  onClick={() => setModalState('makeRecurring')}
                />
              </div>
            </Feature>
          )}
        </div>
      </div>
      {editable && (
        <div className="w-full bg-darkGray p-4 mt-4 justify-around flex rounded-b-sm px-8">
          <Trash
            className="hover:text-backgroundTextColor"
            onClick={() => setModalState('delete')}
          />
          <Edit
            className="hover:text-backgroundTextColor"
            onClick={() => setModalState('edit')}
          />
        </div>
      )}
    </>
  )
}

export default DisplayEvent
