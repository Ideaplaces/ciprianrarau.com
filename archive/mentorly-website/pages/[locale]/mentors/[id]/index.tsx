import { gql } from '@apollo/client'
import Alert from 'components/feedback/Alert'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import Profile from 'components/pages/User/Profile'
import Redirect from 'components/Redirect'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { memberUrl, profileUrl } from 'lib/urls'
import { useIntl } from 'react-intl'
import {
  MentorPageQuery,
  MentorPageQueryVariables,
  useMentorPageQuery,
  User,
  UserProfilePageFieldsFragmentDoc,
} from 'types/graphql'

gql`
  query mentorPage($groupId: ID!, $userId: ID!, $locale: String) {
    group(id: $groupId) {
      id
      member(id: $userId) {
        group {
          id
          slug
        }
        ...UserProfilePageFields
      }
    }
  }
  ${UserProfilePageFieldsFragmentDoc}
`

const MentorPage = () => {
  const router = useRouter()
  const { currentGroup } = useCurrentGroup()
  const { id } = router.query
  const { locale, formatMessage } = useIntl()

  return (
    <TypedQuery<MentorPageQueryVariables>
      typedQuery={useMentorPageQuery}
      variables={{
        groupId: currentGroup?.id as string,
        userId: id as string,
        locale,
      }}
      skip={!currentGroup || !id}
      runOnServer
    >
      {({ group }: TypedQueryReturn & MentorPageQuery) => {
        if (!group?.member) {
          console.error(`no userId ${id} in groupId ${currentGroup?.id}`)
          return (
            <div className="flex items-center justify-center m-auto w-auto h-full">
              <Alert type="error">
                {formatMessage({ id: 'error.userNotFound' })}
              </Alert>
            </div>
          )
        }

        const path =
          group?.member?.group &&
          memberUrl(group.member.group, group?.member.id, group.member)

        return group?.member?.mentor && path?.includes('/mentors/') ? (
          <Profile member={group.member} isMentor />
        ) : (
          <Redirect url={profileUrl(group?.member as User, locale)} />
        )
      }}
    </TypedQuery>
  )
}

export const getServerSideProps = connectServerSideProps(MentorPage)
export default MentorPage
