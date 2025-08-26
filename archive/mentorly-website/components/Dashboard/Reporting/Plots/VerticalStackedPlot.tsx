import { toggleViews } from 'components/Dashboard/Reporting/constants'
import { minutesToHourString } from 'lib/date'
import { useWindowSize } from 'lib/useWindowSize'
import { zipObject } from 'lodash'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import MonthlyXAxisLabel from './MonthlyXAxisLabel'
import CustomTooltip from './Tooltip'

type VerticalStackedPlotProps = {
  cohorts: Array<string>
  data: any
  xAxis: string
  yAxis: string
  colors: Array<string>
  customXAxis?: boolean
  className?: string
}

const VerticalStackedPlot: VFC<VerticalStackedPlotProps> = ({
  cohorts,
  data,
  xAxis,
  yAxis,
  colors,
  customXAxis,
  className,
}) => {
  const [focusBar, setFocusBar] = useState<number | undefined>(undefined)
  const { formatMessage } = useIntl()
  const { isMobile } = useWindowSize()
  const mapColorsToCohort = zipObject(cohorts, colors)

  const yAxisLabel = () => {
    const label = toggleViews.find((view) => view.id === yAxis)
    return typeof label !== 'undefined'
      ? formatMessage({ id: `term.${label.label.toLowerCase()}` })
      : null
  }

  const formatDuration = (value: number) => {
    return minutesToHourString(value)
  }

  const customLegend = (value: string) => {
    if (!value) {
      return <span className="text-xs">-</span>
    }

    const cohort = value
      .split(' ')
      .filter((it) => {
        return (
          it !== 'duration' &&
          it !== 'sessions' &&
          it !== 'mentees' &&
          it !== 'signups'
        )
      })
      .join(' ')
    const label = toggleViews.find((view) => view.id === value.split(' ').pop())
    return (
      <span className="text-xs">{`${
        cohort === 'None' ? 'Non-cohort' : cohort
      } ${label?.label}`}</span>
    )
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="99%">
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
          <Tooltip
            content={<CustomTooltip useColorFill />}
            cursor={{ fill: 'transparent' }}
          />

          <XAxis
            tick={customXAxis ? <MonthlyXAxisLabel /> : true}
            dataKey={xAxis}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(value) =>
              yAxis === 'duration' ? formatDuration(value) : value
            }
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
          {cohorts?.map((cohort, i) => (
            <Bar
              key={`${cohort} ${yAxis}`}
              dataKey={`${cohort} ${yAxis}`}
              stackId="a"
              fill={colors[i]}
            >
              {data.map((_: any, i: number) => {
                return (
                  <Cell
                    key={`cell-${i}`}
                    fill={
                      focusBar === i
                        ? ['#']
                            .concat(
                              (mapColorsToCohort[cohort] || '111111')
                                .split('')
                                .slice(1)
                            )
                            .concat(['80'])
                            .join('')
                        : mapColorsToCohort[cohort] || '#111111'
                    }
                  />
                )
              })}
            </Bar>
          ))}
          {cohorts.length > 1 && (
            <Legend
              formatter={customLegend}
              layout={isMobile ? 'horizontal' : 'vertical'}
              verticalAlign={isMobile ? 'bottom' : 'middle'}
              align={isMobile ? undefined : 'right'}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default VerticalStackedPlot
