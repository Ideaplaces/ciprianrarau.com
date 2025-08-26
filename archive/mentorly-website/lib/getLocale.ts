import parser from 'accept-language-parser'
import cookie from 'js-cookie'
import { NextPageContext } from 'next'
import nextCookie from 'next-cookies'

export type LocaleType = 'en' | 'fr'

const acceptLanguages = ['en', 'fr']
const defaultLocale = acceptLanguages[0] as LocaleType

export const validateLocale = (locale?: string | string[]): LocaleType => {
  if (!locale) {
    return defaultLocale
  }

  const value = Array.isArray(locale) ? locale[0] : locale

  return acceptLanguages.includes(value)
    ? (locale as LocaleType)
    : defaultLocale
}

const getLocale = (ctx: NextPageContext) => {
  try {
    const cookieLocale = nextCookie(ctx).locale
    let locale = defaultLocale
    if (cookieLocale) {
      // check if user has set locale
      locale = validateLocale(cookieLocale)
    } else {
      // check if user has set locale
      const systemlocales = parser.parse(
        ctx.req?.headers['accept-language'] || defaultLocale
      )
      const systemLocale = systemlocales[0].code
      locale = validateLocale(systemLocale)
      cookie.set('locale', locale, { expires: 365 })
    }
    return locale
  } catch (error) {
    console.error(error)
    return defaultLocale
  }
}

export default getLocale
