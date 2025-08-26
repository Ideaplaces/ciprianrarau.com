import { disabledColors } from 'components/Dashboard/Reporting/constants'
import PiePlot from 'components/Dashboard/Reporting/Plots/PiePlot'
import Empty from 'components/display/Empty'
import Panel from 'components/display/Panel'
import { map, omit, sum } from 'lodash'
import { VFC } from 'react'
import { PieChart } from 'react-feather'
import { useIntl } from 'react-intl'
import { LegendPayload } from 'recharts'

type MenteeAdoptionRateProps = {
  sessionStats: Record<string, any>
}

const customLegend = ({ payload }: { payload: readonly LegendPayload[] }) => {
  return (
    <>
      {payload.map(({ value, color }) => {
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
            <div className="text-xs">{value}</div>
          </div>
        )
      })}
    </>
  )
}

const MenteeAdoptionRate: VFC<MenteeAdoptionRateProps> = ({ sessionStats }) => {
  const { formatMessage } = useIntl()

  const stats = omit(sessionStats, 'id')

  if (sum(Object.values(stats)) === 0) {
    return (
      <Panel>
        <Panel.Header>
          {formatMessage({ id: 'stat.menteeAdoptionRate' })}
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
        {formatMessage({ id: 'stat.menteeAdoptionRate' })}
      </Panel.Header>
      <Panel.Body>
        <PiePlot
          className="h-64 w-full"
          data={data}
          value="value"
          name="name"
          colors={disabledColors}
          legend={customLegend}
        />
      </Panel.Body>
    </Panel>
  )
}

export default MenteeAdoptionRate
