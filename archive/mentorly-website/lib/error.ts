import { ErrorDetailsType } from 'components/Error/ErrorDetails'
import getMessages from 'lib/getMessages'
import {
  camelCase,
  flatten,
  lowerCase,
  mapValues,
  startCase,
  uniqBy,
  upperFirst,
  values,
} from 'lodash'

export const useErrorDetails = (
  errorDetails: ErrorDetailsType,
  locale: string
) => {
  const messages = getMessages(locale)

  const expectedObject = (obj: any) =>
    Object.keys(obj).every((key) => typeof key === 'string') &&
    Object.values(obj).every((value) => Array.isArray(value))

  if (!errorDetails || !expectedObject(errorDetails)) {
    return { errors: [messages['error.unknown']] }
  }

  const errorObject = mapValues(errorDetails, (value: any, key: string) => {
    const errors = value.map((e: any) => {
      const ids = [
        `error.${camelCase(e.error)}.${camelCase(key)}`,
        `error.${camelCase(e.error)}`,
      ]
      const [longId, shortId] = ids
      const msg =
        messages[longId] || messages[shortId] || sentenceMessageId(shortId)
      return msg.replace('{value}', e.value).replace('{field}', startCase(key))
    })
    return uniqBy(errors, (e: any) => e.error + key)
  })

  return { errors: flatten(values(errorObject)), errorObject }
}

const sentenceMessageId = (msg: string) => {
  // @TODO: this will be default be in english. \
  // Do we want to show in english,
  // or should we render the bilingual `error unknown`?
  if (!msg) {
    return 'error.unknown'
  }
  const words = msg.split('.')
  return upperFirst(lowerCase(words.pop()))
}

type ErrorWithMessage = {
  message: string
}

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

export const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message
}
