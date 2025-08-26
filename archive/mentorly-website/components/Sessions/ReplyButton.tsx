import { gql } from '@apollo/client'
import { ButtonLink } from 'components/Button'
import ConditionalWrapper from 'components/ConditionalWrapper'
import MessageUser from 'components/pages/User/MessageUser'
import { firstName } from 'lib/firstName'
import { useCurrentUser } from 'lib/UserContext'
import Link from 'next/link'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { ReplyButtonFieldsFragment } from 'types/graphql'

gql`
  fragment ReplyButtonFields on Booking {
    id
    sessionType
    isParticipating
    participants {
      id
      name
    }
    hosts {
      id
      name
    }
    conversation {
      id
      sender {
        id
        name
      }
    }
  }
`

type ReplyButtonProps = {
  booking: ReplyButtonFieldsFragment
  slim?: boolean
}

const ReplyButton: FC<ReplyButtonProps> = ({ booking, slim }) => {
  const { locale, formatMessage } = useIntl()
  const { currentUser } = useCurrentUser()
  const { conversation, sessionType, hosts, isParticipating } = booking
  if (
    (sessionType !== 'individual_session' &&
      currentUser?.id === hosts[0]?.id) ||
    !isParticipating
  ) {
    return null
  }

  const formatButtonText = () => {
    if (sessionType === 'masterclass') {
      // For masterclasses that any user can join,
      // the reply is only sent to the host.
      return 'messageHost'
    }
    if (sessionType === 'group_session') {
      return 'joinDiscussion'
    }
    if (sessionType === 'individual_session') {
      return 'messageUser'
    } else {
      return 'message'
    }
  }

  const individualRecipient = () => {
    const recipient = booking?.participants.filter(
      (user) => user?.id !== currentUser?.id
    )
    return recipient[0]
  }

  return (
    <>
      <ConditionalWrapper
        wrapper={(children: any) =>
          sessionType === 'masterclass' ? (
            <MessageUser userId={hosts[0]?.id}>{children}</MessageUser>
          ) : (
            <Link href={`/${locale}/personal/messaging/${conversation?.id}`}>
              {children}
            </Link>
          )
        }
        condition
      >
        <ButtonLink slim={slim} variant="secondary">
          {formatMessage(
            { id: `button.${formatButtonText()}` },
            {
              user:
                sessionType === 'individual_session' &&
                firstName(individualRecipient()?.name),
            }
          )}
        </ButtonLink>
      </ConditionalWrapper>

      {sessionType === 'masterclass' && (
        <Link href={`/${locale}/personal/messaging/${conversation?.id}`}>
          <ButtonLink slim={slim} variant="secondary">
            {formatMessage({ id: `button.joinDiscussion` })}
          </ButtonLink>
        </Link>
      )}
    </>
  )
}

export default ReplyButton
