import { formatBytes } from './fileUtils'

describe('formatBytes', () => {
  test('works for 0 en', () => {
    const result = formatBytes(0, 0, 'en')
    expect(result).toStrictEqual('0 B')
  })

  test('works for 0 undefined', () => {
    const result = formatBytes(0, 0, undefined)
    expect(result).toStrictEqual('0 B')
  })

  test('works for 0 fr', () => {
    const result = formatBytes(0, 0, 'fr')
    expect(result).toStrictEqual('0 o')
  })

  test('works for 0 pt', () => {
    const result = formatBytes(0, 0, 'pt')
    expect(result).toStrictEqual('0 B')
  })

  test('works for 10000 en', () => {
    const result = formatBytes(10000, 0, 'en')
    expect(result).toStrictEqual('9.77 KB')
  })
})
