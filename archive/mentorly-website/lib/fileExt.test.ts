import fileExt from './fileExt'

describe('fileExt', () => {
  test('returns null if no filetype found', () => {
    expect(fileExt('foo_bar')).toBe(null)
    expect(fileExt('this-pancake')).toBe(null)
    expect(fileExt('sdkjh*732&*&^@10  asA(*sP{{}')).toBe(null)
  })
  test('returns last part of string after .', () => {
    expect(fileExt('something.me')).toBe('me')
    expect(fileExt('whatever.this.is')).toBe('is')
    expect(fileExt('.htaccess')).toBe('htaccess')
    expect(fileExt('...')).toBe('')
  })
})
