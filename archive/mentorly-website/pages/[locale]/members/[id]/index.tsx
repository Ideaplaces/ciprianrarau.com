import { gql } from '@apollo/client'
import TypedQuery from 'components/Graphql/TypedQuery'
import Profile from 'components/pages/User/Profile'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'
import {
  MemberPageQuery,
  MemberPageQueryVariables,
  useMemberPageQuery,
  UserProfilePageFieldsFragmentDoc,
} from 'types/graphql'

gql`
  query memberPage($groupId: ID!, $userId: ID!, $locale: String) {
    group(id: $groupId) {
      member(id: $userId) {
        ...UserProfilePageFields
      }
    }
  }
  ${UserProfilePageFieldsFragmentDoc}
`

const MemberPage = () => {
  const router = useRouter()
  const { currentGroup } = useCurrentGroup()
  const { id } = router.query
  const { locale } = useIntl()

  return (
    <TypedQuery<MemberPageQueryVariables>
      typedQuery={useMemberPageQuery}
      variables={{ groupId: currentGroup.id, userId: id as string, locale }}
      skip={!currentGroup || !id}
      runOnServer
    >
      {({ group }: MemberPageQuery) => {
        return (
          <Profile member={group?.member} isMentor={group?.member?.mentor} />
        )
      }}
    </TypedQuery>
  )
}

export const getServerSideProps = connectServerSideProps(MemberPage)
export default MemberPage
