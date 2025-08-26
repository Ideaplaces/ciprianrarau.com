import { gql } from '@apollo/client'
import Avatar from 'components/display/Avatar'
import { useCurrentGroup } from 'lib/GroupContext'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  AvatarFieldsFragmentDoc,
  ChatMemberFieldsFragment,
  useDashboardMembersQuery,
} from 'types/graphql'

// @TODO: use in parent component(s)
gql`
  fragment ChatMemberFields on ManagedUser {
    id
    avatar {
      ...AvatarFields
    }
    name
  }
  ${AvatarFieldsFragmentDoc}
`

type MembersProps = {
  searchQuery: string
}

export const Members: VFC<MembersProps> = ({ searchQuery }) => {
  const { locale } = useIntl()
  const { currentGroup } = useCurrentGroup()

  const { loading, error, data } = useDashboardMembersQuery({
    variables: {
      groupId: currentGroup.id,
      page: 1,
      query: searchQuery ? searchQuery : null,
    },
  })

  if (loading || error) {
    return null
  }

  const group = data?.group

  return (
    <>
      {group?.members.slice(0, 10).map((member: ChatMemberFieldsFragment) => (
        <Link
          key={member.id}
          href={`/${locale}/dashboard/messaging/${member.id}`}
        >
          <a className="flex px-4 py-2 w-full hover:bg-gray">
            <Avatar {...member.avatar} className="w-12 flex-0" />
            <div className="ml-4 flex-1 overflow-hidden">
              <div className="font-bold">{member.name}</div>
              <div className="flex text-sm text-darkerGray">
                <div className="truncate">text</div>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </>
  )
}

export default Members
