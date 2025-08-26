import { LocationField } from 'components/Booking/Location'
import DatePicker from 'components/controls/DatePicker'
import Field from 'components/controls/Field'
import Form, { Errors } from 'components/controls/Form'
import TimeSelect from 'components/controls/TimeSelect'
import Alert from 'components/feedback/Alert'
import { ButtonBar } from 'components/Modal/Confirm'
import { isAfter } from 'date-fns'
import { FormikState, FormikValues } from 'formik'
import { formatLocaleDate, programEventBoundaries } from 'lib/date'
import { parseDate } from 'lib/DateTime'
import { useCurrentGroup } from 'lib/GroupContext'
import { useWindowSize } from 'lib/useWindowSize'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

import { CalendarModalEventType } from './CalendarModals'

type EventEditFormProps = {
  event: CalendarModalEventType
  [x: string]: any
}

const EventEditForm: VFC<EventEditFormProps> = ({ event, ...props }) => {
  const {
    sessionType,
    startTime,
    endTime,
    title,
    location,
    recurringWeekly,
    selectedStartTime,
  } = event
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const { isMobile } = useWindowSize()

  const day = formatLocaleDate(
    { date: new Date(recurringWeekly ? selectedStartTime : startTime) },
    formatMessage({ id: 'date.weekdayMonthDay' }),
    locale
  )

  const { calendarStart, calendarEnd, programEnded } =
    programEventBoundaries(currentGroup)

  if (programEnded) {
    return (
      <Alert
        description={formatMessage({ id: 'form.program.completed' })}
        type="error"
        showIcon
      />
    )
  }

  const sessionTitle = title || day

  const start = new Date(startTime)
  const end = new Date(endTime)

  // @TODO: could use for editing sessions too
  // const type = sessionType
  //   ? formatMessage({ id: `term.${camelCase(event.sessionType)}` })
  //   : formatMessage({ id: 'term.availability' })

  const initialValues = {
    id: event.id,
    type: sessionType,
    title: sessionTitle,
    date: start,
    duration: { start, end },
    location: location,
  }

  const schema = Yup.object().shape({
    title: Yup.string().required(),
    duration: Yup.object({
      startTime: Yup.date().required(),
      endTime: Yup.date().required(),
    }).test('duration', 'form.startGreaterThanEnd', (event) => {
      const { startTime, endTime } = event || {}

      if (!endTime || !startTime) return false

      return isAfter(endTime, startTime)
    }),
  })

  const originDate = parseDate(
    startTime,
    isMobile ? 'date.weekdayMonthDay' : 'date.fullDate',
    locale
  )
  const instructions = (
    <>{formatMessage({ id: 'tooltip.isRecurringSince' }) + originDate}</>
  )

  const locations = currentGroup.locations || []

  return (
    <Form
      id="EventEditForm"
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={() => {}}
    >
      {({ isSubmitting, values, errors }: FormikState<FormikValues>) => (
        <>
          <div className="p-8">
            <h4 className="text-2xl font-black mb-4 capitalize w-min">
              {sessionTitle}
            </h4>
            <Field
              name="date"
              type="date"
              instructions={recurringWeekly && instructions}
              control={DatePicker}
              minDate={calendarStart}
              maxDate={calendarEnd}
              placeholder={formatMessage({ id: 'term.selectDate' })}
              showTimeSelect={false}
            />
            <Field
              name="duration"
              type="duration"
              start={start}
              end={end}
              step={30}
              control={TimeSelect}
              placeholder={formatMessage({ id: 'term.selectDate' })}
            />
            {locations.length > 0 && <LocationField />}
            <Errors errors={errors} />
          </div>
          <ButtonBar
            onDecline={() => props.setModalState(null)}
            onConfirm={() => props.handleUpdateEvent(values)}
            isSubmitting={isSubmitting}
            isValid={schema.isValidSync(values)}
          />
        </>
      )}
    </Form>
  )
}

export default EventEditForm
