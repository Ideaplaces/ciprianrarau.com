import MemberCard from 'components/display/MemberCard'
import { StringParam, useQueryParam } from 'lib/next-query-params'
import { useCurrentUser } from 'lib/UserContext'
import { isEmpty } from 'lodash'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { MentorMatch, User, ViewerActiveMatchesQuery } from 'types/graphql'

type MemberMatchesListProps = {
  matches: ViewerActiveMatchesQuery['viewer']
}

const MemberMatchesList: VFC<MemberMatchesListProps> = ({ matches }) => {
  const [activeTab] = useQueryParam('type', StringParam)
  const { formatMessage } = useIntl()
  const { currentUser } = useCurrentUser()

  if (!currentUser) return null

  const matchArray =
    matches &&
    (matches[`${activeTab}Matches` as keyof typeof matches] as MentorMatch[])

  if (
    !currentUser ||
    isEmpty(matchArray) ||
    !matchArray ||
    matchArray?.length === 0
  ) {
    return (
      <div
        data-testid="member-matches-list"
        className="max-w-md p-4 bg-white rounded mt-4"
      >
        {formatMessage({ id: 'text.noMatches' })}
      </div>
    )
  }

  // @TODO: backend should not send NULL users
  return (
    <div data-testid="member-matches-list" className="flex flex-wrap">
      {matchArray.map((user) => (
        <MemberCard
          key={user.id}
          user={user[activeTab as keyof typeof user] as User}
          className="mr-4 mb-4 w-72"
          showBook={activeTab === 'mentor'}
          hideBadge
          showMessage
        />
      ))}
    </div>
  )
}

export default MemberMatchesList
