import { getHours, getMinutes } from 'date-fns'
import { generateTimeSlots, generateTimeSlotsProps } from 'lib/timeSlots'

export const sortAndIndexAvailabilities = (availabilities: any[]) =>
  [...availabilities]
    .sort((a, b) => (a.id > b.id ? 1 : -1))
    .map((day, index) => {
      return {
        ...day,
        index: index,
      }
    })

type SortAndFilterAvailabilitiesProps = {
  availabilities: Array<{
    id: string
    userAvailabilities: Array<{
      availabilities: generateTimeSlotsProps['availabilities']
    }>
  }>
  bookingDuration: generateTimeSlotsProps['desiredLength']
}
export const sortAndFilterAvailabilities = (
  availabilities: SortAndFilterAvailabilitiesProps['availabilities'],
  bookingDuration: SortAndFilterAvailabilitiesProps['bookingDuration']
) => {
  const sortedAvailabilities = [...availabilities]
    .sort((a, b) => (a.id > b.id ? 1 : -1))
    .map((day) => {
      return {
        ...day,
        userAvailabilities: day.userAvailabilities.map((userAvailability) => {
          return {
            ...userAvailability,
            slicedAvailabilities: generateTimeSlots(
              userAvailability.availabilities,
              bookingDuration
            ),
          }
        }),
      }
    })

  return sortedAvailabilities
}

export const getMinutesFromDates = (date: Date) => {
  return getHours(date) * 60 + getMinutes(date)
}
