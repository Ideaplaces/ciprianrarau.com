import { gql } from '@apollo/client'
import Spinner from 'components/feedback/Spinner'
import { useModal } from 'components/Modal/ModalContext'
import MemberMatchesList from 'components/Personal/Matches/MemberMatchesList'
import MatchesMenu from 'components/Personal/Matches/Menu'
import Preferences from 'components/Personal/Matches/Preferences'
import { StringParam, useQueryParam } from 'lib/next-query-params'
import { useCurrentUser } from 'lib/UserContext'
import { useEffect, VFC } from 'react'
import {
  AvatarFieldsFragmentDoc,
  ViewerActiveMatchesQuery,
} from 'types/graphql'

gql`
  fragment MentorMatchFields on MentorMatch {
    id
    mentor {
      ...MentorMatchUserFields
    }
  }
  fragment MenteeMatchFields on MentorMatch {
    id
    mentee {
      ...MentorMatchUserFields
    }
  }
  fragment MentorMatchUserFields on ManagedUser {
    id
    name
    mentor
    avatar {
      ...AvatarFields
    }
    disciplines {
      id
      name
    }
    role
    skills
    slug
    profileImageUrl(width: 400, height: 400)
  }
  ${AvatarFieldsFragmentDoc}
`
export type PersonalMatchesProps = {
  matches: ViewerActiveMatchesQuery['viewer']
}
const PersonalMatches: VFC<PersonalMatchesProps> = ({ matches }) => {
  const [preferences, setPreferences] = useQueryParam(
    'preferences',
    StringParam
  )
  const { currentUser } = useCurrentUser()
  const { showModal } = useModal()
  const [activeTab, setActiveTab] = useQueryParam('type', StringParam)

  useEffect(() => {
    if (preferences === 'true') {
      showModal({
        width: 'lg',
        content: <Preferences />,
        callback: () => setPreferences('false'),
      })
    }

    if (!activeTab && currentUser) {
      if (matches?.mentorMatches && matches?.mentorMatches.length > 0) {
        setActiveTab('mentor')
      } else {
        setActiveTab('mentee')
      }
    }
  }, [])

  return (
    <>
      {!matches || !currentUser ? (
        <Spinner />
      ) : (
        <>
          <MatchesMenu
            activeMatches={matches}
            menuOpen={preferences === 'true'}
          />
          <MemberMatchesList matches={matches} />
        </>
      )}
    </>
  )
}

export default PersonalMatches
