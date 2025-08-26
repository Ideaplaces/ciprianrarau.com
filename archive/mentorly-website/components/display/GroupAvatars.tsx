import { gql } from '@apollo/client'
import classNames from 'classnames'
import { profileUrl } from 'lib/urls'
import { compact, uniqBy } from 'lodash'
import Link from 'next/link'
import { FC } from 'react'
import { Tag, User as UserIcon, Users } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  Avatar as AvatarType,
  AvatarFieldsFragmentDoc,
  GroupAvatarsFieldsFragment,
  Maybe,
  User,
} from 'types/graphql'

import Avatar, { SizeKey, SIZES } from './Avatar'

const sizes = ['xs', 's', 'sm', 'md', 'ml', 'lg', 'xl'] as SizeKey[]

gql`
  fragment GroupAvatarsFields on User {
    id
    mentor
    name
    avatar {
      ...AvatarFields
    }
  }
  fragment ManagedGroupAvatarsFields on ManagedUser {
    id
    mentor
    name
    avatar {
      ...AvatarFields
    }
  }
  ${AvatarFieldsFragmentDoc}
`

const getNextSize = (size: SizeKey): SizeKey => {
  const sizeIndex = sizes.indexOf(size)
  return sizes[sizeIndex + 3]
}

export type GroupAvatarsProps = {
  users?: Maybe<GroupAvatarsFieldsFragment | undefined>[]
  className?: string
  size?: SizeKey
  limit?: number
  memberCount?: number
  showBadge?: boolean
  inline?: boolean
  click?: (props?: any) => void
  filtering?: boolean
  statuses?: string[]
}
// description of logic for titles and avatars here:
// https://docs.google.com/spreadsheets/d/1kTaqZRc-vlxOzVxLUMhuw94qe0S_ccaeY1RGJqDopfk
const GroupAvatars: FC<GroupAvatarsProps> = ({
  users,
  className,
  size = 's',
  limit,
  memberCount,
  showBadge,
  inline,
  statuses = [],
  ...props
}) => {
  // @TODO: uniqBy used because backend was doubling hosts and others
  // this could be removed once that issue is resolved
  // New pb: Guests don't always include everyone, so using participants for now
  const members = (uniqBy(compact(users), 'id') || []) as [User]

  // if (members.length === 0) return null //return unknown user in this case

  const singleSize = inline ? size : getNextSize(size)

  const showSingle = members.length < 2 || limit === 0

  const count = memberCount || members.length

  return (
    <div
      className={classNames(
        'flex flex-col items-start cursor-pointer',
        className
      )}
    >
      {showSingle ? (
        <SingleAvatar
          user={members[0]}
          status={statuses[0]}
          count={members.length === 1 ? 1 : count}
          size={singleSize}
          showBadge={showBadge}
          {...props}
        />
      ) : (
        <MultipleAvatars
          inline={inline}
          users={members}
          size={size}
          count={count}
          showBadge={showBadge}
          limit={limit}
          statuses={statuses}
          {...props}
        />
      )}
    </div>
  )
}

type SingleAvatarProps = {
  user: User
  size: SizeKey
  count: number
  click?: (props?: any) => void
  filtering?: boolean
  showBadge?: boolean
  extraAvatars?: number
  status?: string
}

export const SingleAvatar: FC<SingleAvatarProps> = ({
  user,
  size,
  count,
  click,
  filtering,
  showBadge,
  status,
}) => {
  const { locale } = useIntl()

  if (!user) {
    return (
      <div
        className={classNames(
          'relative rounded-full p-1 bg-yellow flex flex-col items-center justify-center pb-3 mx-auto',
          SIZES[size]
        )}
      >
        <UserIcon size={15} />
        <p className="absolute text-xs bottom-1">&#8230;</p>
      </div>
    )
  }

  if (count >= 2 || filtering) {
    return (
      <div
        className={classNames(
          'relative rounded-full p-1 bg-yellow flex flex-col items-center justify-center pb-3 mx-auto',
          SIZES[size]
        )}
        onClick={() => click && click('viewParticipants')}
      >
        {filtering ? <Tag size={15} /> : <Users size={15} />}
        <p className="absolute text-xxs bottom-1 ">{count}</p>
      </div>
    )
  }

  return (
    <Link href={profileUrl(user, locale)}>
      <a target="_blank">
        <div className="rounded-full shadow-md">
          <Avatar
            color={user.avatar.color}
            initials={user.avatar.initials}
            className="select-none"
            size={size}
            imageUrl={user.avatar.imageUrl}
            mentor={showBadge && user.mentor}
            status={status}
          />
        </div>
      </a>
    </Link>
  )
}

type MultipleAvatarsProps = {
  users: User[]
  click?: (props?: any) => void
  inline?: boolean
  showBadge?: boolean
  limit?: number
  size: SizeKey
  count: number
  statuses: string[]
}

const MultipleAvatars: FC<MultipleAvatarsProps> = ({
  users,
  click,
  inline,
  showBadge,
  limit = 3,
  size,
  count,
  statuses,
}) => {
  if (limit === 0) return null

  const avatars = compact(users.map((p) => p.avatar))
  const nextSize = getNextSize(size)
  const length = inline ? limit : 3
  const overlap = `-mr-3`
  const container = inline ? `flex flex-row-reverse` : `mt-1`
  const otherAvatars = [
    'absolute -right-1/5 -top-1/8', // top
    'absolute -right-2/5 top-1/4', // middle
    'absolute -right-1/5 -bottom-1/8', // bottom
  ]

  if (avatars.length === 0) return null

  const [first, ...others] = avatars

  const rest = others.slice(0, length)

  return (
    <div
      className={classNames('relative my-auto', container)}
      onClick={() => {
        click && click('viewParticipants')
      }}
    >
      {rest
        .map((guestAvatar, i) => (
          <div
            key={i}
            className={classNames(
              `shadow-md rounded-full z-0`,
              inline ? overlap : otherAvatars[i]
            )}
          >
            {i === rest.length - 1 ? (
              <LastAvatar
                rest={rest}
                length={length}
                size={size}
                count={count}
              />
            ) : (
              <Avatar
                className="select-none"
                status={statuses && statuses[i]}
                size={size}
                {...guestAvatar}
              />
            )}
          </div>
        ))
        .reverse()}

      <div
        className={classNames(
          'shadow-md rounded-full flex flex-row-reverse',
          inline && overlap
        )}
      >
        <Avatar
          className="select-none border-yellow z-10"
          size={inline ? size : nextSize}
          mentor={showBadge && users[0].mentor}
          status={statuses && statuses[0]}
          {...first}
        />
      </div>
    </div>
  )
}

type LastAvatarProps = {
  rest: AvatarType[]
  count: number
  length: number
  size: SizeKey
}

const LastAvatar: FC<LastAvatarProps> = ({ rest, count, length, size }) => {
  if (rest.length === count - 1) {
    return (
      <Avatar className="select-none" size={size} {...rest[rest.length - 1]} />
    )
  } else if (length < count) {
    return (
      <div
        className={classNames(
          SIZES[size],
          'bg-yellow rounded-full flex items-center justify-center pl-1',
          rest.length > 99 && '!text-xxs'
        )}
      >
        +{count - length}
      </div>
    )
  } else {
    return null
  }
}

export default GroupAvatars
