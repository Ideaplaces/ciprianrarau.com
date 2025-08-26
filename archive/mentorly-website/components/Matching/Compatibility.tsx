import { gql } from '@apollo/client'
import { useModal } from 'components/Modal/ModalContext'
import { compatibilityScore } from 'lib/matching'
import { MouseEvent, VFC } from 'react'
import { HelpCircle, Info } from 'react-feather'
import {
  MatchCompatibilityFieldsFragment,
  Maybe,
  MemberMatchingFieldsFragment,
  ResponseFieldsFragment,
  ResponseFieldsFragmentDoc,
} from 'types/graphql'

import MentorMatchResponse from './Responses'

gql`
  fragment MatchCompatibilityFields on MentorMatch {
    scorePercentage
    ...ResponseFields
  }
  ${ResponseFieldsFragmentDoc}
`

type CompatibilityProps = {
  member: MemberMatchingFieldsFragment
  match?: Maybe<MatchCompatibilityFieldsFragment>
  expanded?: boolean
}
const Compatibility: VFC<CompatibilityProps> = ({
  member: { allMatches },
  match,
  expanded,
}) => {
  const { showModal } = useModal()

  const showMatchingInfo = (
    e: MouseEvent<HTMLButtonElement>,
    match: ResponseFieldsFragment
  ) => {
    e.stopPropagation()
    showModal({
      content: <MentorMatchResponse match={match} />,
      width: 'sm',
    })
  }

  const score = compatibilityScore(allMatches, match, expanded)

  return (
    <div className="flex items-center space-x-1 text-center md:text-left text-sm lg:text-base mx-auto">
      <div>{score || <span className="text-darkerGray">-</span>}</div>
      {score && (
        <>
          {match ? (
            <button
              className="cursor-pointer"
              onClick={(e) => showMatchingInfo(e, match)}
            >
              <Info size={22} color="darkGray" />
            </button>
          ) : expanded ? null : (
            <div>
              <HelpCircle size={22} color="darkGray" />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Compatibility
