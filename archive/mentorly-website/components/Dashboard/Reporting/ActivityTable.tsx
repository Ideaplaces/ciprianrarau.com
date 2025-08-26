import Empty from 'components/display/Empty'
import { eachMonthOfInterval, format, parseISO } from 'date-fns'
import { groupBy, isEmpty, map } from 'lodash'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { Scalars } from 'types/graphql'

const styleDate = (date: Date) => {
  const formatted = format(date, 'MM Y')
  const arr = formatted.split(' ')
  return (
    <div>
      <span className="text-sm mr-1">{arr[0]}</span>
      <span className="text-sm font-normal">{arr[1]}</span>
    </div>
  )
}

const rangeToArray = ([start, end]: [start: string, end: string]) => {
  return eachMonthOfInterval({ start: parseISO(start), end: parseISO(end) })
}

type ActivityTableProps = {
  data: Scalars['JSON']
  type: 'cohort_name' | 'mentee_name' | 'mentor_name'
  monthRange: [start: string, end: string]
  cohortSessions: Record<string, Array<number>>
  grandTotal: number | string
}

const ActivityTable: VFC<ActivityTableProps> = ({
  data,
  type,
  monthRange,
  cohortSessions,
  grandTotal,
}) => {
  const { formatMessage } = useIntl()

  if (isEmpty(data) || isEmpty(cohortSessions)) {
    return <Empty className="h-64" />
  }

  const dates = rangeToArray(monthRange)

  return (
    <div className="bg-white overflow-auto text-sm">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left bg-gray border-r border-darkGray pl-2 py-2">
              {formatMessage({ id: 'term.cohorts' })}
            </th>
            <th className="text-left bg-gray border-r border-darkGray pl-2 py-2">
              {formatMessage({ id: 'term.name' })}
            </th>
            {dates.map((date) => (
              <th
                key={date.toString()}
                className="text-right p-1 bg-gray border-l border-darkGray py-2"
              >
                {styleDate(date)}
              </th>
            ))}
            <th className="text-right p-1 pr-2 bg-gray border-l border-darkGray py-2">
              Total
            </th>
          </tr>
        </thead>
        {map(data, (mentors, cohortName) => {
          const cohortTotal = cohortSessions[cohortName]?.reduce(
            (sum, current) => {
              return sum + current
            },
            0
          )
          return (
            <tbody key={cohortName}>
              {Object.keys(mentors).map((mentorName, index) => {
                const dateData = mentors[mentorName]
                const sessionsByName = groupBy(dateData, type)
                const mentorSum =
                  sessionsByName[mentorName] &&
                  sessionsByName[mentorName].reduce((sum, { sessions }) => {
                    return sum + sessions
                  }, 0)
                return (
                  <tr key={mentorName}>
                    {index === 0 ? (
                      <td className="pl-2 border-b border-darkGray">
                        {cohortName}
                      </td>
                    ) : (
                      <td className="border-b border-darkGray">&nbsp;</td>
                    )}
                    <td className="sticky p-1 border-b border-l border-darkGray pl-2">
                      {mentorName}
                    </td>
                    {dates.map((date) => {
                      return (
                        <td
                          key={date.toString()}
                          className="text-right p-1 pr-2 border-l border-b border-darkGray"
                        >
                          {dateData[format(date, 'Y-MM-dd')]?.sessions || ''}
                        </td>
                      )
                    })}
                    <td className="text-right p-1 pr-2 border-l border-b border-darkGray">
                      {mentorSum}
                    </td>
                  </tr>
                )
              })}
              <tr className="bg-gray">
                {dates.map((date) => (
                  <th className="py-2" key={date.toString()}>
                    &nbsp;
                  </th>
                ))}
                <th
                  className="text-right pr-2"
                  colSpan={3}
                >{`${cohortName} Total: ${cohortTotal}`}</th>
              </tr>
            </tbody>
          )
        })}
      </table>
      <div className="bg-primary rounded font-bold p-3 mt-3 w-40 float-right text-center">
        {`Grand Total: ${grandTotal}`}
      </div>
    </div>
  )
}

export default ActivityTable
