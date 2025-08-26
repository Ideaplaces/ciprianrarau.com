import classNames from 'classnames'
import { format } from 'date-fns'
import { parseDate } from 'lib/date'
import { capitalize } from 'lodash'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  LegendProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import MonthlyXAxisLabel from './MonthlyXAxisLabel'

type CustomTooltipProps = {
  active?: boolean
  payload?: { stroke: string; name: string; value: any }[]
  label?: any
}
const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, label }) => {
  const date = parseDate(label)

  if (active && date) {
    const dateString = format(date, 'yyyy-MM-dd')

    return (
      <div className="border border-gray p-3 bg-white">
        <p className="pb-1">{dateString}</p>
        {payload?.map((pay, i) => {
          return (
            <p
              key={`payload-${i}`}
              style={{ color: pay.stroke }}
            >{`${pay.name}: ${pay.value}`}</p>
          )
        })}
      </div>
    )
  }
  return null
}

type AreaPlotProps = {
  data: Record<string, any>[]
  xAxis: string
  yAxes: string[]
  colors: string[]
  customXAxis: boolean
  className: string
}
const AreaPlot: FC<AreaPlotProps> = ({
  data,
  xAxis,
  yAxes,
  colors,
  customXAxis,
  className,
}) => {
  const [disabled, setDisabled] = useState<Record<string, any>>({})
  const { formatMessage } = useIntl()

  const handleLegendClick: LegendProps['onClick'] = (r: { dataKey?: any }) => {
    setDisabled({ ...disabled, [r.dataKey]: !disabled[r.dataKey] })
  }

  const RenderText: FC<LegendProps['formatter']> = (value, entry) => {
    const { color } = entry || {}
    const label = formatMessage({ id: `term.${value}` })
    // @TODO: active state was broken, try to fix
    return <span style={{ color }}>{capitalize(label)}</span>
  }

  return (
    <div className={classNames(className, 'flex items-end')}>
      <ResponsiveContainer width="99%">
        <AreaChart data={data} margin={{ left: 20, right: 30, top: 20 }}>
          <CartesianGrid vertical={false} stroke="#f5f5f5" />
          <XAxis
            dataKey={xAxis}
            tick={customXAxis ? <MonthlyXAxisLabel /> : true}
            tickLine={false}
            axisLine={false}
            interval={0}
          />
          <YAxis hide tickLine={false} axisLine={false} />
          {yAxes.map((axis: string, i: number) => (
            <Area
              key={`axis-${i}`}
              dataKey={axis}
              stroke={colors[i]}
              fill={colors[i]}
              fillOpacity={0.4}
              hide={disabled[axis]}
            />
          ))}
          <Legend
            formatter={RenderText}
            wrapperStyle={{ top: -42, left: 25 }}
            align="right"
            onClick={handleLegendClick}
          />
          <Tooltip content={<CustomTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AreaPlot
