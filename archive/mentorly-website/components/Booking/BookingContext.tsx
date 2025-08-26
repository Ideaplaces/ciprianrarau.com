import { ErrorDetailsType } from 'components/Error/ErrorDetails'
import { TimeSlotOption } from 'lib/timeSlots'
import { createContext, FC, ReactNode, useContext } from 'react'
import {
  Availability,
  CalendarLink,
  Location,
  Maybe,
  TimeSlot,
} from 'types/graphql'

export type BookingUserType = {
  id: string
  name: string
  [x: string]: any
}

export type SelectedSessionType = {
  startTime?: string
  endTime?: string
  location?: Maybe<Location>
  mentor?: Maybe<BookingUserType>
  sessionType?: string
  conferenceUrl?: string
  suggested?: boolean
  allowGroupSessions?: boolean
  userMessage?: string
  price?: number | string
  calendarLinks?: CalendarLink[]
}

export type TimeSlotType = {
  id?: string | number
  startTime?: string
  endTime?: string
  location?: Location
  suggested?: boolean
  allowGroupSessions?: boolean
  userMessage?: string
  mentor?: string
  price?: number
}

export type BookingResultType = SelectedSessionType & {
  success: boolean
  message: string
  errorDetails: ErrorDetailsType
  conferenceUrl?: string
}

export type BookingParticipant = {
  id: string | number
  [x: string]: any
}

export type ChooseSessionProps = {
  type: string
  len: number
  price?: number | string
}

export type BookSessionType = {
  allowUnavailable: boolean
  availabilities: Availability[]
  availableTimeSlots: TimeSlotOption[]
  bookingResult?: BookingResultType
  bookingDetails?: SelectedSessionType
  bookingTimes?: TimeSlot
  chooseSession: (sessionProps: ChooseSessionProps) => void
  chosenDay: string | undefined
  desiredLength: number
  member: BookingUserType
  participants: BookingParticipant[]
  refetch: () => void
  mentorLoading: boolean
  step: number
  hideFirstStep: boolean
  selectedSession?: string | undefined
  setAvailabilities: (availabilities: any[]) => void
  setAvailableTimeSlots: (timeSlots: TimeSlotOption[]) => void
  setAllowUnavailable: (allowUnavailable: boolean) => void
  setBookingDetails: (bookingDetails: SelectedSessionType) => void
  setChosenDay: (day: string | undefined) => void
  setParticipants: (participants: BookingParticipant[]) => void
  wantsGroupSession: boolean
  [x: string]: any
}

type BookingContextProps = {
  booking: BookSessionType
  children: ReactNode
}

const BookingContext = createContext<BookSessionType | Record<string, never>>(
  {}
)

export const BookingProvider: FC<BookingContextProps> = ({
  booking,
  children,
}) => {
  return (
    <BookingContext.Provider value={booking}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => {
  return useContext(BookingContext)
}

export default BookingContext
