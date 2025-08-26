import Button from 'components/Button/Button'
import HorizontalScroller from 'components/display/HorizontalScroller'
import Tooltip from 'components/display/Tooltip'
import { useCurrentGroup } from 'lib/GroupContext'
import { FC } from 'react'
import { useIntl } from 'react-intl'

import { useBooking } from '../BookingContext'

const SessionPanel: FC = () => {
  const { currentGroup } = useCurrentGroup()
  const { member } = useBooking()
  const { formatMessage, locale } = useIntl()

  return (
    <div
      className="md:w-5/12 md:mr-10"
      title={formatMessage({ id: 'header.chooseSession' })}
    >
      <h2 className="font-black text-xl mb-4">
        {formatMessage({ id: 'header.chooseSession' })}
      </h2>
      <div>
        <HorizontalScroller>
          <div className="flex md:flex-col">
            <SessionType type="individuale" member={member} />
            {currentGroup?.allowGroupSessions && (
              <SessionType type="Group" member={member} />
            )}
          </div>
        </HorizontalScroller>
        {currentGroup?.marketplace && (
          <div className="flex md:my-4 items-center flex-wrap">
            <div className="flex">
              <span className="font-bold mr-1">
                {formatMessage({ id: 'term.cancellationPolicy' })}:
              </span>
              {member.cancellationPolicy && (
                <Tooltip
                  text={formatMessage({
                    id: `cancellationPolicy.${member.cancellationPolicy}`,
                  })}
                  link={{
                    href: `https://help.mentorly.co/${locale}/articles/5297666-browsing-and-booking-with-mentors`,
                    label: formatMessage({ id: 'button.learnMore' }),
                  }}
                >
                  <div className="ml-1 flex items-center transition-none justify-center h-5 w-5 bg-darkerGray text-white rounded-full cursor-default user-select-none">
                    ?
                  </div>
                </Tooltip>
              )}
            </div>

            <span className="mr-1">
              {formatMessage({
                id: member.cancellationPolicy
                  ? `term.${member.cancellationPolicy}`
                  : 'text.noCancellationPolicy',
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

type SessionTypeProps = {
  type: string
  member: any
}

const SessionType: FC<SessionTypeProps> = ({ type, member }) => {
  const { formatMessage } = useIntl()
  return (
    <div className="mb-4 mr-2">
      <div className="mb-2 font-bold">
        {formatMessage({ id: `term.${type.toLowerCase()}` })}
      </div>
      <div className="flex flex-row md:flex-col space-x-2 md:space-y-2 md:space-x-0">
        {member.sessionLengths.map((len: number) => (
          <SessionButton key={len} len={len} type={type} />
        ))}
      </div>
    </div>
  )
}

type SessionButtonProps = {
  len: number
  type: string
}

const SessionButton: FC<SessionButtonProps> = ({ len, type }) => {
  const { member, selectedSession, chooseSession } = useBooking()
  const { currentGroup } = useCurrentGroup()
  const { formatMessage } = useIntl()

  const price = member.rates ? member.rates[len] / 100 : 0
  const label = `${len} mins`

  const selected = selectedSession === type + len

  return (
    <Button
      variant={selected ? 'selected' : 'secondary'}
      weight={selected ? 'font-black' : 'font-bold'}
      onClick={() => chooseSession({ type, len, price })}
      square
      full
      className="whitespace-nowrap"
    >
      {label}{' '}
      {currentGroup?.marketplace &&
        ' - ' +
          formatMessage(
            { id: 'price.withCurrency' },
            { currency: 'US', price }
          )}
    </Button>
  )
}

export default SessionPanel
