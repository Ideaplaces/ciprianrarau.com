import { gql } from '@apollo/client'
import classNames from 'classnames'
import Avatar from 'components/display/Avatar'
import GroupAvatars from 'components/display/GroupAvatars'
import { useMatches } from 'lib/MatchesContext'
import { getOtherUser } from 'lib/matching'
import { VFC } from 'react'
import { MinusCircle } from 'react-feather'
import {
  AddMatchFieldsFragmentDoc,
  ManagedGroupAvatarsFieldsFragmentDoc,
  Maybe,
  MentorMatchesFieldsFragment,
  MentorMatchesMatchFieldsFragment,
  User,
} from 'types/graphql'

import AddMatch from './AddMatch'

gql`
  fragment MentorMatchesFields on ManagedUser {
    id
    ...AddMatchFields
    allMatches(active: true, orderBy: $orderMatchesBy) {
      ...MentorMatchesMatchFields
    }
  }
  fragment MentorMatchesMatchFields on MentorMatch {
    id
    mentor {
      name
      ...ManagedGroupAvatarsFields
    }
    mentee {
      name
      ...ManagedGroupAvatarsFields
    }
    status
  }
  ${AddMatchFieldsFragmentDoc}
  ${ManagedGroupAvatarsFieldsFragmentDoc}
`

export type MemberMatchesProps = {
  member: MentorMatchesFieldsFragment
  match?: Maybe<MentorMatchesMatchFieldsFragment>
  index?: number
  expanded?: boolean
}

const showRemove = (match: MentorMatchesMatchFieldsFragment) => {
  return match.status == 'ACTIVATED' || match.status == 'STAGED'
}

type SingleMatchProps = {
  member: MentorMatchesFieldsFragment
  match: MentorMatchesMatchFieldsFragment
}

const SingleMatch = ({ member, match }: SingleMatchProps) => {
  const { handleRemove, toRemoveIds } = useMatches()

  const matchedUser = getOtherUser(member, match)

  return (
    <div className="flex items-center justify-between p-1 lg:p-2 relative w-full">
      <div className="flex items-center w-full">
        <Avatar
          {...matchedUser?.avatar}
          mentor={matchedUser?.mentor}
          className="z-10 min-w-12 min-h-12"
          status={match.status}
        />
        <div className="ml-3 w-full ">
          <div className="font-bold text-sm lg:text-base truncate">
            {matchedUser?.name}
          </div>
        </div>
      </div>
      <div
        className={classNames('flex hover:opacity-75 rounded-full bg-white', {
          'text-red': toRemoveIds.includes(match.id),
          'text-darkGray': !toRemoveIds.includes(match.id),
        })}
      >
        {showRemove(match) && (
          <MinusCircle
            onClick={(e) => {
              e.stopPropagation()
              handleRemove(match.id)
            }}
            className="cursor-pointer transition duration-100"
          />
        )}
      </div>
    </div>
  )
}

const MemberMatches: VFC<MemberMatchesProps> = ({
  member,
  match,
  index,
  expanded,
}) => {
  const { handleRemove, toRemoveIds } = useMatches()

  if (match) {
    return <SingleMatch member={member} match={match} />
  }

  const matches = member.allMatches
    .map((match) => getOtherUser(member, match))
    .filter(Boolean)

  const statuses = member.allMatches
    .map((match) => match.status)
    .filter(Boolean)

  if (index === matches.length || matches.length === 0) {
    return <AddMatch member={member} expanded={expanded} />
  }

  const matchIds = member.allMatches.map((match) => match.id)
  const removeCount = matchIds.filter((id) => toRemoveIds.includes(id)).length

  const removableMatches = member.allMatches.filter((match) =>
    showRemove(match)
  )

  return (
    <div className="flex w-full items-center justify-between pr-2">
      <div className="flex items-center justify-between pl-1 lg:px-2 relative">
        <div className="z-20 flex justify-start">
          <GroupAvatars
            users={matches as User[]}
            statuses={statuses}
            memberCount={matches.length}
            inline
            limit={1}
            size="md"
            showBadge
          />
        </div>
        <AddMatch member={member} />
      </div>
      {removableMatches.length > 0 && (
        <div
          className={classNames(
            'cursor-pointer transition duration-100 flex hover:opacity-75',
            {
              'text-red': toRemoveIds.find((id) => matchIds.includes(id)),
              'text-darkGray': !toRemoveIds.find((id) => matchIds.includes(id)),
            }
          )}
          onClick={(e) => {
            e.stopPropagation()
            handleRemove(member)
          }}
        >
          <div className={'flex rounded-full bg-white space-x-1'}>
            {removeCount > 1 && <div>({removeCount})</div>}
            <MinusCircle />
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberMatches
