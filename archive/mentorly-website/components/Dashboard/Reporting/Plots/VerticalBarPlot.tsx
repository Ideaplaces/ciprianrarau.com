import classNames from 'classnames'
import startCase from 'lodash/startCase'
import { VFC } from 'react'
import {
  Bar,
  BarChart,
  Legend,
  LegendPayload,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

type VerticalBarPlotProps = {
  data: { name: string; value: any }[]
  yAxis: string
  color: Record<string, any>
  className?: string
}
const VerticalBarPlot: VFC<VerticalBarPlotProps> = ({
  data,
  yAxis,
  color,
  className,
}) => {
  const cleanData = () => {
    const obj = data.reduce(
      (obj, item) => ({ ...obj, [item.name]: item.value }),
      {}
    )
    return [obj] as Array<Record<string, any>>
  }

  const renderLegend = (props: { payload?: readonly LegendPayload[] }) => {
    const { payload } = props

    let obj = cleanData()[0]
    const sumValues = Object.values(obj).reduce((a, b) => a + b)
    obj = { ...obj, Total: sumValues }

    const labels = Object.keys(obj)

    const colors = payload?.reduce(
      (obj, entry) => ({
        ...obj,
        [entry.value]: entry.color,
      }),
      {}
    )

    return (
      <div className="flex justify-center">
        {labels.map((label, index) => {
          return (
            <div key={`item-${index}`}>
              <div className="flex items-center px-3">
                <div
                  className={classNames(
                    label === 'Total' ? 'border' : null,
                    'h-3 w-3 mr-1 mb-1'
                  )}
                  style={{
                    backgroundColor:
                      colors?.[label as keyof typeof colors] || '#FFF',
                  }}
                />
                <div className="text-sm">{label}</div>
              </div>
              <div className="font-bold text-xl text-center">{obj[label]}</div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={className}>
      <ResponsiveContainer>
        <BarChart
          data={cleanData()}
          layout="vertical"
          margin={{ right: 25, left: 25 }}
          stackOffset="expand"
        >
          <Legend
            formatter={(value) => startCase(value)}
            content={renderLegend}
          />
          <XAxis hide type="number" />
          <YAxis hide dataKey={yAxis} type="category" />
          {Object.keys(cleanData()[0]).map((item, i) => (
            <Bar
              key={`item-${i}`}
              dataKey={item}
              stackId="a"
              fill={color[i]}
              barSize={80}
            ></Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default VerticalBarPlot
