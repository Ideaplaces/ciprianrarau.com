import ProgressPill from 'components/Dashboard/ProgressPill'
import { VFC } from 'react'

export type PercentageBarProps = {
  grouping: string
  percentage?: number
  value?: number
  total?: number
}

const PercentageBar: VFC<PercentageBarProps> = ({
  grouping,
  percentage,
  value,
  total,
}) => {
  const displayValue = `${value}/${total}`

  return (
    <div key={grouping}>
      <div className="text-xs mb-1">
        <ProgressPill status={grouping} testId={`${grouping}-progress-pill`} />
        {displayValue}
      </div>

      <div className="flex items-center">
        <div className="w-full bg-gray h-5">
          <div
            style={{
              width: `${percentage}%`,
              backgroundColor: '#cccccc',
            }}
            className="h-5"
          />
        </div>

        <div className="flex-none text-xs text-darkGray w-10 text-right whitespace-nowrap">{`${percentage}%`}</div>
      </div>
    </div>
  )
}

export type PercentageBarsProps = {
  data?: PercentageBarProps[]
  total?: number
}

const PercentageBars: VFC<PercentageBarsProps> = ({ data }) => {
  if (!data) {
    return null
  }

  return (
    <>
      {data.map(({ grouping, percentage, value, total }) => (
        <div className="mb-3" key={grouping}>
          <PercentageBar
            key={grouping}
            grouping={grouping}
            percentage={percentage}
            total={total}
            value={value}
          />
        </div>
      ))}
    </>
  )
}

export default PercentageBars
