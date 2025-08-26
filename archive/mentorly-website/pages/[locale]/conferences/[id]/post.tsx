import Layout from 'components/BlankLayout'
import Spinner from 'components/feedback/Spinner'
import TypedQuery from 'components/Graphql/TypedQuery'
import Redirect from 'components/Redirect'
import gql from 'graphql-tag'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { groupDomain } from 'lib/urls'
import Link from 'next/link'
import { AlertCircle } from 'react-feather'
import {
  PostConferenceInfoQuery,
  PostConferenceInfoQueryVariables,
  usePostConferenceInfoQuery,
} from 'types/graphql'

gql`
  query postConferenceInfo($id: ID!) {
    viewer {
      id
      booking(id: $id) {
        id
      }
      group {
        slug
      }
    }
  }
`

const PostConference = () => {
  const { query } = useRouter()

  return (
    <TypedQuery<PostConferenceInfoQueryVariables>
      typedQuery={usePostConferenceInfoQuery}
      variables={{ id: query?.id as string }}
      skip={!query?.id}
    >
      {({ viewer }: PostConferenceInfoQuery) => {
        if (!viewer) {
          return (
            <>
              <AlertCircle className="mx-auto mb-4" />
              <div>
                You need to&nbsp;
                <Link href="/en/login">
                  <a className="text-blue">login</a>
                </Link>
              </div>
            </>
          )
        }

        const { booking, group } = viewer || {}

        if (!booking) {
          return (
            <>
              <AlertCircle className="mx-auto mb-4" />
              <div>Could not find that session</div>
              <div>
                <Link href="/en/personal">
                  <a className="text-blue">View your sessions</a>
                </Link>
              </div>
            </>
          )
        }

        const url = `${groupDomain(group?.slug || 'marketplace')}/en/sessions/${
          booking.id
        }/review`

        return (
          <>
            <Redirect url={url} />
            <div className="mb-4">
              <Spinner color="black" />
            </div>
            <div>Redirecting...</div>
          </>
        )
      }}
    </TypedQuery>
  )
}

PostConference.Layout = Layout
export const getServerSideProps = connectServerSideProps(PostConference)
export default PostConference
