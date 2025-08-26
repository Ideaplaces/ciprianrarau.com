import { ButtonLink } from 'components/Button'
import Link from 'next/link'
import { FC } from 'react'
import { useIntl } from 'react-intl'

type ReportDownloadModalProps = {
  groupKey: string
}
const ReportDownloadModal: FC<ReportDownloadModalProps> = ({ groupKey }) => {
  const { locale, formatMessage } = useIntl()
  return (
    <>
      <div className="my-2">
        <h1 className="text-xl font-bold mb-4">
          {formatMessage({ id: 'term.download.members' })}
        </h1>
        <div className="flex space-x-2">
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupKey}/reports/members.csv?locale=${locale}`}
            passHref
          >
            <ButtonLink>{formatMessage({ id: 'term.csv' })}</ButtonLink>
          </Link>
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupKey}/reports/members.xlsx?locale=${locale}`}
            passHref
          >
            <ButtonLink>{formatMessage({ id: 'term.excel' })}</ButtonLink>
          </Link>
        </div>
      </div>
      <div className="my-2">
        <h1 className="text-xl font-bold mb-4">
          {formatMessage({ id: 'term.download.bookings' })}
        </h1>
        <div className="flex space-x-2">
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupKey}/reports/bookings.csv?locale=${locale}`}
            passHref
          >
            <ButtonLink>{formatMessage({ id: 'term.csv' })}</ButtonLink>
          </Link>
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupKey}/reports/bookings.xlsx?locale=${locale}`}
            passHref
          >
            <ButtonLink>{formatMessage({ id: 'term.excel' })}</ButtonLink>
          </Link>
        </div>
      </div>
    </>
  )
}

export default ReportDownloadModal
