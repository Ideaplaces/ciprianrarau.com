import { colors } from 'components/Dashboard/Reporting/constants'
import PiePlot from 'components/Dashboard/Reporting/Plots/PiePlot'
import Empty from 'components/display/Empty'
import Panel from 'components/display/Panel'
import { map, omit, sum } from 'lodash'
import { VFC } from 'react'
import { PieChart } from 'react-feather'
import { useIntl } from 'react-intl'
import { LegendPayload } from 'recharts'

import { getValue } from '../Plots/utils'

type RepeatSessionRateProps = {
  sessionStats: Record<string, any>
}

const RepeatSessionRate: VFC<RepeatSessionRateProps> = ({ sessionStats }) => {
  const { formatMessage } = useIntl()

  const stats = omit(sessionStats, 'id')

  const customLegend = ({ payload }: { payload: readonly LegendPayload[] }) => {
    return (
      <>
        {payload.map((p) => {
          const { value, color } = p
          if (getValue(value) === '0') {
            return null
          }
          if (getValue(value) === '1') {
            return (
              <div key={value} className="flex items-center">
                <div
                  className="mr-1"
                  style={{
                    width: '14px',
                    height: '10.5px',
                    backgroundColor: color,
                  }}
                />
                <div className="text-xs">
                  {formatMessage({ id: 'reporting.rebookedOneMentor' })}
                </div>
              </div>
            )
          } else {
            return (
              <div key={value} className="flex items-center">
                <div
                  className="mr-1"
                  style={{
                    width: '14px',
                    height: '10.5px',
                    backgroundColor: color,
                  }}
                />
                <div className="text-xs">
                  {formatMessage(
                    { id: 'reporting.rebookedManyMentors' },
                    { number: getValue(value) }
                  )}
                </div>
              </div>
            )
          }
        })}
      </>
    )
  }

  if (sum(Object.values(stats)) === 0) {
    return (
      <Panel>
        <Panel.Header>
          {formatMessage({ id: 'stat.repeatedMentorSessions' })}
        </Panel.Header>
        <Panel.Body>
          <Empty className="h-64" icon={PieChart} />
        </Panel.Body>
      </Panel>
    )
  }

  const data = map(stats, (value, key) => ({
    name: formatMessage({ id: `reporting.${key}` }),
    value,
  }))

  return (
    <Panel>
      <Panel.Header>
        {formatMessage({ id: 'stat.repeatedMentorSessions' })}
      </Panel.Header>
      <Panel.Body>
        <PiePlot
          className="h-64 w-full"
          data={data}
          value="value"
          name="name"
          colors={colors}
          legend={customLegend}
        />
      </Panel.Body>
    </Panel>
  )
}

export default RepeatSessionRate
