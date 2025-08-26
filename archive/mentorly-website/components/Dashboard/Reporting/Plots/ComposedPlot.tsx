import { minutesToHourString } from 'lib/date'
import { VFC } from 'react'
import {
  Bar,
  BarProps,
  ComposedChart,
  ComposedChartProps,
  Legend,
  Line,
  LineProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatter } from './utils'

type BiaxialProps = {
  values: BarProps['dataKey']
  unit: BarProps['unit']
  color: BarProps['fill']
}

type ComposedPlotProps = ComposedChartProps & {
  xAxis: string
  yAxis: string
  biaxial: {
    left: BiaxialProps
    right: BiaxialProps
  }
  line: LineProps['dataKey']
}

const ComposedPlot: VFC<ComposedPlotProps> = ({
  data,
  xAxis,
  yAxis,
  biaxial,
  line,
  className,
}) => {
  const { left, right } = biaxial || {}

  return (
    <div className={className}>
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <XAxis
            dataKey={xAxis}
            tickFormatter={(value) => (value === null ? 'N/A' : value)}
          />

          {biaxial !== null ? (
            <YAxis yAxisId="left" orientation="left" stroke={left.color} />
          ) : null}
          {biaxial !== null ? (
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={right.color}
              tickFormatter={(minutes) => minutesToHourString(minutes)}
            />
          ) : (
            <YAxis dataKey={yAxis} />
          )}

          {biaxial !== null ? (
            <Bar
              yAxisId="left"
              dataKey={left.values}
              unit={left.unit}
              fill={left.color}
            />
          ) : null}
          {biaxial !== null ? (
            <Bar
              yAxisId="right"
              dataKey={right.values}
              unit={right.unit}
              fill={right.color}
            />
          ) : (
            <Bar dataKey={yAxis} fill={left.color} />
          )}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={line}
            stroke={left.color}
          />
          <Tooltip formatter={formatter} />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ComposedPlot
