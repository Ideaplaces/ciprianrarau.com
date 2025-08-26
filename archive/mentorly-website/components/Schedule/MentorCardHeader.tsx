import { gql } from '@apollo/client'
import classNames from 'classnames'
import { useCurrentGroup } from 'lib/GroupContext'
import { has } from 'lodash'
import { FC } from 'react'
import { User as UserIcon, X } from 'react-feather'
import {
  ManagedGroupAvatarsFieldsFragmentDoc,
  MentorCardHeaderFieldsFragment,
} from 'types/graphql'

import Avatar from '../display/Avatar'

gql`
  fragment MentorCardHeaderFields on ManagedUser {
    name
    discipline {
      name
    }
    ...ManagedGroupAvatarsFields
  }
  ${ManagedGroupAvatarsFieldsFragmentDoc}
`

type MentorCardHeaderProps = {
  mentor: MentorCardHeaderFieldsFragment
  open?: boolean
  setOpen: (open: boolean) => void
}
const MentorCardHeader: FC<MentorCardHeaderProps> = ({
  mentor: { name, avatar, discipline },
  open,
  setOpen,
}) => {
  const { currentGroup } = useCurrentGroup()

  const accentColor = currentGroup?.styles?.accentColor || 'black'
  const disciplineStyles = { color: 'black', border: `2px solid darkGray` }

  return (
    <div className="flex cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="w-18 pt-2 pr-4">
        <Avatar
          size="md"
          initials={avatar.initials}
          color={avatar.color}
          imageUrl={avatar.imageUrl}
        />
      </div>
      <div className="flex flex-col flex-grow justify-center">
        <div className="text-xl pr-6 font-bold truncate">{name}</div>
        {has(discipline, 'name') && (
          <div className="full mt-0">
            <div
              className={classNames(
                'py-[1px] px-[5px] inline-block text-xs rounded font-bold'
              )}
              style={disciplineStyles}
            >
              {discipline?.name}
            </div>
          </div>
        )}
      </div>
      <div className="cursor-pointer flex items-center justify-around">
        {!open ? (
          <UserIcon size={26} color={accentColor} />
        ) : (
          <div>
            <X size={26} color={accentColor} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MentorCardHeader
