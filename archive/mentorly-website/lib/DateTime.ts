import { set } from 'date-fns'
import { format as formatTZ } from 'date-fns-tz'
import en from 'date-fns/locale/en-CA'
import fr from 'date-fns/locale/fr-CA'
import { dateVal } from 'lib/date'
import getMessages from 'lib/getMessages'
import { useIntl } from 'react-intl'

const locales: any = { en, fr }

const userTimezone = (locale = 'en') => {
  const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone

  return {
    locale: locales[locale],
    timeZone: userTZ,
  }
}

// Get the timezone string for a given date
// We modify the date to get the zone at noon,
// since the date changes during the night
export const timezone = (date: Date, locale = 'en') => {
  if (!date) {
    return null
  }

  return formatTZ(
    set(date, { hours: 12, minutes: 0, seconds: 0 }),
    'zzz',
    userTimezone(locale)
  )
}

type FormatDateTimeProps = {
  date: string | Date
  endDate?: string | Date
  format: string
  showGMT?: boolean
}

export const parseDate = (
  dateTime: string | Date,
  format: string,
  locale: string
) => {
  const terms = getMessages(locale)
  const localeFormat = terms[format]

  return formatTZ(dateVal(dateTime), localeFormat, userTimezone(locale))
}

// @TODO: in certain contexts, this returns [Object], rather than string value
const FormatDateTime = ({
  date,
  endDate,
  format,
  showGMT,
}: FormatDateTimeProps) => {
  const { locale } = useIntl()

  //@TODO: if remove redundant date info
  // i.e. if range is May 1 10am - May 1 11am, just show May 1 10am - 11am
  const displayDate = endDate
    ? `${parseDate(date, format, locale)} - ${parseDate(
        endDate,
        format,
        locale
      )}`
    : parseDate(date, format, locale)

  const tz = showGMT && timezone(new Date(date), locale)

  return tz ? `${displayDate} (${tz})` : displayDate
}
export default FormatDateTime
