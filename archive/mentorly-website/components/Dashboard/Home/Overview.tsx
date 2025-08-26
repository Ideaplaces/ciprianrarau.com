import { gql } from '@apollo/client'
import { themeColors } from 'components/Dashboard/Reporting/constants'
import InfoBlock from 'components/display/InfoBlock'
import FormatDateTime from 'components/general/DateTime'
import Row from 'components/layout/Row'
import { isBefore } from 'date-fns'
import Link from 'next/link'
import { FC } from 'react'
import { Calendar, Clock, UserCheck, Users, UserX } from 'react-feather'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import { DashboardOverviewFieldsFragment, Maybe } from 'types/graphql'

gql`
  fragment DashboardOverviewFields on ManagedGroup {
    name
    startsAt
    endsAt
    globalStats
    autoMatching
    manualMatching
    plan {
      id
      userLimit
    }
    memberCount
  }
`

export type OverviewProps = {
  group?: Maybe<DashboardOverviewFieldsFragment>
  loading: boolean
}

type OverviewGlobalStatsType = {
  totalMentors: number
  activeMentors: number
  totalMentees: number
  activeMentees: number
}

const inactiveUsers = (globalStats: OverviewGlobalStatsType) => {
  const { totalMentors, activeMentors, totalMentees, activeMentees } =
    globalStats

  if (!totalMentors || !activeMentors || !totalMentees || !activeMentees) {
    return null
  }

  return totalMentors - activeMentors + (totalMentees - activeMentees)
}

const Overview: FC<OverviewProps> = ({ group, loading }) => {
  const { formatMessage, locale } = useIntl()

  return (
    <>
      <div className="border border-darkGray rounded p-2 mb-4">
        <div className="text-xs text-darkerGray">
          {loading ? (
            <Skeleton width={100} />
          ) : (
            formatMessage({ id: 'term.name' })
          )}
        </div>
        <div data-testid="group-name" className="font-black">
          {loading ? <Skeleton width={200} /> : group?.name}
        </div>
      </div>
      {loading ? (
        <Skeleton
          count={2}
          height={50}
          containerClassName="flex w-full space-x-3"
          className="w-1/2 rounded p-2 mb-4"
        />
      ) : (
        <div className="flex">
          {!isBefore(new Date(group?.startsAt), new Date(2010, 1, 1)) && (
            <div className="w-1/2 border border-darkGray rounded p-2 mb-4 mr-3">
              <div className="text-xs text-darkerGray">Start Date</div>
              <div className="font-black">
                <FormatDateTime
                  date={new Date(group?.startsAt)}
                  format="date.fullDateTime"
                />
              </div>
            </div>
          )}
          {!isBefore(new Date(group?.endsAt), new Date(2010, 1, 1)) && (
            <div className="w-1/2 border border-darkGray rounded p-2 mb-4">
              <div className="text-xs text-darkerGray">End Date</div>
              <div className="font-black">
                <FormatDateTime
                  date={new Date(group?.endsAt)}
                  format="date.fullDateTime"
                />
              </div>
            </div>
          )}
        </div>
      )}
      {loading ? (
        <Row gap={3} cols={3} className="grid-cols-2">
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={50} />
          <Skeleton height={50} />
        </Row>
      ) : group?.globalStats ? (
        <Row gap={3} cols={3} className="grid-cols-2">
          <Link href={`/${locale}/dashboard/members?page=1`}>
            <a className="hover:opacity-75" data-testid={'members-info-block'}>
              <InfoBlock
                title={`${formatMessage({ id: 'term.mentees' })} |
                  ${formatMessage({ id: 'menu.mentors' })}`}
                value={`${group.globalStats.totalMentees} | ${group.globalStats.totalMentors}`}
                backgroundColor={themeColors.green.light}
                icon={Users}
                iconColor={themeColors.green.base}
                textColor="text-black"
              />
            </a>
          </Link>
          {(group.autoMatching || group.manualMatching) && (
            <Link href={`/${locale}/dashboard/matching`}>
              <a
                className="hover:opacity-75"
                data-testid={'matches-info-block'}
              >
                <InfoBlock
                  title={formatMessage({ id: 'term.matches' })}
                  value={group.globalStats.totalMatches}
                  backgroundColor={themeColors.blue.light}
                  icon={UserCheck}
                  iconColor={themeColors.blue.base}
                  textColor="text-black"
                />
              </a>
            </Link>
          )}

          <Link href={`/${locale}/dashboard/sessions`}>
            <a className="hover:opacity-75" data-testid={'sessions-info-block'}>
              <InfoBlock
                title={formatMessage({ id: 'term.sessions' })}
                value={group.globalStats.totalSessions}
                backgroundColor={themeColors.orange.light}
                icon={Calendar}
                iconColor={themeColors.orange.base}
                textColor="text-black"
              />
            </a>
          </Link>
          <Link href={`/${locale}/dashboard/reporting`}>
            <a
              className="hover:opacity-75"
              data-testid={'total-hours-info-block'}
            >
              <InfoBlock
                title={formatMessage({ id: 'term.totalHours' })}
                value={group.globalStats.hours}
                backgroundColor={themeColors.teal.light}
                icon={Clock}
                iconColor={themeColors.teal.base}
                textColor="text-black"
              />
            </a>
          </Link>
          <Link href={`/${locale}/dashboard/reporting`}>
            <a
              className="hover:opacity-75"
              data-testid={'inactive-users-info-block'}
            >
              <InfoBlock
                title={formatMessage({ id: 'term.inactiveUsers' })}
                value={inactiveUsers(group.globalStats)}
                backgroundColor={themeColors.red.light}
                icon={UserX}
                iconColor={themeColors.red.base}
                textColor="text-black"
              />
            </a>
          </Link>
          <Link href={`/${locale}/dashboard/members`}>
            <a className="hover:opacity-75" data-testid={'users-info-block'}>
              <InfoBlock
                title={
                  group.plan?.userLimit
                    ? formatMessage({ id: 'term.usersPlanLimit' })
                    : formatMessage({ id: 'term.users' })
                }
                value={
                  group.plan?.userLimit
                    ? `${group.memberCount} / ${group.plan?.userLimit}`
                    : `${group.memberCount}`
                }
                backgroundColor={themeColors.purple.light}
                icon={Users}
                iconColor={themeColors.purple.base}
                textColor="text-black"
              />
            </a>
          </Link>
        </Row>
      ) : null}
    </>
  )
}

export default Overview
