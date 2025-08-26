import { gql } from '@apollo/client'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import Profile from 'components/pages/User/Profile'
import Redirect from 'components/Redirect'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { profileUrl } from 'lib/urls'
import { useIntl } from 'react-intl'
import {
  MenteePageQuery,
  MenteePageQueryVariables,
  useMenteePageQuery,
  User,
  UserProfilePageFieldsFragmentDoc,
} from 'types/graphql'

gql`
  query menteePage($groupId: ID!, $userId: ID!, $locale: String) {
    group(id: $groupId) {
      member(id: $userId) {
        ...UserProfilePageFields
      }
    }
  }
  ${UserProfilePageFieldsFragmentDoc}
`

const MenteePage = () => {
  const router = useRouter()
  const { currentGroup } = useCurrentGroup()
  const { id } = router.query
  const { locale } = useIntl()

  return (
    <TypedQuery<MenteePageQueryVariables>
      typedQuery={useMenteePageQuery}
      variables={{ groupId: currentGroup.id, userId: id as string, locale }}
      skip={!currentGroup || !id}
      runOnServer
    >
      {({ group }: TypedQueryReturn & MenteePageQuery) =>
        group?.member?.mentor ? (
          <Redirect url={profileUrl(group.member as User, locale)} />
        ) : (
          <Profile member={group?.member} />
        )
      }
    </TypedQuery>
  )
}

export const getServerSideProps = connectServerSideProps(MenteePage)
export default MenteePage
