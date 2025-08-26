import { gql } from '@apollo/client'
import classNames from 'classnames'
import Avatar from 'components/display/Avatar'
import { profileUrl } from 'lib/urls'
import Link from 'next/link'
import { FC } from 'react'
import { MinusCircle } from 'react-feather'
import { useIntl } from 'react-intl'
import { ParticipantFieldsFragment, User } from 'types/graphql'

gql`
  fragment ParticipantFields on User {
    id
    name
    mentor
    slug
    group {
      slug
    }
    avatar {
      ...AvatarFields
    }
  }
`

type ParticipantProps = {
  participant: ParticipantFieldsFragment
  isViewer?: boolean
  isHost?: boolean
  locale: string
  onRemove?: (user: Pick<User, 'id'>) => void
}

const Participant: FC<ParticipantProps> = ({
  participant,
  isViewer,
  isHost,
  locale,
  onRemove,
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="px-0 flex items-center justify-between hover:bg-gray">
      <Link href={profileUrl(participant, locale)}>
        <a target="_blank">
          <Avatar
            color={participant.avatar.color}
            initials={participant.avatar.initials}
            imageUrl={participant.avatar.imageUrl}
            className="my-2"
          />
        </a>
      </Link>
      <div className="flex-grow px-4">
        <span className={classNames({ 'font-black': isHost })}>
          {participant.name}
        </span>{' '}
        {isHost && `(${formatMessage({ id: 'term.mentor' })})`}{' '}
        {!isHost && isViewer && '(you)'}
      </div>
      {onRemove && (
        <button onClick={() => onRemove(participant)} className="mr-5">
          <MinusCircle color="red" />
        </button>
      )}
    </div>
  )
}

export default Participant
