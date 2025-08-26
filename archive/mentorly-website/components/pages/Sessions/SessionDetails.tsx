import { gql } from '@apollo/client'
import classNames from 'classnames'
import CopyToClipboard from 'components/CopyToClipboard/CopyToClipboard'
import DateTime from 'components/Sessions/DateTime'
import JoinButton from 'components/Sessions/JoinButton'
import { useCurrentGroup } from 'lib/GroupContext'
import { sessionUrl } from 'lib/urls'
import { camelCase } from 'lodash'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import {
  CalendarLinksFieldsFragmentDoc,
  DateTimeFieldsFragmentDoc,
  JoinButtonFieldsFragmentDoc,
} from 'types/graphql'

import styles from './session.module.scss'

gql`
  fragment SessionDetailsFields on Booking {
    id
    sessionType
    description(format: "html")
    title
    group {
      customDomain
      slug
    }
    isParticipating
    endTime
    startTime
    calendarLinks {
      ...CalendarLinksFields
    }
    ...JoinButtonFields
    ...DateTimeFields
  }
  ${CalendarLinksFieldsFragmentDoc}
  ${JoinButtonFieldsFragmentDoc}
  ${DateTimeFieldsFragmentDoc}
`

type SessionDetailsProps = {
  session: any
}

const SessionDetails: FC<SessionDetailsProps> = ({ session }) => {
  const { currentGroup } = useCurrentGroup()
  const { formatMessage, locale } = useIntl()
  const { title, mentor, description, sessionType } = session

  const textColor = currentGroup?.styles?.backgroundTextColor || '#111'
  // @TODO: enable user to sign-in and join
  return (
    <div
      id="header"
      style={currentGroup ? { color: textColor } : undefined}
      className={classNames(
        'w-full items-end justify-center relative mb-4 flex flex-col space-x-12',
        'sm:flex-row md:flex-col md:space-x-0',
        styles.sessionHeader
      )}
    >
      <div className="w-full sm:w-1/2 md:w-full">
        <h2 className="text-xl">
          {formatMessage({ id: 'session.joinMentor' }, { name: mentor?.name })}
        </h2>
        <h1 className="text-5xl font-black leading-tight my-2">
          {title || formatMessage({ id: `term.${camelCase(sessionType)}` })}
        </h1>
        <div
          className="w-7/12 sm:w-auto mb-6 rich-text"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
      <div className="w-full sm:w-1/2 md:w-full">
        <DateTime booking={session} hideAddToCal />
        <div className="inline-block mb-6">
          <CopyToClipboard string={sessionUrl(session, locale, currentGroup)}>
            <p>{formatMessage({ id: 'tooltip.copyLink' })}</p>
          </CopyToClipboard>
        </div>
        <JoinButton
          booking={session}
          showAttending
          showDisabled
          showTooltip
          inverted
        />
      </div>
    </div>
  )
}

export default SessionDetails
