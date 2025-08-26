import { getFeatureFlag } from 'components/Feature'
import Spinner from 'components/feedback/Spinner'
import Confirm from 'components/Modal/Confirm'
import { addDays } from 'date-fns'
import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import { useCurrentUser } from 'lib/UserContext'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  TimeSlot,
  TimeSlotFieldsFragmentDoc,
  useDeleteTimeSlotMutation,
  useTimeSlotQuery,
  useUpdateTimeSlotMutation,
} from 'types/graphql'

import DisplayEvent from './DisplayEvent'
import EventEditForm from './EventEditForm'
import { ProcessedEvent } from './EventWrapper'

gql`
  mutation updateTimeSlot(
    $id: ID!
    $attributes: TimeSlotAttributes!
    $locale: String
  ) {
    updateTimeSlot(id: $id, attributes: $attributes) {
      timeSlot {
        ...TimeSlotFields
      }
      errors
      errorDetails
    }
  }
  ${TimeSlotFieldsFragmentDoc}

  mutation deleteTimeSlot($id: ID!) {
    deleteTimeSlot(id: $id) {
      timeSlot {
        id
      }
      errors
      errorDetails
    }
  }

  query timeSlot($id: ID!, $locale: String) {
    viewer {
      id
      timeSlot(id: $id) {
        ...TimeSlotFields
      }
    }
  }
  ${TimeSlotFieldsFragmentDoc}
`

export type CalendarModalEventType = TimeSlot & {
  title?: string
  sessionType?: string
  selectedStartTime: string
  selectedEndTime: string
}

type CalendarModalsProps = {
  availability: CalendarModalEventType | ProcessedEvent
  closeModal: (props?: any) => void
  calendarProvider: boolean
  [x: string]: any
}

const CalendarModals: FC<CalendarModalsProps> = ({
  availability,
  closeModal,
  calendarProvider,
  ...props
}) => {
  const [modalState, setModalState] = useState('')
  const { formatMessage, locale } = useIntl()
  const { currentGroup, isDashboard } = useCurrentGroup()
  const { currentUser, refetch: refetchUser } = useCurrentUser()

  const { data, loading, error, refetch } = useTimeSlotQuery({
    variables: { id: availability.id, locale },
    skip: calendarProvider,
  })

  const refetchQueries = ['viewerTimeSlots']

  const [updateTimeSlot] = useUpdateTimeSlotMutation({
    refetchQueries,
  })
  const [deleteTimeSlot] = useDeleteTimeSlotMutation({
    refetchQueries,
  })

  if (calendarProvider && !isDashboard) {
    return (
      <DisplayEvent
        event={availability}
        editable={!calendarProvider}
        setModalState={setModalState}
        {...props}
      />
    )
  }

  const handleMakeRecurring = (event: any) => {
    const variables = {
      attributes: {
        startTime: event.startTime,
        endTime: event.endTime,
        recurringWeekly: !event.recurringWeekly,
      },
      id: event.id,
      locale,
    }

    updateTimeSlot({ variables })
      .then(() => {
        refetch()
        refetchUser && refetchUser()
        toast.success(formatMessage({ id: 'tooltip.success' }))
      })
      .catch((error) => console.error('error', error))
  }

  const handleUpdateEvent = (values: any) => {
    const dayChange = values.date.getDay() - values.duration.endTime.getDay()
    const start = addDays(values.duration.startTime, dayChange)
    const end = addDays(values.duration.endTime, dayChange)

    const attributes = {
      startTime: start,
      endTime: end,
      locationId: values.location?.id,
      recurringWeekly: values.recurringWeekly,
    }
    updateTimeSlot({
      variables: { attributes, id: availability.id, locale },
    })
      .then(() => {
        toast.success(formatMessage({ id: 'tooltip.success' }))
        closeModal()
      })
      .catch((error) => console.error('error', error))
  }

  const handleDeleteEvent = () => {
    deleteTimeSlot({
      variables: { id: availability.id },
      update(cache: any) {
        const id = cache.identify({
          id: availability.id,
          __typename: 'TimeSlot',
        })
        cache.evict({ id })
        cache.gc()
      },
    })
      .then(() => {
        toast.success(formatMessage({ id: 'tooltip.success' }))
        closeModal()
      })
      .catch((error) => console.error('error', error))
  }

  if (loading)
    return (
      <div className="flex mx-auto px-8 py-32 justify-center animate-fade-in">
        <Spinner />
      </div>
    )

  if (error) {
    console.error(error)
    return null
  }

  if (!availability || !availability?.startTime || !availability?.endTime) {
    console.error('problem with availability:', availability)
  }

  const preventUserEdit =
    getFeatureFlag(currentGroup, 'preventEditEvents', {
      user: currentUser,
      isActingAsMentor: currentUser.mentor,
    }) || currentUser.calendarUrl

  const selectedAvailability = {
    // in the case of recurring availabilities
    // this will show the selected time rather than the original
    ...data?.viewer?.timeSlot,
    selectedStartTime: availability.startTime,
    selectedEndTime: availability.endTime,
  } as CalendarModalEventType

  switch (modalState) {
    case 'delete':
      return (
        <DeleteConfirmationModal
          newModal={false}
          availability={selectedAvailability}
          setModalState={setModalState}
          deleteEvent={handleDeleteEvent}
          closeModal={closeModal}
          {...props}
        />
      )
    case 'makeRecurring':
      return (
        <RecurringConfirmationModal
          availability={selectedAvailability}
          modalState={modalState}
          setModalState={setModalState}
          makeRecurring={handleMakeRecurring}
          {...props}
        />
      )
    case 'edit':
      return (
        <EventEditForm
          event={selectedAvailability}
          makeRecurring={handleMakeRecurring}
          handleUpdateEvent={handleUpdateEvent}
          setModalState={setModalState}
        />
      )
    default:
      return (
        <DisplayEvent
          event={selectedAvailability}
          setModalState={setModalState}
          editable={!calendarProvider && !preventUserEdit}
          {...props}
        />
      )
  }
}

type TimeSlotModalProps = {
  availability: CalendarModalEventType
  [x: string]: any
}

const DeleteConfirmationModal: FC<TimeSlotModalProps> = ({
  availability,
  ...props
}) => {
  const { recurringWeekly } = availability
  const { closeModal, deleteEvent, setModalState } = props
  const { formatMessage } = useIntl()

  const question = formatMessage({
    id: `${
      recurringWeekly
        ? 'confirm.deleteRecurringAvailability'
        : 'confirm.deleteAvailability'
    }`,
  })

  const handleDecline = () => {
    setModalState(null)
  }

  const handleDeleteEvent = () => {
    deleteEvent(availability)
    setModalState(null)
    closeModal()
  }

  return (
    <Confirm
      newModal={false}
      title={formatMessage({ id: 'confirm.deleteAvailabilityHeading' })}
      question={question}
      onConfirm={handleDeleteEvent}
      onDecline={handleDecline}
    />
  )
}

const RecurringConfirmationModal: FC<TimeSlotModalProps> = ({
  availability,
  ...props
}) => {
  const { recurringWeekly } = availability
  const { makeRecurring, setModalState } = props
  const { formatMessage } = useIntl()

  const question = recurringWeekly
    ? formatMessage({ id: 'confirm.stopRecurring' })
    : formatMessage({ id: 'confirm.makeRecurring' })

  const handleDecline = () => {
    setModalState(null)
  }

  const handleMakeRecurring = () => {
    makeRecurring(availability)
    setModalState(null)
  }

  return (
    <Confirm
      newModal={false}
      question={question}
      title={formatMessage({ id: 'confirm.makeRecurringHeading' })}
      onConfirm={handleMakeRecurring}
      onDecline={handleDecline}
    />
  )
}

export default CalendarModals
