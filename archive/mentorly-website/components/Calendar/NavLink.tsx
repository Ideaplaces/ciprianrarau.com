import Tooltip from 'components/display/Tooltip'
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  isAfter,
  isBefore,
} from 'date-fns'
import { useCalendarProps } from 'lib/calendarProps'
import { endOf, startOf } from 'lib/date'
import { useCurrentGroup } from 'lib/GroupContext'
import Link from 'next/link'
import { FC, ReactNode } from 'react'
import { useIntl } from 'react-intl'

type NavLinkProps = {
  children: ReactNode
  calendarView: 'week' | 'month' | 'day'
  date: Date
  navigation: any
  editing: boolean
}

const NavLink: FC<NavLinkProps> = ({
  children,
  calendarView,
  date,
  navigation,
  editing,
}) => {
  const { currentGroup, isDashboard } = useCurrentGroup()
  const { formatMessage, locale } = useIntl()
  const { filter } = useCalendarProps()

  const params = filter && `filter=${filter}`

  function getNavigationDate(date: Date, view: NavLinkProps['calendarView']) {
    switch (navigation + view) {
      case 'nextmonth':
        return addMonths(date, 1)
      case 'prevmonth':
        return addMonths(date, -1)
      case 'nextweek':
        return addWeeks(date, 1)
      case 'prevweek':
        return addWeeks(date, -1)
      case 'nextday':
        return addDays(date, 1)
      case 'prevday':
        return addDays(date, -1)
      case 'nextagenda':
        return addDays(date, 1)
      case 'prevagenda':
        return addDays(date, -1)
      default:
        return date
    }
  }

  const newDate = getNavigationDate(date, calendarView)

  // if group has not set dates, they can navigate to wherever...
  const dateTooLate =
    currentGroup.endsAt &&
    isAfter(startOf(calendarView, newDate), new Date(currentGroup.endsAt))
  //... unless setting availabilities
  const dateTooEarly =
    (currentGroup.startsAt || editing) &&
    isBefore(
      endOf(calendarView, newDate),
      editing ? new Date() : new Date(currentGroup.startsAt)
    )

  // allow to navigate to a correct date, in case calendar lands on disabled day
  const disableNav =
    (dateTooLate && ['today', 'next'].includes(navigation)) ||
    (dateTooEarly && ['today', 'prev'].includes(navigation))

  if (disableNav) {
    return (
      <span className="opacity-50 cursor-not-allowed">
        <Tooltip
          text={formatMessage({ id: 'form.availability.outside' })}
          hide={!children}
          distance={-40}
        >
          <div className="py-2 px-4 focus:outline-none">{children}</div>
        </Tooltip>
      </span>
    )
  }
  const navigationDate = newDate && format(newDate, 'yyyy-MM-dd')
  const base = isDashboard ? 'dashboard/sessions/' : 'personal/calendar/'

  return (
    <Link
      href={`/${locale}/${base}${calendarView}/${navigationDate}${
        params ? '/?' + params : ''
      }`}
      passHref
    >
      <a className="py-2 px-3 focus:outline-none cursor-pointer transition duration-150 border border-gray hover:border-darkGray rounded hover:bg-lightGray">
        {children}
      </a>
    </Link>
  )
}

export default NavLink
