import classNames from 'classnames'
import { toggleViews } from 'components/Dashboard/Reporting/constants'
import Empty from 'components/display/Empty'
import { minutesToHourString } from 'lib/date'
import { VFC } from 'react'
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  LineChartProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import MonthlyXAxisLabel from './MonthlyXAxisLabel'
import CustomTooltip from './Tooltip'

type LinePlotProps = LineChartProps & {
  xAxis: string
  yAxis: string
  color: string
  customXAxis: boolean
  withLink: boolean
  yearToDate: boolean
  data: any
}
const LinePlot: VFC<LinePlotProps> = ({
  data,
  xAxis,
  yAxis,
  color,
  customXAxis,
  className,
  yearToDate,
}) => {
  const currentYear = Date.parse(new Date().getFullYear().toString())

  const numericDate = data?.map((item: { grouping: string; month: string }) => {
    return item.grouping
      ? { ...item, date: Date.parse(item.grouping) }
      : { ...item, date: Date.parse(item.month) }
  })

  const yearToDateData = numericDate.filter((item: { date: number }) => {
    return item.date > currentYear || item.date == currentYear
  })

  const displayData = (yearToDate ? yearToDateData : numericDate).map(
    (d: any) => {
      return { ...d, [yAxis]: d[yAxis] || 0 }
    }
  )

  if (displayData.length === 0) {
    return <Empty className={className} />
  }

  return (
    <div className={classNames(className, 'relative flex items-end')}>
      <ResponsiveContainer width="99%">
        <LineChart data={displayData} margin={{ right: 30, top: 20 }}>
          <CartesianGrid vertical={false} stroke="#f5f5f5" />
          <XAxis
            dataKey={xAxis}
            tick={customXAxis ? <MonthlyXAxisLabel /> : true}
            tickLine={false}
            axisLine={false}
            type={'category'}
            allowDataOverflow
            interval={numericDate.length > 24 ? undefined : 0}
          />
          <YAxis
            dataKey={yAxis}
            tickFormatter={
              yAxis === 'duration'
                ? (minutes) => minutesToHourString(minutes)
                : undefined
            }
            width={65}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            interval={0}
          >
            <Label
              value={toggleViews?.find((view) => view.id === yAxis)?.label}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Line
            dataKey={yAxis}
            stroke={color}
            dot={{ strokeWidth: 3, r: 3 }}
            activeDot={{ r: 6 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LinePlot
