import { gql } from '@apollo/client'
import classNames from 'classnames'
import { useModal } from 'components/Modal/ModalContext'
import { useMatches } from 'lib/MatchesContext'
import { useRef, VFC } from 'react'
import { Plus } from 'react-feather'
import { useIntl } from 'react-intl'
import { AddMatchFieldsFragment } from 'types/graphql'

import MatchFinder from './MatchFinder'

gql`
  fragment AddMatchFields on ManagedUser {
    ...MatchFinderMemberFields
    matchingPercent
    allMatches(active: true, orderBy: $orderMatchesBy) {
      id
      status
    }
  }
`

const AddMatchCircle = () => {
  return (
    <div className="w-12 h-12 rounded-full border-2 border-darkGray bg-white border-dashed flex items-center justify-center">
      <Plus className="text-darkGray" />
    </div>
  )
}

export type FinderPosition = {
  bottom?: string
  top?: string
}

type AddMatchProps = {
  member: AddMatchFieldsFragment
  expanded?: boolean
}

const AddMatch: VFC<AddMatchProps> = ({ member, expanded }) => {
  const { formatMessage } = useIntl()
  const { showModal, isOpen } = useModal()
  const ref = useRef<HTMLDivElement>(null)

  const { segment } = useMatches()

  const addUserId =
    segment === 'mentor' ? 'button.addMentee' : 'button.addMentor'

  return (
    <div className="cursor-pointer" ref={ref}>
      <div
        className="group flex items-center p-1 lg:p-2 relative"
        onClick={(e) => {
          e.stopPropagation()
          showModal({
            content: <MatchFinder member={member} />,
            width: 'lg',
          })
        }}
      >
        <AddMatchCircle />

        <div
          className={classNames(
            'ml-3 text-darkGray group-hover:text-darkerGray font-bold',
            'opacity-0 group-hover:opacity-100 text-sm lg:text-base',
            {
              'opacity-100':
                isOpen || expanded || member.allMatches.length === 0,
              'text-darkerGray': isOpen,
              'hidden lg:block': !expanded && member.allMatches.length > 0,
            }
          )}
        >
          {formatMessage({ id: addUserId })}
        </div>
      </div>
    </div>
  )
}

export { AddMatchCircle }

export default AddMatch
