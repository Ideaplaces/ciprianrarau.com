import { addMinutes } from 'date-fns'

import sessionMenuOptions from './sessionMenuOptions'

const now = new Date()
const isDashboard = true
const locale = 'en'
const currentGroup = {
  id: 10,
  slug: 'test',
}
const currentUser = {
  id: 1,
  managedGroups: [],
  tags: [],
}
const booking = {
  type: 'booking',
  sessionType: 'individual_session',
  startTime: new Date(),
  endTime: addMinutes(new Date(), 60),
  mentor: currentUser,
  participants: [currentUser],
}
const pastBooking = {
  ...booking,
  startTime: addMinutes(new Date(), -60),
  endTime: addMinutes(new Date(), -30),
}
const futureBooking = {
  ...booking,
  startTime: addMinutes(new Date(), 30),
  endTime: addMinutes(new Date(), 60),
}
const futureGroupBooking = {
  ...futureBooking,
  sessionType: 'group_session',
}
const pastGroupBooking = {
  ...pastBooking,
  sessionType: 'group_session',
}
const cancelledBooking = {
  ...booking,
  status: 'cancelled',
}
const groupSession = { ...booking, sessionType: 'group_session' }
const outgoingRequest = { ...booking, type: 'outgoingRequest' }
const incomingRequest = { ...booking, type: 'incomingRequest' }
const sessionAsMentee = { ...booking, mentor: { id: 5 } }
const groupSessionAsMentee = { ...groupSession, mentor: { id: 6 } }
const nonParticipantSession = { ...groupSession, participants: [] }
const futureGroupSessionAsMentee = {
  ...groupSessionAsMentee,
  startTime: addMinutes(new Date(), 30),
  endTime: addMinutes(new Date(), 60),
}
const pmUser = { id: 2, managedGroups: [currentGroup] }

const props = {
  booking,
  currentUser,
  currentGroup,
  isDashboard,
  locale,
  now,
}

describe('shareSession', () => {
  test('shows when session is future', () => {
    const result = sessionMenuOptions(props)
    expect(result.shareSession.show).toBe(true)
  })
  test('does not show when session is past', () => {
    const result = sessionMenuOptions({ ...props, booking: pastBooking })
    expect(result.shareSession.show).toBe(false)
  })
  test('hide for cancelled session', () => {
    const result = sessionMenuOptions({ ...props, booking: cancelledBooking })
    expect(result.shareSession.show).toBe(false)
  })
})

describe('viewDiscussion', () => {
  test('shows when session.type is booking', () => {
    const result = sessionMenuOptions(props)
    expect(result.viewDiscussion.show).toBe(true)
  })
  test('only shows for participants', () => {
    const attending = sessionMenuOptions(props)
    expect(attending.viewDiscussion.show).toBe(true)
    const notAttending = sessionMenuOptions({
      ...props,
      currentUser: { id: 99 },
    })
    expect(notAttending.viewDiscussion.show).toBe(false)
    const pmNotAttending = sessionMenuOptions({
      ...props,
      currentUser: pmUser,
    })
    expect(pmNotAttending.viewDiscussion.show).toBe(false)
  })
  test('does not show when session is a request', () => {
    const outgoing = sessionMenuOptions({ ...props, booking: outgoingRequest })
    expect(outgoing.viewDiscussion.show).toBe(false)
    const incoming = sessionMenuOptions({ ...props, booking: incomingRequest })
    expect(incoming.viewDiscussion.show).toBe(false)
  })
})

describe('editBooking', () => {
  test('does NOT show if user is mentor of individual session', () => {
    const result = sessionMenuOptions(props)
    expect(result.editBooking.show).toBe(false)
  })
  test('show if user is mentor of group session', () => {
    const result = sessionMenuOptions({ ...props, booking: groupSession })
    expect(result.editBooking.show).toBe(true)
  })
  test('show if user featureFlag function !preventEditEvent', () => {
    const result = sessionMenuOptions({ ...props, booking: groupSession })
    expect(result.editBooking.show).toBe(true)
  })
  test('does NOT show if user featureFlag function preventEditEvent', () => {
    const result = sessionMenuOptions({
      ...props,
      booking: groupSession,
      currentUser: {
        ...currentUser,
        mentor: true,
        tags: [{ name: 'preventEditEvents' }],
      },
    })
    expect(result.editBooking.show).toBe(false)
  })

  test('is disabled if session is ready to join', () => {
    const result = sessionMenuOptions({ ...props, booking: groupSession })
    expect(result.editBooking.disabled).toBe(true)
  })
  test('is enabled if session is further than 10 mins away', () => {
    const result = sessionMenuOptions({ ...props, booking: futureGroupBooking })
    expect(result.editBooking.disabled).toBe(false)
  })
  test('hide for past bookings', () => {
    const result = sessionMenuOptions({ ...props, booking: pastGroupBooking })
    expect(result.editBooking.show).toBe(false)
  })
  test('hide for requests', () => {
    const incoming = sessionMenuOptions({ ...props, booking: incomingRequest })
    expect(incoming.editBooking.show).toBe(false)
    const outgoing = sessionMenuOptions({ ...props, booking: outgoingRequest })
    expect(outgoing.editBooking.show).toBe(false)
  })
  test('hide if not individual session and user is pm', () => {
    const result = sessionMenuOptions({
      ...props,
      booking: groupSessionAsMentee,
      currentUser: pmUser,
    })
    expect(result.editBooking.show).toBe(true)
  })
  test('hide for cancelled session', () => {
    const result = sessionMenuOptions({ ...props, booking: cancelledBooking })
    expect(result.editBooking.show).toBe(false)
  })
})

describe('leaveSession', () => {
  test('cannot leave a past session', () => {
    const result = sessionMenuOptions({ ...props, booking: pastBooking })
    expect(result.leaveSession.show).toBe(false)
  })
  test('cannot leave an individual session', () => {
    const result = sessionMenuOptions(props)
    expect(result.leaveSession.show).toBe(false)
  })
  test('mentor cannot leave their own group_session', () => {
    const result = sessionMenuOptions({ ...props, booking: groupSession })
    expect(result.leaveSession.show).toBe(false)
  })
  test('hide for requests', () => {
    const result = sessionMenuOptions({ ...props, booking: incomingRequest })
    expect(result.leaveSession.show).toBe(false)
  })
  test('guests can leave a future group_session', () => {
    const result = sessionMenuOptions({
      ...props,
      booking: groupSessionAsMentee,
    })
    expect(result.leaveSession.show).toBe(true)
  })
  test('is disabled if session is ready to join', () => {
    const result = sessionMenuOptions({
      ...props,
      booking: groupSessionAsMentee,
    })
    expect(result.leaveSession.disabled).toBe(true)
  })
  test('is enabled if session is future', () => {
    const result = sessionMenuOptions({
      ...props,
      booking: futureGroupSessionAsMentee,
    })
    expect(result.leaveSession.disabled).toBe(false)
  })
  test('hide for cancelled session', () => {
    const result = sessionMenuOptions({ ...props, booking: cancelledBooking })
    expect(result.leaveSession.show).toBe(false)
  })
  test('hide for non-participants session', () => {
    const result = sessionMenuOptions({
      ...props,
      booking: nonParticipantSession,
    })
    expect(result.leaveSession.show).toBe(false)
  })
})

describe('cancelBooking', () => {
  test('does NOT show if user featureFlag function !preventEditEvent', () => {
    const result = sessionMenuOptions(props)
    expect(result.cancelBooking.show).toBe(true)
  })
  test('show if user featureFlag function preventEditEvent', () => {
    const result = sessionMenuOptions({
      ...props,
      currentUser: {
        ...currentUser,
        mentor: true,
        tags: [{ name: 'preventEditEvents' }],
      },
    })
    expect(result.cancelBooking.show).toBe(false)
  })
  test('cannot cancel a past session', () => {
    const result = sessionMenuOptions({ ...props, booking: pastBooking })
    expect(result.cancelBooking.show).toBe(false)
  })
  test('mentor can cancel an individual session', () => {
    const result = sessionMenuOptions(props)
    expect(result.cancelBooking.show).toBe(true)
  })
  test('mentor can cancel a group session', () => {
    const result = sessionMenuOptions({ ...props, booking: groupSession })
    expect(result.cancelBooking.show).toBe(true)
  })
  test('mentee can cancel an individual session', () => {
    const result = sessionMenuOptions({ ...props, booking: sessionAsMentee })
    expect(result.cancelBooking.show).toBe(true)
  })
  test('mentee cannot cancel a group session', () => {
    const result = sessionMenuOptions({
      ...props,
      booking: groupSessionAsMentee,
    })
    expect(result.cancelBooking.show).toBe(false)
  })
  test('is disabled if session is ready to join', () => {
    const result = sessionMenuOptions(props)
    expect(result.cancelBooking.disabled).toBe(true)
  })
  test('is enabled if session is future', () => {
    const result = sessionMenuOptions({ ...props, booking: futureBooking })
    expect(result.cancelBooking.disabled).toBe(false)
  })
  test('hide for cancelled session', () => {
    const result = sessionMenuOptions({ ...props, booking: cancelledBooking })
    expect(result.cancelBooking.show).toBe(false)
  })
})

describe('cancelRequest', () => {
  test('does not show for bookings', () => {
    const result = sessionMenuOptions(props)
    expect(result.cancelRequest.show).toBe(false)
  })
  test('does not show for incomingRequests', () => {
    const incoming = sessionMenuOptions({ ...props, booking: incomingRequest })
    expect(incoming.cancelRequest.show).toBe(false)
  })
  test('shows for outgoingRequests', () => {
    const outgoing = sessionMenuOptions({ ...props, booking: outgoingRequest })
    expect(outgoing.cancelRequest.show).toBe(true)
  })
})
