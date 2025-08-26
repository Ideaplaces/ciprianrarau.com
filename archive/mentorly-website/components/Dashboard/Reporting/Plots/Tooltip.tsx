import { toggleViews } from 'components/Dashboard/Reporting/constants'
import { minutesToHourString } from 'lib/date'
import { VFC } from 'react'

type CustomTooltipProps = {
  active?: boolean
  payload?: Array<{
    name: string
    value: any
    fill: string
    stroke: string
  }>
  label?: string
  useColorFill?: boolean
}
const CustomTooltip: VFC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  useColorFill,
}) => {
  if (active && label) {
    const date = /.+?(?=T)/.exec(new Date(label).toISOString())

    const getYAxisName = (fullName: string) => {
      const dataType = fullName
        .split(' ')
        .find(
          (ele) =>
            ele === 'duration' ||
            ele === 'sessions' ||
            ele === 'mentees' ||
            ele === 'mentors' ||
            ele === 'signups'
        )
      return dataType
    }

    const getCohortName = (fullName: string) => {
      const cohort = fullName
        .split(' ')
        .filter(
          (ele) =>
            ele !== 'duration' &&
            ele !== 'sessions' &&
            ele !== 'mentees' &&
            ele !== 'mentors' &&
            ele !== 'signups'
        )
        .join(' ')
      return cohort === 'None' ? 'Non-cohort' : cohort
    }

    return (
      <div className="border border-gray p-3 bg-white">
        <p className="pb-1">{date?.[0]}</p>
        {payload?.map((it, i) => {
          const value =
            getYAxisName(it.name) === 'duration'
              ? minutesToHourString(it.value)
              : it.value
          return (
            <p
              key={`payload-${i}`}
              style={useColorFill ? { color: it.fill } : { color: it.stroke }}
            >
              {`${getCohortName(it.name)} ${
                toggleViews.find((view) => view.id === getYAxisName(it.name))
                  ?.label
              }: ${value}`}
            </p>
          )
        })}
      </div>
    )
  }
  return null
}

export default CustomTooltip
