import startCase from 'lodash/startCase'
import { VFC } from 'react'
import {
  AxisDomain,
  Bar,
  BarChart,
  // LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

type ProgressBarPlotProps = {
  data: Array<Record<string, any>>
  yAxis: string
  color: string
  className?: string
}

const ProgressBarPlot: VFC<ProgressBarPlotProps> = ({
  // Note: if data value is zero, return null so it doesn't show on chart
  data = [
    {
      invited: 3,
      onboard: 5,
      signedUp: 1,
      approved: null,
      paid: 3,
      requested: 9,
      firstSession: 3,
      completedSessions: 1,
      surveySent: null,
      surveyResponded: 2,
    },
  ],
  yAxis = 'mentees',
  color = {
    red: '#f75c4b',
    yellow: '#fed800',
    orange: '#f9ae2d',
    pink: '#fdd4ff',
    purple: '#c291c5',
    blue: '#989dff',
    green: '#2db983',
    darkBlue: '#788efb',
    lilac: '#c4b5fe',
    lightGrey: '#eff0f1',
  },
  className,
}) => {
  const domain = [0, 1] as AxisDomain
  const categories = Object.keys(data[0])
  const colorValues = Object.values(color)

  return (
    <div className={className}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          stackOffset="expand"
          margin={{ right: 25, left: 25, top: -21 }}
        >
          <Legend
            formatter={(value) => startCase(value)}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              paddingLeft: '50px',
              marginTop: '-20px',
            }}
          />
          <XAxis
            domain={domain}
            type="number"
            ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
            tickFormatter={(value) => (value === 0 ? '%' : `${value * 100}`)}
            // interval={0}
            tick={{ fontSize: 12, fontWeight: 'bold' }}
            tickLine={false}
            axisLine={false}
            dy={-25}
          />
          <YAxis hide dataKey={yAxis} type="category" />
          {categories.map((category, i) => (
            <Bar
              key={`category-${i}`}
              dataKey={category}
              stackId="a"
              fill={colorValues[i]}
              barSize={80}
            >
              {/*    <LabelList dataKey={category} position="center" /> */}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ProgressBarPlot
