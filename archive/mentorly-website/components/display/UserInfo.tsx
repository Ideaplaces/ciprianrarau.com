import { gql } from '@apollo/client'
import { profileUrl } from 'lib/urls'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  AvatarFieldsFragmentDoc,
  ManagedUserInfoFieldsFragment,
  Maybe,
  UserInfoFieldsFragment,
} from 'types/graphql'

import Avatar from './Avatar'

gql`
  fragment UserInfoFields on User {
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
  fragment ManagedUserInfoFields on ManagedUser {
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
  ${AvatarFieldsFragmentDoc}
`

type UserInfoProps = {
  group?: any
  user?: Maybe<UserInfoFieldsFragment | ManagedUserInfoFieldsFragment>
  tab?: string
}

const UserInfo: VFC<UserInfoProps> = ({ group, user, tab }) => {
  const { locale } = useIntl()

  if (!user) {
    return null
  }

  const tabQuery = tab ? `?tab=${tab}` : ''

  const href = group
    ? `/${locale}/dashboard/members/${user.id}${tabQuery}`
    : profileUrl(user, locale)

  return (
    <Link href={href}>
      <a className="inline-flex items-center">
        <Avatar className="mr-2" {...user.avatar} mentor={user.mentor} />
        <div className="font-bold mr-2">{user.name}</div>
      </a>
    </Link>
  )
}

export default UserInfo
