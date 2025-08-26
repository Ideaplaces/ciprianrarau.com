import { useErrorDetails } from './error'

describe('useErrorDetails', () => {
  test('returns expected error messages', () => {
    const errorDetails = {
      mentor_id: [{ error: 'is in a different group' }],
      user_id: [{ error: 'booking limit reached' }],
    }
    const { errors } = useErrorDetails(errorDetails, 'en-US')
    expect(errors).toStrictEqual([
      'You must be a member of this program to book this user',
      "You've reached your booking limit",
    ])
  })
  test('returns error in sentence case when ', () => {
    const errorDetails = {
      something_else: [{ error: 'not a known message' }],
    }
    const { errors } = useErrorDetails(errorDetails, 'en-US')
    expect(errors).toStrictEqual(['Not a known message'])
  })
})
