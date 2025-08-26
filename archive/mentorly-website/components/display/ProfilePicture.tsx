import classNames from 'classnames'
import MentorBadge from 'components/display/MentorBadge'
import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import { SyntheticEvent, VFC } from 'react'
import { Maybe, ProfilePictureFieldsFragment } from 'types/graphql'

import User from './UserIcon'

gql`
  fragment ProfilePictureFields on User {
    id
    name
    mentor
    profileImageUrl(height: 500, width: 500)
  }
`

type ProfilePictureProps = {
  user: ProfilePictureFieldsFragment
  className?: string
  asAvatar?: boolean
  hideBadge?: boolean
}

const ProfilePicture: VFC<ProfilePictureProps> = ({
  user,
  className = undefined,
  asAvatar,
  hideBadge,
}) => {
  const { currentGroup } = useCurrentGroup()

  const defaultImage = () => {
    const defaultImage = currentGroup.files.find(
      (f: { type?: Maybe<string> }) => f.type === 'defaultProfileImage'
    )

    if (defaultImage && defaultImage.fileUrl) {
      return defaultImage.fileUrl
    } else {
      return '//s3.amazonaws.com/co.mentorly.prod/defaults/user/default-placeholder-300x300.png'
    }
  }

  return (
    <div
      data-testid="profile-picture"
      className={classNames('relative', className)}
    >
      <div
        className={classNames(
          'relative pb-full',
          asAvatar &&
            `bg-white overflow-hidden rounded-full shadow-sm border-4 border-${
              user.mentor && !hideBadge ? 'yellow' : 'gray'
            }`
        )}
      >
        {user.profileImageUrl ? (
          <img
            alt={user.name}
            src={user.profileImageUrl || undefined}
            className="absolute h-full w-full object-cover"
            onError={(e: SyntheticEvent<HTMLImageElement>) => {
              const target = e.target as HTMLImageElement
              target.onerror = null
              target.src = defaultImage()
            }}
          />
        ) : (
          <User className="absolute aspect-square h-full w-full fill-current text-accentColor bg-backgroundColor" />
        )}
      </div>
      {user.mentor && asAvatar && !hideBadge && (
        <MentorBadge className="absolute right-0 bottom-0 w-1/6 h-1/6 mx-1/12" />
      )}
    </div>
  )
}

export default ProfilePicture
