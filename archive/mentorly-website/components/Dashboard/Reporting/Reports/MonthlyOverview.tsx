import { gql } from '@apollo/client'
import ToggleButtons from 'components/controls/ToggleButtons'
import { toggleViews, yellow } from 'components/Dashboard/Reporting/constants'
import LinePlot from 'components/Dashboard/Reporting/Plots/LinePlot'
import Panel from 'components/display/Panel'
import Link from 'next/link'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import { ManagedGroup } from 'types/graphql'

gql`
  fragment MonthlyOverviewFields on ManagedGroup {
    monthlyStats: fieldStats(field: "month", signups: true)
  }
`

type MonthlyOverviewProps = {
  monthlyStats: ManagedGroup['monthlyStats']
  loading: boolean
}

const MonthlyOverview: FC<MonthlyOverviewProps> = ({
  monthlyStats,
  loading,
}) => {
  const [view, setView] = useState('sessions')
  const { formatMessage, locale } = useIntl()
  const [yearToDate, setYearToDate] = useState(false)

  const onClickYearToDateView = () => {
    setYearToDate(!yearToDate)
  }

  return (
    <div className="relative">
      <Panel>
        <Panel.Header>
          {formatMessage({ id: 'stat.monthlyOverview' })}
          <ToggleButtons
            options={toggleViews}
            onValueChange={setView}
            value={view}
          />
        </Panel.Header>
        <Panel.Body className="relative">
          <button
            className={`absolute z-10 top-0 right-0 py-1 px-2 mt-4 mr-8 focus:outline-none border rounded text-sm ${
              yearToDate && 'bg-gray font-black'
            }`}
            onClick={onClickYearToDateView}
          >
            YTD
          </button>
          {loading ? (
            <Skeleton count={4} height={55} />
          ) : (
            <Link href={`/${locale}/dashboard/reporting/activity`}>
              <a>
                <LinePlot
                  className="w-full h-64 my-0 mx-auto"
                  data={monthlyStats}
                  xAxis="grouping"
                  yAxis={view}
                  color={yellow}
                  customXAxis
                  withLink
                  yearToDate={yearToDate}
                />
              </a>
            </Link>
          )}
        </Panel.Body>
      </Panel>
    </div>
  )
}

MonthlyOverview.propTypes = {}

MonthlyOverview.defaultProps = {}

export default MonthlyOverview
