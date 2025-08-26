import { optionFilter } from './optionFilter'

const options = optionFilter(({ record }) => [
  {
    value: 'true',
    includeIf: true,
  },
  {
    value: 'false',
    includeIf: false,
  },
  {
    value: 'foo',
    includeIf: record === 'foo',
  },
  {
    value: 'bar',
    includeIf: record === 'bar',
  },
])

describe('optionFilter', () => {
  test(`should have expected result`, () => {
    expect(options({ record: 'foo' })).toEqual([
      { value: 'true' },
      { value: 'foo' },
    ])
  })
})
