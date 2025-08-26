import { toggleViews } from 'components/Dashboard/Reporting/constants'
import { minutesToHourString } from 'lib/date'
import { useState, VFC } from 'react'
import {
  Bar,
  BarChart,
  BarProps,
  CartesianGrid,
  Cell,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatter } from './utils'

type BarPlotProps = BarProps & {
  onClickBar?: (...args: any) => void
  customXAxis?: boolean
  xAxis: string
  yAxis: string
}

const BarPlot: VFC<BarPlotProps> = ({
  data,
  xAxis,
  yAxis,
  color,
  onClickBar,
  customXAxis,
  className,
}) => {
  type CustomXAxisLabelProps = {
    x?: string
    y?: string
    payload?: { value: string }
  }
  const CustomXAxisLabel: VFC<CustomXAxisLabelProps> = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} textAnchor="middle" fontSize="12" dy={15}>
          {payload?.value || 'No Cohort'}
        </text>
      </g>
    )
  }

  const [focusBar, setFocusBar] = useState<number | undefined>(undefined)

  const yAxisLabel = () => {
    const label = toggleViews.find((view) => view.id === yAxis)
    return typeof label !== 'undefined' ? label.label : null
  }

  return (
    <div className={className}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          onMouseMove={(state) => {
            if (state.isTooltipActive) {
              setFocusBar(state.activeTooltipIndex)
            } else {
              setFocusBar(undefined)
            }
          }}
        >
          <CartesianGrid vertical={false} stroke="#f5f5f5" />
          <XAxis
            dataKey={xAxis}
            tick={customXAxis ? <CustomXAxisLabel /> : true}
            tickFormatter={(value) => (value === null ? 'N/A' : value)}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey={yAxis}
            tick={{ fontSize: 12 }}
            tickFormatter={
              yAxis === 'duration'
                ? (minutes) => minutesToHourString(minutes)
                : undefined
            }
            width={65}
            tickLine={false}
            axisLine={false}
          >
            <Label
              value={yAxisLabel() || yAxis}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Bar
            dataKey={yAxis}
            fill={color}
            onClick={onClickBar !== null ? onClickBar : undefined}
          >
            {data?.map((_, i) => {
              return (
                <Cell
                  key={`cell-${i}`}
                  fill={
                    color && focusBar === i
                      ? ['#']
                          .concat(color.split('').slice(1))
                          .concat(['80'])
                          .join('')
                      : color
                  }
                />
              )
            })}
          </Bar>
          <Tooltip formatter={formatter} cursor={{ fill: 'transparent' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarPlot
