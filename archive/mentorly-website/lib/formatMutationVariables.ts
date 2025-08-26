import { MutationOptions } from '@apollo/client'
import { each, isArray, isEmpty, isObject, trimEnd, upperFirst } from 'lodash'

export const formatMutationVariables = (
  values: MutationOptions['variables'],
  config: Record<string, any> = {}
) => {
  const result: Record<string, any> = {}

  each(values, (v, k) => {
    if (isArray(v)) {
      const key = config[k] ? `${trimEnd(k, 's')}${upperFirst(config[k])}s` : k

      if (config[k] && !isEmpty(v)) {
        result[key] = v.map((o) => o[config[k]])
      } else {
        result[key] = v
      }
    } else if (config[k]) {
      const key = config[k] ? `${k}${upperFirst(config[k])}` : k

      if (config[k] && v) {
        result[key] = v[config[k]]
      } else {
        result[key]
      }
    } else {
      result[k] = v
    }
  })

  return result
}

export type formatValuePropType = Array<{ value: any }> | { value: any }

export type formatValueType = (o: formatValuePropType) => formatValuePropType

const formatValue: formatValueType = (o: formatValuePropType) => {
  if (isArray(o)) {
    return o.map((o) => formatValue(o))
  }

  if (isObject(o) && 'value' in o) {
    return o.value
  }

  return o
}

export type formatSurveyMutationVariablesPropType = Record<string, any>

export const formatSurveyMutationVariables = (
  values: formatSurveyMutationVariablesPropType
) => {
  const result: Record<string, any> = {}

  Object.keys(values).forEach((key) => {
    result[key] = formatValue(values[key])
  })

  return result
}

export default formatMutationVariables
