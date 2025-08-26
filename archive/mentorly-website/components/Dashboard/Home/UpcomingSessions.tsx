import { gql } from '@apollo/client'
import { ButtonLink } from 'components/Button'
import Calendar from 'components/Dashboard/Calendar'
import { Timeline } from 'components/Dashboard/Timeline'
import Avatar, { AvatarGroup } from 'components/display/Avatar'
import Panel from 'components/display/Panel'
import { format } from 'lib/date'
import Link from 'next/link'
import { FC, useState } from 'react'
import { Grid, List } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  GroupAvatarsFieldsFragmentDoc,
  UpcomingSessionsFieldsFragment,
} from 'types/graphql'

import User from './User'

gql`
  fragment UpcomingSessionsFields on Booking {
    id
    startTime
    endTime
    mentee {
      ...GroupAvatarsFields
    }
    mentor {
      ...GroupAvatarsFields
    }
  }
  ${GroupAvatarsFieldsFragmentDoc}
`

type UpcomingSessionsProps = {
  sessions: UpcomingSessionsFieldsFragment[]
  onClickList: () => void
  onClickCalendar: () => void
  calendarView: boolean
  loading: boolean
}

const UpcomingSessions: FC<UpcomingSessionsProps> = ({
  sessions,
  onClickList,
  onClickCalendar,
  calendarView,
  loading,
}) => {
  const { formatMessage, locale } = useIntl()
  const [date, setDate] = useState(new Date())
  return (
    <Panel>
      <Panel.Header>
        <div>{formatMessage({ id: 'section.upcomingSessions' })}</div>
        <UpcomingSessionMenu
          onClickCalendar={onClickCalendar}
          onClickList={onClickList}
          calendarView={calendarView}
        />
      </Panel.Header>

      <Panel.Body>
        {calendarView ? (
          <Calendar
            loading={loading}
            events={sessions}
            date={date}
            onDateChange={setDate}
            tooltip={TooltipText}
          />
        ) : (
          <Timeline events={sessions.slice(0, 4)} component={UpcomingEvent} />
        )}
      </Panel.Body>
      {sessions.length > 0 && (
        <Panel.Footer>
          <Link href={`/${locale}/dashboard/sessions`} passHref>
            <ButtonLink className="text-xs" testId="sessions-view-more-button">
              {formatMessage({ id: 'button.viewMore' })}
            </ButtonLink>
          </Link>
        </Panel.Footer>
      )}
    </Panel>
  )
}

type UpcomingSessionMenuProps = {
  onClickCalendar: () => void
  onClickList: () => void
  calendarView: boolean
}

const UpcomingSessionMenu: FC<UpcomingSessionMenuProps> = ({
  onClickCalendar,
  onClickList,
  calendarView,
}) => {
  const darkerGray = '#999999'
  const active = calendarView
  return (
    <div className="flex">
      <button className="mr-2 focus:outline-none" onClick={onClickList}>
        <List color={!active ? 'black' : darkerGray} />
      </button>
      <button className="mr-2 focus:outline-none" onClick={onClickCalendar}>
        <Grid color={active ? 'black' : darkerGray} />
      </button>
    </div>
  )
}

const UpcomingEvent = ({ event }: { event: any }) => {
  const groupSession = !event.mentee
  const { formatMessage } = useIntl()

  return (
    <>
      {groupSession ? (
        <div>
          <User user={event.mentor} />
          <span> {formatMessage({ id: 'event.isHoldingGroupSession' })}</span>
        </div>
      ) : (
        <div className="flex-grow mr-2">
          <User user={event.mentee} />
          <span>
            &nbsp;{formatMessage({ id: 'event.hasUpcomingSession' })}&nbsp;
          </span>
          <User user={event.mentor} />
        </div>
      )}
      <AvatarGroup>
        {event.mentee && <Avatar {...event.mentee.avatar} />}
        {event.mentor && <Avatar mentor {...event.mentor.avatar} />}
      </AvatarGroup>
    </>
  )
}

const TooltipText = ({ events }: { events: any }) => {
  const { formatMessage } = useIntl()
  return (
    <>
      {events.map((session: any) => {
        const time = format(session.startTime, 'HH:mm')
        const mentee =
          session.mentee?.name || formatMessage({ id: 'term.unknownMentee' })
        const mentor =
          session.mentor?.name || formatMessage({ id: 'term.unknownMentor' })
        const meet = `${mentor} > ${mentee}`
        const isGroup = !session.mentee?.name && !session.mentor?.name

        return (
          <div key={session.id}>
            {time} {isGroup ? formatMessage({ id: 'term.groupSession' }) : meet}
          </div>
        )
      })}
    </>
  )
}

export default UpcomingSessions
