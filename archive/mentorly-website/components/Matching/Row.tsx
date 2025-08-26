import { gql } from '@apollo/client'
import Compatibility from 'components/Matching/Compatibility'
import LastUpdated from 'components/Matching/LastUpdated'
import MainUser from 'components/Matching/MainUser'
import MemberMatches from 'components/Matching/MemberMatches'
import {
  AddMatchFieldsFragmentDoc,
  LastUpdatedFieldsFragmentDoc,
  MainUserFieldsFragmentDoc,
  ManagedGroupAvatarsFieldsFragmentDoc,
  MatchCompatibilityFieldsFragmentDoc,
  Maybe,
  MemberMatchingFieldsFragment,
  MemberMatchingMatchesFieldsFragment,
  MentorMatchesFieldsFragmentDoc,
  MentorMatchesMatchFieldsFragmentDoc,
} from 'types/graphql'

// @TODO: there's a lot of repetition between this fragment and the one in the matching/index page
gql`
  fragment MemberMatchingFields on ManagedUser {
    name
    status
    ...AddMatchFields
    ...MainUserFields
    ...ManagedGroupAvatarsFields
    ...MentorMatchesFields
    allMatches(active: true, orderBy: $orderMatchesBy) {
      ...MemberMatchingMatchesFields
    }
  }
  fragment MemberMatchingMatchesFields on MentorMatch {
    id
    ...LastUpdatedFields
    ...MatchCompatibilityFields
    ...MentorMatchesMatchFields
  }
  ${AddMatchFieldsFragmentDoc}
  ${LastUpdatedFieldsFragmentDoc}
  ${MainUserFieldsFragmentDoc}
  ${ManagedGroupAvatarsFieldsFragmentDoc}
  ${MatchCompatibilityFieldsFragmentDoc}
  ${MentorMatchesFieldsFragmentDoc}
  ${MentorMatchesMatchFieldsFragmentDoc}
`

const getRow = (
  member: MemberMatchingFieldsFragment,
  headers: Array<{ id: string }>,
  match?: Maybe<MemberMatchingMatchesFieldsFragment>,
  index?: number,
  expanded?: boolean
) => {
  return headers.map((header, i) => {
    switch (header.id) {
      case 'user':
        return (
          <MainUser member={member} index={index} expanded={expanded} key={i} />
        )
      case 'matches':
        return (
          <MemberMatches
            match={match}
            member={member}
            expanded={expanded}
            index={index}
            key={i}
          />
        )
      case 'compatibility':
        return (
          <Compatibility
            match={match}
            member={member}
            expanded={expanded}
            key={i}
          />
        )
      case 'lastUpdated':
        return (
          <LastUpdated
            match={match}
            member={member}
            expanded={expanded}
            key={i}
          />
        )
    }
  })
}

export default getRow
