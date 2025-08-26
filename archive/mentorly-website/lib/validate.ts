import { every, isArray, isObject } from 'lodash'

export type ValueObjectType = {
  label: string
  value: string | number | Record<any, string>
}

export const validateValueObject = (
  object: ValueObjectType,
  allowValueAsObject = false
) => {
  const validValue = allowValueAsObject || !isObject(object.value)

  return isObject(object) && !isObject(object.label) && validValue
}

export const validateValue = (
  value: ValueObjectType | ValueObjectType[],
  allowValueAsObject = false
) => {
  if (!value) {
    return true
  }

  if (isArray(value)) {
    return every(value, (v) => validateValueObject(v, allowValueAsObject))
  } else {
    return validateValueObject(value, allowValueAsObject)
  }
}
