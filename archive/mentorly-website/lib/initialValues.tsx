import { isArray, isNil, isObject, mapValues, omit, pick } from 'lodash'
import { Maybe, SurveyQuestion } from 'types/graphql'

// @TODO: this doesn't work for nested objects
const initialValues = (
  data: Record<string, any>,
  fields: Maybe<string[]> = null,
  defaults: Maybe<Record<string, any>> = null
) => {
  let result = omit(data, ['id', '__typename'])

  if (fields) {
    result = pick(result, fields)
  }

  if (defaults) {
    result = mapValues(result, (v, k) => (isNil(v) ? defaults[k] : v))
  }

  return result
}

const toValueObject = (value: { label: string; value: any } | string) => {
  if (isObject(value)) {
    return value
  }

  return {
    label: value,
    value: value,
  }
}

export const surveyInitialValues = (
  surveyQuestions?: Record<string, any>,
  surveyResult?: Record<string, any>
) => {
  if (!surveyQuestions) {
    return {}
  }

  if (!surveyResult) {
    const emptyInitialValues = {} as Record<string, any>
    surveyQuestions?.forEach(
      (question: SurveyQuestion) => (emptyInitialValues[question.key] = '')
    )
    return emptyInitialValues
  }

  const resultKeys = Object.keys(surveyResult)

  const fieldsToOmit = resultKeys.filter(
    (key) => !surveyQuestions.map((q: SurveyQuestion) => q.key).includes(key)
  )

  const resultClone = {} as Record<string, any>

  resultKeys.forEach((key) => {
    if (isArray(surveyResult[key])) {
      resultClone[key] = surveyResult[key].map(toValueObject)
    } else {
      const question = surveyQuestions.find(
        (q: SurveyQuestion) => q.key === key
      )
      if (
        question?.questionType === 'choice' ||
        question?.questionType === 'select'
      ) {
        resultClone[key] = toValueObject(surveyResult[key])
      } else {
        resultClone[key] = surveyResult[key]
      }
    }
  })

  // @TODO: omit fields earlier?
  return omit(resultClone, fieldsToOmit)
}

export default initialValues
