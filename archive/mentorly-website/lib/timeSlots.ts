import { addMinutes, formatISO, parseISO } from 'date-fns'
import { Availability } from 'types/graphql'

export const availabilitiesByUser = (
  userAvailabilities:
    | undefined
    | {
        availabilities: TimeSlotOption[] | Availability[]
        user: any
        [x: string]: any
      }[],
  desiredLength: number
) => {
  return userAvailabilities?.map(({ availabilities, user }) => ({
    user,
    availabilities: generateTimeSlots(availabilities, desiredLength),
  }))
}

export type TimeSlotOption = {
  id: string
  startTime: string
  endTime: string
  suggested?: boolean
  location?: any
  [x: string]: any
}

export type generateTimeSlotsProps = {
  availabilities: TimeSlotOption[] | Availability[]
  desiredLength: number
}

export const generateTimeSlots = (
  availabilities: generateTimeSlotsProps['availabilities'],
  desiredLength: generateTimeSlotsProps['desiredLength']
) => {
  const slots: TimeSlotOption[] = []

  if (!availabilities || availabilities.length < 0) return []

  availabilities.forEach((availability) => {
    if (!availability.startTime || !availability.endTime) return false

    const buffer = 30
    const start = parseISO(availability.startTime)
    const end = parseISO(availability.endTime)

    const { suggested, location } = availability as TimeSlotOption

    for (let i = start; i < end; i = addMinutes(i, desiredLength)) {
      const tooLate = addMinutes(new Date(), buffer) > i
      const tooShort = addMinutes(i, desiredLength) > end
      if (tooLate || tooShort) continue // skip, do not include this slot

      const startTime = formatISO(i)
      const endTime = formatISO(addMinutes(i, desiredLength))

      slots.push({ startTime, endTime, suggested, location } as TimeSlotOption)
    }
  })

  return slots
}

// even though availabilities are returned from DB with bookings removed
// we still need to consider those bookings when we allow unavailable times
export const timeSlotsMinusBookings = (
  timeSlots: TimeSlotOption[],
  bookings: [{ startTime: string; endTime: string }]
) => {
  if (!bookings) return timeSlots
  return timeSlots.filter((slot) => {
    const conflicts = bookings.filter((booking) => {
      if (!slot.startTime || !slot.endTime) return false

      return (
        new Date(slot.startTime) < new Date(booking.endTime) &&
        new Date(slot.endTime) > new Date(booking.startTime)
      )
    })
    return conflicts.length === 0
  })
}
