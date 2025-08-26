import { uniqueId } from 'lodash'
import { TimeSlot } from 'types/graphql'

import {
  closestEvent,
  handleSelecting,
  sortEventsByStartDate,
} from './calendar'

describe('calendar', () => {
  const slot1 = {
    id: uniqueId(),
    startTime: new Date('2022-06-18 08:00').toISOString(),
    endTime: new Date('2022-06-18 09:00').toISOString(),
  } as TimeSlot
  const slot2 = {
    id: uniqueId(),
    startTime: new Date('2022-07-18 10:00').toISOString(),
    endTime: new Date('2022-07-18 11:00').toISOString(),
  } as TimeSlot
  const slot3 = {
    id: uniqueId(),
    startTime: new Date('2022-06-19 10:00').toISOString(),
    endTime: new Date('2022-06-19 11:00').toISOString(),
  } as TimeSlot

  test('sortEventsByStartDate sorts events by startTime', () => {
    const result = sortEventsByStartDate([slot1, slot2, slot3])
    expect(result).toStrictEqual([slot1, slot3, slot2])
  })
  test('closestEvent with next prop finds closest next event', () => {
    const result = closestEvent(slot1, [slot2, slot3], 'next')
    expect(result).toStrictEqual(slot3)
  })
  test('closestEvent with prev prop finds closest previous event', () => {
    const result = closestEvent(slot3, [slot2, slot1], 'prev')
    expect(result).toStrictEqual(slot1)
  })
  test('handleSelect returns false if not editing and date is outside program dates', () => {
    const result = handleSelecting(
      slot3,
      {
        group: {
          endsAt: new Date('1970-01-01'),
        },
      },
      [slot1, slot2, slot3],
      false
    )
    expect(result).toBe(false)
  })
})
