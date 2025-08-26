import { sessionTitle } from './sessions'

const currentUser = { id: 1, name: 'Ryan Buckley' }
const otherUser = { id: 2, name: 'Ed' }
const props = {
  locale: 'fr',
  formatMessage: (id, name) => (name ? [id.id, name.name] : id.id),
  currentUser,
}

describe('sessionTitle', () => {
  const sessionTypes = ['group_session', 'masterclass']
  sessionTypes.map((session) => {
    describe(session, () => {
      const nonIndividualSession = { sessionType: session }

      test(`${session} with title will show title`, () => {
        const titled = {
          ...nonIndividualSession,
          title: 'This is my session',
          sessionType: 'group_session',
        }
        const result = sessionTitle({ session: titled, ...props })
        expect(result).toBe('This is my session')
      })

      describe('current user is mentor', () => {
        const sessionAsMentor = {
          ...nonIndividualSession,
          mentor: currentUser,
          otherGuests: [otherUser],
        }

        test('no title will show `You are mentoring: ...participants', () => {
          const untitled = {
            ...sessionAsMentor,
            title: undefined,
          }
          const result = sessionTitle({ session: untitled, ...props })
          expect(result).toStrictEqual(['text.mentoring', 'Ed'])
        })
        test('title will show title', () => {
          const titled = {
            ...sessionAsMentor,
            title: 'My masterclass',
          }
          const result = sessionTitle({ session: titled, ...props })
          expect(result).toBe('My masterclass')
        })
        test('no title and no guests will show `You are mentoring: ...awaiting guests`', () => {
          const untitledNoGuests = {
            ...sessionAsMentor,
            title: undefined,
            otherGuests: [],
          }
          const result = sessionTitle({ session: untitledNoGuests, ...props })
          expect(result).toStrictEqual([
            'text.mentoring',
            'session.awaitingGuests',
          ])
        })
      })

      describe('current user is mentee', () => {
        const sessionAsMentee = {
          ...nonIndividualSession,
          mentor: otherUser,
          otherGuests: [currentUser],
        }
        test('no title will list mentor + participants', () => {
          const untitled = {
            ...sessionAsMentee,
            title: undefined,
          }
          const result = sessionTitle({ session: untitled, ...props })
          expect(result).toBe(`${otherUser.name} + ${currentUser.name}`)
        })
        test('no title and no guests will list mentor + awaiting participants', () => {
          const untitled = {
            ...sessionAsMentee,
            title: undefined,
            otherGuests: undefined,
          }
          const result = sessionTitle({ session: untitled, ...props })
          expect(result).toBe(`${otherUser.name} + session.awaitingGuests`)
        })
      })
    })
  })

  describe('requests', () => {
    const request = {
      mentor: currentUser,
      otherGuests: [currentUser],
    }

    test('outgoing request will say you requested Mentor name', () => {
      const outgoingRequest = { ...request, type: 'outgoingRequest' }
      const result = sessionTitle({ session: outgoingRequest, ...props })
      expect(result).toStrictEqual(['util.youRequested', 'Ryan Buckley'])
    })

    test('incoming request will say Mentee is requesting', () => {
      const incomingRequest = { ...request, type: 'incomingRequest' }
      const result = sessionTitle({ session: incomingRequest, ...props })
      expect(result).toStrictEqual(['text.mentoringRequest', 'Ryan Buckley'])
    })
  })

  describe('individual_sessions', () => {
    const session = {
      type: 'booking',
      sessionType: 'individual_session',
      title: 'My session title',
    }

    test('if user is mentor show `you are mentoring mentee`', () => {
      const asMentor = {
        ...session,
        mentor: currentUser,
        otherGuests: [otherUser],
      }
      const result = sessionTitle({ session: asMentor, ...props })
      expect(result).not.toBe('My session title')
      expect(result).toStrictEqual(['text.mentoring', 'Ed'])
    })

    test('if user is mentee show mentor name', () => {
      const asMentee = {
        ...session,
        mentor: otherUser,
        otherGuests: [currentUser],
      }
      const result = sessionTitle({ session: asMentee, ...props })
      expect(result).not.toBe('My session title')
      expect(result).toBe('Ed')
    })
  })
})
