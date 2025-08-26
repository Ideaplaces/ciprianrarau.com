import { validateValueObject, ValueObjectType } from './validate'

describe('validateValueObject', () => {
  describe('with a numeric value', () => {
    const obj: ValueObjectType = {
      label: 'foo',
      value: 1,
    }

    test('without allowing value as object', () => {
      const result = validateValueObject(obj)
      expect(result).toBe(true)
    })

    test('with allowing value as object', () => {
      const result = validateValueObject(obj, true)
      expect(result).toBe(true)
    })
  })

  describe('with string value', () => {
    const obj: ValueObjectType = {
      label: 'foo',
      value: 'foo',
    }

    test('without allowing value as object', () => {
      const result = validateValueObject(obj)
      expect(result).toBe(true)
    })

    test('with allowing value as object', () => {
      const result = validateValueObject(obj, true)
      expect(result).toBe(true)
    })
  })

  describe('with object value', () => {
    const obj: ValueObjectType = {
      label: 'foo',
      value: {
        id: 'foo',
        name: 'bar',
      },
    }

    test('without allowing value as object', () => {
      const result = validateValueObject(obj)
      expect(result).toBe(false)
    })

    test('with allowing value as object', () => {
      const result = validateValueObject(obj, true)
      expect(result).toBe(true)
    })
  })
})
