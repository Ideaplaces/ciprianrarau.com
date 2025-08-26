import { gql } from '@apollo/client'
import { darkBlue, yellow } from 'components/Dashboard/Reporting/constants'
import AreaPlot from 'components/Dashboard/Reporting/Plots/AreaPlot'
import Empty from 'components/display/Empty'
import Panel from 'components/display/Panel'
import { addMonthPrior } from 'lib/date'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'

const darkGray = '#cccccc'

// @TODO swap out mentor and mentee data for requests and messages

gql`
  fragment DashboardProgramActivityFields on ManagedGroup {
    monthlyBookingParticipationStats {
      id
      grouping: month
      sessions: sessionCount
      mentors: mentorCount
      mentees: menteeCount
    }
  }
`

export type ProgramActivityProps = {
  data?: Array<Record<string, any>>
  loading: boolean
}

const ProgramActivity: VFC<ProgramActivityProps> = ({ data, loading }) => {
  if (loading) {
    return <Skeleton count={4} height={55} />
  }

  if (!data || data.length === 0) {
    return <Empty />
  }

  const formattedData = data.length > 1 ? data : addMonthPrior(data)

  return (
    <AreaPlot
      className="w-full h-64 my-0 mx-auto"
      data={formattedData}
      xAxis="grouping"
      yAxes={['mentors', 'mentees', 'sessions']}
      colors={[yellow, darkBlue, darkGray]}
      customXAxis
    />
  )
}

const ProgramActivityWrapper: VFC<ProgramActivityProps> = (props) => {
  const { formatMessage } = useIntl()

  return (
    <Panel>
      <Panel.Header>
        {formatMessage({ id: 'section.programActivity' })}
      </Panel.Header>
      <Panel.Body>
        <ProgramActivity {...props} />
      </Panel.Body>
    </Panel>
  )
}

export default ProgramActivityWrapper
