import { escapeChars } from './string'

describe('escapeChars', () => {
  test('will escape array of characters', () => {
    const string = 'The colon, and these commas, will be: escaped'
    const charsToEscape = [',', ':']
    const escapedString = escapeChars(string, charsToEscape)
    expect(escapedString).toBe(
      'The colon\\, and these commas\\, will be\\: escaped'
    )
  })
})
