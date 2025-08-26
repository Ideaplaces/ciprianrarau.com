import Breadcrumbs from 'components/Breadcrumbs'
import Avatar from 'components/display/Avatar'
import Spinner from 'components/feedback/Spinner'
import FormatDateTime from 'components/general/DateTime'
import { formatISO } from 'date-fns'
import gql from 'graphql-tag'
import { useHideElement } from 'lib/DOMInteraction'
import { firstName } from 'lib/firstName'
import { useCurrentGroup } from 'lib/GroupContext'
import { generateTimeSlots, TimeSlotOption } from 'lib/timeSlots'
import { disableBookingProps } from 'lib/userBookingChecks'
import { useCurrentUser } from 'lib/UserContext'
import { useEffect, useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  Availability,
  BookingLocationFieldsFragmentDoc,
  CalendarLinksFieldsFragmentDoc,
  useBookingMentorQuery,
  useCreateBookingRequestMutation,
  User,
  ViewerBookingsAndRequestsDocument,
} from 'types/graphql'

import {
  BookingParticipant,
  BookingProvider,
  BookingResultType,
  BookingUserType,
  ChooseSessionProps,
  SelectedSessionType,
} from './BookingContext'
import BookingTitle from './BookingTitle'
import Panels from './Panels'

// @TODO: some values in here could be re-used if BookButton query is turned into fragment
gql`
  mutation createBookingRequest(
    $attributes: BookingRequestAttributes!
    $locale: String
  ) {
    createBookingRequest(attributes: $attributes) {
      booking {
        id
        mentor {
          id
          name
        }
        mentee {
          id
          name
        }
        groupSession
        title
        description
        startTime
        endTime
        duration
        status
        sessionType
        conferenceUrl(locale: $locale)
        location {
          ...BookingLocationFields
        }
        calendarLinks {
          ...CalendarLinksFields
        }
      }
      bookingRequest {
        id
        mentor {
          id
          name
        }
        mentee {
          id
          name
        }
        status
        startTime
        endTime
        groupSession
      }
      errorDetails
    }
  }
  ${BookingLocationFieldsFragmentDoc}
  ${CalendarLinksFieldsFragmentDoc}

  query bookingMentor($id: ID!) {
    mentor(id: $id) {
      id
      name
      avatar {
        id
        color
        imageUrl(width: 80, height: 80)
        initials
      }
      sessionLengths
      rates
      group {
        id
        slug
      }
      bookable
      mentorSessionsRemaining
      allowGroupSessions
      hasAvailability
    }
  }
`

export type BookingProps = {
  member?: BookingUserType
  close: () => void
  sessionType?: string
  bookingTimes?: SelectedSessionType
}

const Booking: VFC<BookingProps> = ({
  member,
  sessionType,
  bookingTimes,
  close,
}) => {
  const { locale, formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const { currentUser } = useCurrentUser() || {}

  const {
    data,
    refetch,
    loading: mentorLoading,
    error,
  } = useBookingMentorQuery({
    skip: !member?.id || !currentGroup,
    fetchPolicy: 'cache-and-network',
    variables: {
      id: member?.id as string,
    },
  })

  const mentor = data?.mentor as User

  const [createBookingRequest, { loading: sendingRequest }] =
    useCreateBookingRequestMutation({
      refetchQueries: [
        'viewerBookingsAndRequests',
        'bookingMentor',
        {
          query: ViewerBookingsAndRequestsDocument,
          variables: { segment: `future` },
        },
      ],
    })

  const defaultSessionLength = 30

  // @TODO: some of this state could be groups into a 'settings' or 'progress/options' object
  // ...i.e. chosenDay, hideFirstStep, selectedSession, allowUnavailable, wantsGroupSession
  // some properties are inside bookingDetails, such as the chosen mentor, the selected day/times...etc
  // then we can pass the state to helper functions and clean-up this code
  const [step, setStep] = useState(0)
  const [hideFirstStep, setHideFirstStep] = useState(false)
  const [chosenDay, setChosenDay] = useState<string | undefined>()
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [desiredLength, setDesiredLength] = useState(defaultSessionLength)
  const [participants, setParticipants] = useState<BookingParticipant[]>([])
  const [selectedSession, setSelectedSession] = useState<string | undefined>()
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    TimeSlotOption[]
  >([])
  const [allowUnavailable, setAllowUnavailable] = useState(false)
  const [bookingResult, setBookingResult] = useState<
    BookingResultType | undefined
  >()
  const [bookingDetails, setBookingDetails] = useState<
    SelectedSessionType | undefined
  >(bookingTimes)
  const [wantsGroupSession, setWantsGroupSession] = useState(
    sessionType === 'Group'
  )

  const setBooking = (booking: SelectedSessionType) => {
    if (booking && member) {
      setBookingDetails({
        // allow setting times from schedule page
        mentor: member,
        startTime: booking.startTime || formatISO(new Date()),
        endTime: booking.endTime,
        location: booking.location,
        calendarLinks: booking.calendarLinks,
      })
      if (step < 2) {
        setHideFirstStep(true)
        setStep(2)
      }
    }
  }

  useEffect(() => {
    bookingTimes && setBooking(bookingTimes)
  }, [bookingTimes])

  useHideElement('.intercom-launcher')
  useHideElement('#intercom-container')

  useEffect(() => {
    // keep each panel up to date
    // only fetching if db vals have changed
    refetch()
  }, [step])

  useEffect(() => {
    desiredLength > 0 &&
      setAvailableTimeSlots(generateTimeSlots(availabilities, desiredLength))
  }, [desiredLength, availabilities])

  const chooseSession = ({ type, len, price }: ChooseSessionProps) => {
    setDesiredLength(len)
    setWantsGroupSession(type === 'Group')
    setSelectedSession(type + len)
    setBookingDetails({ ...bookingDetails, price })
  }

  const sendRequest = async () => {
    try {
      const status = await createBookingRequest({
        variables: {
          attributes: bookingRequestPayload,
          locale,
        },
      })
      const errorDetails = status.data?.createBookingRequest.errorDetails

      if (errorDetails) {
        setBookingResult({
          success: false,
          message: formatMessage({ id: 'form.error' }),
          errorDetails: errorDetails,
        })
      } else {
        setBookingResult({
          ...(status?.data?.createBookingRequest?.booking ||
            status?.data?.createBookingRequest?.bookingRequest),
          success: true,
          message: formatMessage({ id: 'tooltip.success' }),
          errorDetails: {},
        } as BookingResultType)
      }
    } catch (e: any) {
      console.error(e)
      setBookingResult({
        success: false,
        message: e.message,
        errorDetails: {},
      })
    }
    setStep(step + 1)
  }

  useEffect(() => {
    if (mentor) {
      const allowGroupSessions = currentGroup?.allowGroupSessions

      const { rates, sessionLengths } = mentor
      const isOnlyOneOptionAvailable =
        (!allowGroupSessions || sessionType) && sessionLengths?.length === 1

      if (isOnlyOneOptionAvailable && step === 0) {
        chooseSession({
          type: sessionType || 'individuale',
          len: sessionLengths[0],
          price: rates ? rates[sessionLengths[0]] / 100 : 0,
        })
        setDesiredLength(sessionLengths[0])
        setHideFirstStep(true)
        setStep(1)
      }

      if (bookingTimes) {
        setBooking(bookingTimes)
      }

      setAvailabilities(mentor.availabilities)
    }
    if (mentor && !bookingResult?.success && currentGroup && currentUser) {
      // make sure booking conditions haven't changed since modal load
      const disabledProps = disableBookingProps(
        currentGroup,
        currentUser,
        mentor
      )
      if (disabledProps?.disabled) {
        close && close()
        refetch()
        alert(formatMessage({ id: disabledProps?.messageId }))
      }
    }
  }, [mentorLoading])

  if (error) {
    console.error(error)
    return <p>An error occured</p>
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center text-lg gap-4">
        <Spinner />
        {formatMessage({ id: 'text.findingAvailabilities' })}
        &hellip;
      </div>
    )
  }

  if (!mentor) {
    return <p>{formatMessage({ id: 'error.userNotFound' })}</p>
  }

  const booking = {
    allowUnavailable,
    availabilities,
    availableTimeSlots,
    bookingResult,
    bookingDetails,
    chooseSession,
    chosenDay,
    desiredLength,
    member: mentor,
    mentorLoading,
    participants,
    step,
    setStep,
    hideFirstStep,
    selectedSession,
    refetch,
    sendRequest,
    setAvailabilities,
    setAvailableTimeSlots,
    setAllowUnavailable,
    setBookingDetails,
    setChosenDay,
    setParticipants,
    wantsGroupSession,
  }

  const { id, avatar } = mentor

  const bookingRequestPayload = {
    userMessage: bookingDetails?.userMessage || '',
    startTime: bookingDetails?.startTime,
    endTime: bookingDetails?.endTime,
    locationId: bookingDetails?.location?.id,
    calendarLinks: bookingDetails?.calendarLinks,
    invitedParticipantIds: participants.map((p: any) => p.id),
    groupSession: wantsGroupSession || false,
    mentorId: id,
    isSuggestedTime: bookingDetails?.suggested || false,
  }

  return (
    <BookingProvider booking={booking}>
      <div className="container mx-auto flex flex-col h-full">
        <div>
          <div className="space-x-2 flex flex-0 pb-4 w-full align-center">
            <Avatar {...avatar} className="mr-3" size="lg" />
            <h1 className="text-lg">
              <div>
                <BookingTitle />
              </div>
              <div className="font-black text-5xl -mt-3">
                {firstName(bookingDetails?.mentor?.name || mentor.name)}
              </div>
            </h1>
          </div>
          <Breadcrumbs
            label={formatMessage({ id: 'term.yourSession' }) + ':  '}
            nextCrumbsClass="opacity-25"
            className="mx-2 mb-3"
            crumbs={[
              {
                label: formatMessage({
                  id: `session.${
                    selectedSession ||
                    `individuale${currentGroup.sessionLengths[0]}`
                  }`,
                }),
                isActive: !!selectedSession || !!bookingDetails?.startTime,
                placeholder: 'choose a session',
                onClick: () => setStep(0),
              },
              {
                label: bookingDetails?.startTime && (
                  <FormatDateTime
                    date={bookingDetails?.startTime}
                    format="date.monthDay"
                  />
                ),
                isActive: !!bookingDetails?.startTime,
                placeholder: 'choose a date',
                onClick: () => setStep(0),
              },
              {
                label: bookingDetails?.startTime && (
                  <FormatDateTime
                    date={bookingDetails?.startTime}
                    format="date.time"
                  />
                ),
                isActive: !!bookingDetails?.startTime,
                placeholder: 'choose a time',
                onClick: () => setStep(1),
              },
              {
                label:
                  wantsGroupSession &&
                  participants.length +
                    ' ' +
                    formatMessage({ id: 'form.guests' }),
                isActive: participants.length > 0,
                placeholder: wantsGroupSession && 'invite guests',
                onClick: () => setStep(2),
              },
            ]}
          />
        </div>
        <div className="mb-1 pl-0 lg:pl-24 pr-0 lg:pr-12 flex flex-1 flex-col justify-between">
          <Panels sendingRequest={sendingRequest} />
        </div>
      </div>
    </BookingProvider>
  )
}

export default Booking
