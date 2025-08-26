import { gql } from '@apollo/client'
import ToggleButtons from 'components/controls/ToggleButtons'
import DashboardLayout from 'components/Dashboard/Layout'
import { ReportingMenu } from 'components/Dashboard/Menu'
import {
  lilac,
  orange,
  pink,
  purple,
  red,
  yellow,
} from 'components/Dashboard/Reporting/constants'
import PiePlot from 'components/Dashboard/Reporting/Plots/PiePlot'
import ReportDownloadModal from 'components/Dashboard/Reporting/Reports/ReportDownloadModal'
import Panel from 'components/display/Panel'
import PercentageBars from 'components/display/PercentageBars'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import Row from 'components/layout/Row'
import { useModal } from 'components/Modal/ModalContext'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  DashboardMiscellaneousPageQuery,
  DashboardMiscellaneousPageQueryVariables,
  useDashboardMiscellaneousPageQuery,
} from 'types/graphql'

const colors = [yellow, orange, red, pink, purple, lilac]

const ageData = [
  { grouping: '18-24', value: 35.1, color: yellow },
  { grouping: '25-34', value: 30.2, color: orange },
  { grouping: '35-44', value: 10.1, color: red },
  { grouping: '45-54', value: 9.87, color: pink },
  { grouping: '55+', value: 8.01, color: purple },
]

const pronounData = [
  { grouping: 'He', value: 35.1, color: yellow },
  { grouping: 'She', value: 30.2, color: orange },
  { grouping: 'They', value: 10.1, color: red },
  { grouping: 'Ze', value: 9.87, color: pink },
  { grouping: 'Other', value: 8.01, color: purple },
]

const deviceData = [
  { grouping: 'Mac', value: 35.1, color: yellow },
  { grouping: 'PC', value: 30.2, color: orange },
  { grouping: 'iPhone', value: 10.1, color: red },
  { grouping: 'Android', value: 9.87, color: pink },
  { grouping: 'Other', value: 8.01, color: purple },
]

const operatingSystemData = [
  { grouping: 'Mac OS', value: 35.1, color: yellow },
  { grouping: 'Windows', value: 30.2, color: orange },
  { grouping: 'iOS', value: 10.1, color: red },
  { grouping: 'Android', value: 9.87, color: pink },
  { grouping: 'Other', value: 8.01, color: purple },
]

const browserData = [
  { grouping: 'Chrome', value: 35.1, color: yellow },
  { grouping: 'Safari', value: 30.2, color: orange },
  { grouping: 'Firefox', value: 10.1, color: red },
  { grouping: 'Edge', value: 9.87, color: pink },
  { grouping: 'Other', value: 8.01, color: purple },
]

const searchData = [
  { grouping: 'mentor', value: 35.1, color: yellow },
  { grouping: 'mentee', value: 30.2, color: orange },
  { grouping: 'new york', value: 10.1, color: red },
  { grouping: 'canada', value: 9.87, color: pink },
  { grouping: 'Other', value: 8.01, color: purple },
]

const usaLocationData = [
  { name: 'New England', value: 16 },
  { name: 'Mid Atlantic', value: 12 },
  { name: 'The South', value: 16 },
  { name: 'Mid-West', value: 30 },
  { name: 'The Southwest', value: 7 },
  { name: 'The West', value: 19 },
]

const canadaLocationData = [
  { name: 'The Atlantic', value: 20 },
  { name: 'Central', value: 8 },
  { name: 'The Prairies', value: 21 },
  { name: 'West Coast', value: 49 },
  { name: 'Northern Territories', value: 2 },
]

const onlineData = [
  { name: 'online', value: 84 },
  { name: 'offline', value: 16 },
]

const lengthData = [
  { name: '60 minutes', value: 84 },
  { name: '30 minutes', value: 16 },
]

const locationViews = [
  { id: 'canada', label: 'Canada' },
  { id: 'usa', label: 'USA' },
]

const LocationStats = () => {
  const [view, setView] = useState('canada')

  return (
    <Panel className="col-span-2 relative">
      <Panel.Header heading="Location Stats" subheading="Decriptive Subtitle">
        <ToggleButtons
          options={locationViews}
          onValueChange={setView}
          value={view}
          className="absolute top-0 right-0 mt-4 mr-3"
        />
      </Panel.Header>
      <Panel.Body>
        <PiePlot
          className="h-64 w-full"
          data={view === 'canada' ? canadaLocationData : usaLocationData}
          colors={colors}
          value="value"
          name="name"
        />
      </Panel.Body>
    </Panel>
  )
}

gql`
  query dashboardMiscellaneousPage($groupId: ID!) {
    group: managedGroup(id: $groupId) {
      key
    }
  }
`

const Miscellaneous = () => {
  const { showModal } = useModal()
  const { currentGroup } = useCurrentGroup()
  const { formatMessage } = useIntl()

  return (
    <TypedQuery<DashboardMiscellaneousPageQueryVariables>
      typedQuery={useDashboardMiscellaneousPageQuery}
      skip={!currentGroup?.id}
      variables={{ groupId: currentGroup?.id as string }}
      passLoading
    >
      {({
        group,
        loading,
      }: TypedQueryReturn & DashboardMiscellaneousPageQuery) => {
        if (loading) {
          return null
        }

        if (!group || !group.key) {
          console.error('cannot find key for group')
          toast.error(formatMessage({ id: 'error.unknown' }))
          return null
        }

        return (
          <div className="space-y-8">
            <ReportingMenu
              loading={loading}
              openModal={() =>
                showModal({
                  content: <ReportDownloadModal groupKey={group.key} />,
                })
              }
            />
            <Row cols={4}>
              <LocationStats />
              <Panel>
                <Panel.Header heading="Age Range" />
                <Panel.Body>
                  <PercentageBars data={ageData} />
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Header heading="Preferred Pronoun" />
                <Panel.Body>
                  <PercentageBars data={pronounData} />
                </Panel.Body>
              </Panel>
            </Row>
            <Row cols={2}>
              <Panel>
                <Panel.Header heading="Online Activity" />
                <Panel.Body>
                  <PiePlot
                    className="h-64 w-full"
                    data={onlineData}
                    colors={colors}
                    value="value"
                    name="name"
                  />
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Header heading="Session Length" />
                <Panel.Body>
                  <PiePlot
                    className="h-64 w-full"
                    data={lengthData}
                    colors={colors}
                    value="value"
                    name="name"
                  />
                </Panel.Body>
              </Panel>
            </Row>
            <Row cols={4}>
              <Panel>
                <Panel.Header>Devices</Panel.Header>
                <Panel.Body>
                  <PercentageBars data={deviceData} />
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Header>Operating System</Panel.Header>
                <Panel.Body>
                  <PercentageBars data={operatingSystemData} />
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Header>Browser</Panel.Header>
                <Panel.Body>
                  <PercentageBars data={browserData} />
                </Panel.Body>
              </Panel>
              <Panel>
                <Panel.Header>Most Searched Terms</Panel.Header>
                <Panel.Body>
                  <PercentageBars data={searchData} />
                </Panel.Body>
              </Panel>
            </Row>
          </div>
        )
      }}
    </TypedQuery>
  )
}

Miscellaneous.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Miscellaneous)
export default Miscellaneous
