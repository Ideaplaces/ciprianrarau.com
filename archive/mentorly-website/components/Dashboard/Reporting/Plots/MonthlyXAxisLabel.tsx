import { parseDate } from 'lib/date'
import { FC } from 'react'

type MonthlyXAxisLabelProps = {
  y?: string | number
  payload?: {
    coordinate: string | number
    value: Date | string
    index: number
  }
}

const MonthlyXAxisLabel: FC<MonthlyXAxisLabelProps> = ({ y, payload }) => {
  if (!y || !payload) return null

  const date = parseDate(payload.value)

  if (!date) {
    return null
  }

  const arr = date.toISOString().split('-')

  return (
    <g transform={`translate(${payload.coordinate},${y})`}>
      <text
        x={-10}
        y={0}
        fontWeight="bold"
        fontSize="12"
        textAnchor="middle"
        dy={15}
      >
        {arr[1]}
      </text>

      {(arr[1] === '01' || payload?.index === 0) && (
        <text x={15} y={0} textAnchor="middle" fontSize="12" dy={15}>
          {arr[0]}
        </text>
      )}
    </g>
  )
}

export default MonthlyXAxisLabel
