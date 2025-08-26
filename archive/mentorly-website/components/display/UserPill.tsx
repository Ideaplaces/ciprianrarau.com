import { gql } from '@apollo/client'
import Avatar from 'components/display/Avatar'
import IconPill from 'components/display/IconPill'
import { profileUrl } from 'lib/urls'
import { useCurrentUser } from 'lib/UserContext'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import {
  AvatarFieldsFragmentDoc,
  ManagedUserPillFieldsFragment,
  UserPillFieldsFragment,
} from 'types/graphql'

gql`
  fragment UserPillFields on User {
    name
    avatar {
      ...AvatarFields
    }
    mentor
    slug
    id
    group {
      slug
    }
  }
  fragment ManagedUserPillFields on ManagedUser {
    name
    avatar {
      ...AvatarFields
    }
    mentor
    slug
    id
    group {
      slug
    }
  }
  ${AvatarFieldsFragmentDoc}
`

export type UserPillProps = {
  user: UserPillFieldsFragment | ManagedUserPillFieldsFragment
  className?: string
  onRemove?: (props?: any) => void
}
const UserPill: FC<UserPillProps> = ({ user, className, onRemove }) => {
  const { locale, formatMessage } = useIntl()
  const { currentUser } = useCurrentUser()

  const url = profileUrl(user, locale)

  const handleClick = () => window.open(url, '_blank')

  const avatar = (
    <Avatar
      color={user.avatar.color}
      initials={user.avatar.initials}
      size="xs"
      imageUrl={user.avatar.imageUrl}
      mentor={user.mentor}
    />
  )

  const text = (
    <span className="opacity-75 group-hover:opacity-100">
      {user.name}
      {currentUser && currentUser.id === user.id && (
        <span className="font-bold ml-2">
          ({formatMessage({ id: 'term.you' })})
        </span>
      )}
    </span>
  )

  return (
    <IconPill
      customIcon={avatar}
      text={text}
      onClick={handleClick}
      onRemove={onRemove ? () => onRemove(user) : undefined}
      className={className}
    />
  )
}

export default UserPill
