import { useWindowSize } from 'lib/useWindowSize'
import { ReactNode, VFC } from 'react'
import {
  Cell,
  CellProps,
  Legend,
  Pie,
  PieChart,
  PieProps,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const customLegend = (value: ReactNode) => {
  return <span className="text-xs">{value}</span>
}

const formatPercentage = (percent: number) => {
  return (percent * 100).toFixed(0)
}

type CustomLabelProps = Pick<
  PieProps,
  'cx' | 'cy' | 'startAngle' | 'endAngle' | 'innerRadius' | 'outerRadius'
> & { percent?: number; value?: any }

const CustomLabel: VFC<CustomLabelProps> = ({
  cx,
  cy,
  endAngle,
  innerRadius,
  outerRadius,
  percent,
  startAngle,
  value,
}) => {
  const RADIAN = Math.PI / 180

  const radius =
    !percent || percent < 0.01
      ? 0
      : percent < 0.1
      ? parseInt(outerRadius as string) * 1.15
      : percent < 0.25
      ? parseInt(outerRadius as string) * 0.75
      : parseInt(innerRadius as string) +
        (parseInt(outerRadius as string) - parseInt(innerRadius as string)) *
          0.5

  const midAngle = ((startAngle || 0) + (endAngle || 0)) / 2

  const x = parseInt(cx as string) + radius * Math.cos(-midAngle * RADIAN)
  const y = parseInt(cy as string) + radius * Math.sin(-midAngle * RADIAN)

  if (percent && percent < 0.01) return null

  if (!value) return null

  return (
    <text
      x={x}
      y={y}
      fill="black"
      fontSize={12}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      <tspan x={x} y={y}>
        {percent && formatPercentage(percent)}%
      </tspan>
    </text>
  )
}

type PiePlotProps = Omit<PieProps, 'dataKey' | 'nameKey' | 'fill'> & {
  value: PieProps['dataKey']
  name: PieProps['nameKey']
  colors: CellProps['fill'][]
  data: any
  legend?: any
}

const PiePlot: VFC<PiePlotProps> = ({
  data,
  value,
  name,
  colors,
  legend,
  className,
}) => {
  const { isMobile } = useWindowSize()
  return (
    <div className={className}>
      <ResponsiveContainer width="99%">
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey={value}
            nameKey={name}
            labelLine={false}
            label={CustomLabel}
          >
            {data.map((entry: { name: string }, i: number) => (
              <Cell key={entry.name} fill={colors?.[i]} />
            ))}
          </Pie>
          <Legend
            content={legend || null}
            formatter={customLegend}
            layout={isMobile ? 'horizontal' : 'vertical'}
            verticalAlign={isMobile ? 'top' : 'middle'}
            align={isMobile ? undefined : 'right'}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PiePlot
