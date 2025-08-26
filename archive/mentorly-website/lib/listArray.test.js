import listArray from './listArray'

describe('listArray', () => {
  test('list without limit', () => {
    const arr = ['one', 2, 'three']
    const result = listArray({ arr, locale: 'fr' })
    expect(result).toBe('one, 2 et three')
  })

  test('list without locale', () => {
    const arr = ['one', 2, 'three']
    const result = listArray({ arr })
    expect(result).toBe('one, 2 and three') // defaults to english
  })

  test('list with limit 2', () => {
    const arr = ['one', 'two', 'three', 4]
    const result = listArray({ arr, limit: 2 })
    expect(result).toBe('one, two and 2 others')
  })

  test('list with limit 1', () => {
    const arr = ['one', 'two', 'three', 4]
    const result = listArray({ arr, limit: 1 })
    expect(result).toBe('one and 3 others')
  })

  test('list with limit 0', () => {
    const arr = ['one', 'two', 'three', 4]
    const result = listArray({ arr, limit: 0, term: 'term.members' })
    expect(result).toBe('4 members')
  })
})
