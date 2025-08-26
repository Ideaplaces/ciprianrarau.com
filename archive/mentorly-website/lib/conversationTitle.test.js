import { conversationTitle } from './conversationTitle'

const formatMessage = (id) => id.id

// @TODO: write tests for when filters are present but no title (object.name) is given
// @TODO: write tests for announcements
describe('conversationTitle', () => {
  test('returns conversation name when there is one', () => {
    const otherMembers = [{ name: 'Ryan Buckley' }]
    const name = 'Title'
    const conversation = { otherMembers, name }
    const result = conversationTitle(conversation, formatMessage)
    expect(result).toBe('Title')
  })
  test('returns `awaiting others` when no otherMembers', () => {
    const otherMembers = []
    const name = ''
    const conversation = { otherMembers, name }
    const result = conversationTitle(conversation, formatMessage)
    expect(result).toBe('session.awaitingGuests')
  })
  test('returns other member`s name when only one other person', () => {
    const otherMembers = [{ name: 'Ryan' }]
    const name = ''
    const conversation = { otherMembers, name }
    const result = conversationTitle(conversation, formatMessage)
    expect(result).toBe('Ryan')
  })
  test('returns first other members name plus total count of others', () => {
    const otherMembers = [{ name: 'Ryan' }, { name: 'Ted' }, { name: 'Joe' }]
    const name = ''
    const conversation = {
      otherMembers,
      name,
      otherMembersCount: otherMembers.length,
    }
    const result = conversationTitle(conversation, formatMessage)
    expect(result).toBe('Ryan + 2 term.others')
  })
})
