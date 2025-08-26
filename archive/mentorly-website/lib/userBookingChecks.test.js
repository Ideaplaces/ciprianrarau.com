import { addHours, addMinutes, addWeeks } from 'date-fns'

import { disableBookingProps, disabledJoinProps } from './userBookingChecks'

const group = {
  slug: 'test',
  sessionLengths: [15, 30],
  marketplace: false,
  startsAt: new Date(),
  endsAt: addWeeks(new Date(), 16),
}

const user = {
  id: 1,
  bookable: true,
  availabilities: [
    { startTime: new Date(), endTime: addWeeks(new Date(), 16) },
  ],
  stripCustomer: true,
}

const newuser = { id: 3 }

const session = {
  maxParticipants: 2,
  participants: [user],
  mentor: { id: 2 },
  sessionType: 'masterclass',
  startTime: new Date(),
  endTime: addHours(new Date(), 1),
}

describe('disableBookingProps', () => {
  test('do not disable when mentor has availability and no session limit', () => {
    const result = disableBookingProps(group, user, user)
    expect(result).toBe(undefined)
  })
  test('logged-out user can try to book but must log-in first', () => {
    const result = disableBookingProps(group, undefined, user)
    expect(result).toStrictEqual({
      messageId: 'button.tooltip.mustBeLoggedIn',
    })
  })
  test('disable when mentor has reached limit', () => {
    const mentor = { ...user, mentorSessionsRemaining: 0 }
    const result = disableBookingProps(group, user, mentor)
    expect(result).toStrictEqual({
      disabled: true,
      messageId: 'alert.mentorFull',
      // linkPath: 'personal/messaging/',
      linkText: 'tooltip.contactPM',
    })
  })
  test('disable when program has ended', () => {
    const pastProgram = { ...group, endsAt: addWeeks(new Date(), -1) }
    const result = disableBookingProps(pastProgram, user, user)
    expect(result).toStrictEqual({
      disabled: true,
      messageId: 'form.program.completed',
    })
  })

  test('disable when mentee has reached limit', () => {
    const mentee = { ...user, menteeSessionsRemaining: -6 }
    const result = disableBookingProps(group, mentee, user)
    expect(result).toStrictEqual({
      disabled: true,
      messageId: 'error.bookingLimitReached',
      // linkPath: 'personal/messaging/',
      linkText: 'tooltip.contactPM',
    })
  })

  test('do not disable when mentor limit is null', () => {
    const mentor = { ...user, mentorSessionsRemaining: null }
    const result = disableBookingProps(group, user, mentor)
    expect(result).toBe(undefined)
  })

  test('do not disable when mentor limit is undefined', () => {
    const mentor = { ...user, mentorSessionsRemaining: undefined }
    const result = disableBookingProps(group, user, mentor)
    expect(result).toBe(undefined)
  })

  test('do not disable when mentee limit is null', () => {
    const mentee = { ...user, menteeSessionsRemaining: null }
    const result = disableBookingProps(group, mentee, user)
    expect(result).toBe(undefined)
  })

  test('do not disable when mentee limit is undefined', () => {
    const mentee = { ...user, menteeSessionsRemaining: undefined }
    const result = disableBookingProps(group, mentee, user)
    expect(result).toBe(undefined)
  })

  test('disable when mentee has reached limit', () => {
    const mentee = { ...user, menteeSessionsRemaining: 0 }
    const result = disableBookingProps(group, mentee, user)
    expect(result).toStrictEqual({
      disabled: true,
      messageId: 'error.bookingLimitReached',
      // linkPath: 'personal/messaging/',
      linkText: 'tooltip.contactPM',
    })
  })

  test('disable when mentee and mentor are in different programs', () => {
    const mentee = { ...user, group: { id: 999, slug: '999' } }
    const mentor = { ...user, group: { id: 888, slug: '888' } }
    const result = disableBookingProps(group, mentee, mentor)
    expect(result).toStrictEqual({
      disabled: true,
      messageId: 'error.isInADifferentGroup',
    })
  })

  test('disable when mentor has no availability and group disabled suggest', () => {
    const nonSuggestableGroup = { ...group, slug: 'sxsw-staging-2022' }
    const mentor = { ...user, availabilities: [] }
    const result = disableBookingProps(nonSuggestableGroup, user, mentor)
    expect(result).toStrictEqual({
      disabled: true,
      messageId: 'button.bookSessionDisabled',
    })
  })

  test('do not disable when mentor has no availability but group enabled suggest', () => {
    const mentor = { ...user, availabilities: [] }
    const result = disableBookingProps(group, user, mentor)
    expect(result).toBe(undefined)
  })

  test('disable when mentee and mentor are not same tag group', () => {
    const mentor = { ...user, bookable: false }
    const result = disableBookingProps(group, user, mentor)
    expect(result).toStrictEqual({
      disabled: true,
      messageId: 'button.tooltip.notSameTag',
      // linkPath: 'personal/messaging/',
      linkText: 'tooltip.contactPM',
    })
  })

  test('do not disable when mentorlyAdmin and mentor are not same tag group', () => {
    const mentee = { ...user, mentorlyAdmin: true }
    const mentor = { ...user, bookable: false }
    const result = disableBookingProps(group, mentee, mentor)
    expect(result).toBe(undefined)
  })

  test('disable when no pricing set', () => {
    const mentee = { ...user, stripCustomer: false }
    const result = disableBookingProps(group, mentee, user)
    expect(result).toBe(undefined)
  })

  test('disable when current date is outside program dates', () => {
    const pastProgram = {
      ...group,
      startAt: addWeeks(new Date(), -13),
      endsAt: addWeeks(new Date(), -1),
    }
    const result = disableBookingProps(pastProgram, user, user)
    expect(result).toStrictEqual({
      disabled: true,
      messageId: 'form.program.completed',
    })
  })
})

// these should be consistent with the JoinButton stories
describe('disabledJoinProps', () => {
  test('do not disabled if session has no location info', () => {
    const undefinedLocation = { ...session, location: undefined }
    const result = disabledJoinProps(undefinedLocation, new Date(), undefined)
    expect(result.disabled).toBe(false)
  })
  test('logged-out users can access non-masterclass button to login', () => {
    const nonMasterclass = { ...session, sessionType: 'nonmasterclass' }
    const result = disabledJoinProps(nonMasterclass, new Date(), undefined)
    expect(result).toStrictEqual({
      disabled: false,
      messageId: 'button.tooltip.mustBeLoggedIn',
    })
  })
  test('allow new user to join if masterclass', () => {
    const result = disabledJoinProps(session, new Date(), { id: 'newuser' })
    expect(result).toStrictEqual({
      disabled: false,
      messageId: 'session.remainingSpots',
      messageProps: { s: false, spots: 1 },
    })
  })

  test('do not allow joining for groupSession or individualSession unless user is participant', () => {
    const individualSession = disabledJoinProps(
      { ...session, sessionType: 'individual_session' },
      new Date(),
      newuser
    )
    expect(individualSession.disabled).toBe(true)
    const groupSession = disabledJoinProps(
      { ...session, sessionType: 'group_session' },
      new Date(),
      newuser
    )
    expect(groupSession.disabled).toBe(true)
  })

  test('cannot join if session has ended', () => {
    const endedSession = {
      ...session,
      startTime: addHours(new Date(), -2),
      endTime: addHours(new Date(), -1),
    }
    const result = disabledJoinProps(endedSession, new Date(), user)
    expect(result).toStrictEqual({
      disabled: true,
      messageId: 'tooltip.sessionEnded',
    })
  })
  test('upcoming group_session with sessionTimer enabled must wait until ready', () => {
    let disabledProps
    const nonMasterclass = { ...session, sessionType: 'nonmasterclass' }

    const privateSessionIn15mins = {
      ...nonMasterclass,
      startTime: addMinutes(new Date(), 15),
      endTime: addHours(new Date(), 1),
    }
    disabledProps = disabledJoinProps(
      privateSessionIn15mins,
      new Date(),
      user,
      true,
      true
    )
    expect(disabledProps.disabled).toBe(true)

    const privateSessionIn5mins = {
      ...nonMasterclass,
      startTime: addMinutes(new Date(), 5),
      endTime: addHours(new Date(), 1),
    }
    disabledProps = disabledJoinProps(
      privateSessionIn5mins,
      new Date(),
      user,
      true,
      true
    )
    expect(disabledProps.disabled).toBe(false)
  })
  test('upcoming group_session with sessionTimer disabled can join any non-past event', () => {
    let disabledProps
    const nonMasterclass = { ...session, sessionType: 'nonmasterclass' }

    const privateSessionIn15mins = {
      ...nonMasterclass,
      startTime: addMinutes(new Date(), 15),
      endTime: addHours(new Date(), 1),
    }
    disabledProps = disabledJoinProps(
      privateSessionIn15mins,
      new Date(),
      user,
      true,
      false
    )
    expect(disabledProps.disabled).toBe(false)

    const privateSessionIn5mins = {
      ...nonMasterclass,
      startTime: addMinutes(new Date(), 5),
      endTime: addHours(new Date(), 1),
    }
    disabledProps = disabledJoinProps(
      privateSessionIn5mins,
      new Date(),
      user,
      true,
      false
    )
    expect(disabledProps.disabled).toBe(false)
  })
  test('user is attending masterclass in 5 mins', () => {
    const masterclassIn5mins = {
      ...session,
      startTime: addMinutes(new Date(), 5),
      endTime: addHours(new Date(), 1),
    }
    const disabledProps = disabledJoinProps(
      masterclassIn5mins,
      new Date(),
      user
    )
    expect(disabledProps.disabled).toBe(false)
  })
  test('when session is full, disable if user is not attending, otherwise allow', () => {
    const fullSession = {
      ...session,
      isFull: true,
    }
    const notAttending = disabledJoinProps(fullSession, new Date(), newuser)
    expect(notAttending).toStrictEqual({
      disabled: true,
      messageId: 'session.full',
    })
    const isAttending = disabledJoinProps(fullSession, new Date(), user)
    expect(isAttending.disabled).toBe(false)
  })
})
