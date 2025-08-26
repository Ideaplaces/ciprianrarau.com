import { gql } from '@apollo/client'
import { lastUpdated } from 'lib/matching'
import { VFC } from 'react'
import {
  LastUpdatedFieldsFragment,
  Maybe,
  MemberMatchingFieldsFragment,
} from 'types/graphql'

gql`
  fragment LastUpdatedFields on MentorMatch {
    active
    activatedAt
    deactivatedAt
    updatedAt
  }
`

type CompatibilityProps = {
  member: MemberMatchingFieldsFragment
  match?: Maybe<LastUpdatedFieldsFragment>
  expanded?: boolean
}

const Compatibility: VFC<CompatibilityProps> = ({
  member: { allMatches },
  match,
  expanded,
}) => {
  const dates = lastUpdated(allMatches, match, expanded)

  if (dates.length === 0) {
    return <div className="text-darkerGray">-</div>
  }

  return (
    <div>
      {dates.map((d) => (
        <div key={d}>{d}</div>
      ))}
    </div>
  )
}

export default Compatibility
