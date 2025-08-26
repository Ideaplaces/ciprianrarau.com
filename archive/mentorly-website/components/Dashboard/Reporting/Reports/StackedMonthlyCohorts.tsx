import { colors } from 'components/Dashboard/Reporting/constants'
import VerticalStackedPlot from 'components/Dashboard/Reporting/Plots/VerticalStackedPlot'
import Empty from 'components/display/Empty'
import { eachMonthOfInterval, format, parseISO } from 'date-fns'
import { first, isEmpty, keyBy, last } from 'lodash'
import { VFC } from 'react'
import { BarChart } from 'react-feather'
import { ManagedGroup } from 'types/graphql'

type StackedMonthlyCohortsProps = {
  data: ManagedGroup['monthlyStats']
  view: string
}

const StackedMonthlyCohorts: VFC<StackedMonthlyCohortsProps> = ({
  data,
  view,
}) => {
  if (isEmpty(data)) {
    return <Empty className="h-64" icon={BarChart} />
  }

  const cohorts = [] as StackedMonthlyCohortsProps['data']['month']['cohort']
  Object.keys(data).map((month) => {
    Object.keys(data[month]).map((cohort) => {
      if (!cohorts.includes(cohort)) {
        cohorts.push(cohort)
      }
    })
  })

  let formattedData = [] as StackedMonthlyCohortsProps['data'][]
  Object.keys(data).map((month) => {
    Object.keys(data[month]).map((cohort) => {
      const sessions = data[month][cohort].sessions
      const duration = data[month][cohort].duration
      const mentees = data[month][cohort].mentees
      const signups = data[month][cohort].signups

      if (formattedData.find((obj) => obj.month === month)) {
        const itemsInMonth = formattedData.find((obj) => obj.month === month)
        const newValue = {
          ...itemsInMonth,
          [`${cohort} sessions`]: sessions,
          [`${cohort} duration`]: duration,
          [`${cohort} mentees`]: mentees,
          [`${cohort} signups`]: signups,
        }
        const index = formattedData.findIndex((it) => it.month === month)

        formattedData = [
          ...formattedData.slice(0, index),
          newValue,
          ...formattedData.slice(index + 1),
        ]
        return
      }
      formattedData.push({
        month: month,
        [`${cohort} sessions`]: sessions,
        [`${cohort} duration`]: duration,
        [`${cohort} mentees`]: mentees,
        [`${cohort} signups`]: signups,
      })
    })
  })

  const fillData = (data: Array<{ month: any }>) => {
    const mappedData: Array<any> = data.map((row) => ({
      ...row,
      month: parseISO(row.month),
    }))
    const monthlyData = keyBy(mappedData, 'month')
    const range = eachMonthOfInterval({
      start: first(mappedData).month,
      end: last(mappedData).month,
    })

    const test = range.map(
      (month) =>
        monthlyData[month.toString()] || {
          month: month,
          [`None duration`]: 0,
          [`None sessions`]: 0,
          [`None mentees`]: 0,
          [`None signups`]: 0,
        }
    )
    return test.map((row) => ({
      ...row,
      month: format(row.month, 'yyyy-MM-dd'),
    }))
  }

  return (
    <div>
      <VerticalStackedPlot
        cohorts={cohorts}
        className="w-full h-64 my-0 mx-auto"
        data={fillData(formattedData)}
        xAxis="month"
        yAxis={view}
        colors={colors}
        customXAxis
      />
    </div>
  )
}

export default StackedMonthlyCohorts
