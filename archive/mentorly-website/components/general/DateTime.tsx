import { formatLocaleDate, timezone } from 'lib/date'
import { useIntl } from 'react-intl'

type FormatDateTimeProps = {
  className?: string
  date: string | Date
  endDate?: string | Date
  format: string
  showTZ?: boolean
}
const FormatDateTime = ({
  className,
  date,
  endDate,
  format,
  showTZ,
}: FormatDateTimeProps) => {
  const { formatMessage, locale } = useIntl()
  const formatKey = formatMessage({ id: format })

  const start = new Date(date)
  const end = endDate ? new Date(endDate) : undefined

  const displayDate = formatLocaleDate(
    { date: start, endDate: end },
    formatKey,
    locale
  )

  const tz = showTZ && timezone(start, locale)

  return (
    <span className={className}>
      {tz ? `${displayDate} (${tz})` : displayDate}
    </span>
  )
}

export default FormatDateTime
