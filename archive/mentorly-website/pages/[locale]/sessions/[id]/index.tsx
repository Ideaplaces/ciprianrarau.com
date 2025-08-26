import ConferenceWrapper from 'components/ConferenceWrapper'
import TypedQuery from 'components/Graphql/TypedQuery'
import HalfPageWave from 'components/layout/HalfPageWave'
import Layout from 'components/pages/Groups/Layout'
import SessionDetails from 'components/pages/Sessions/SessionDetails'
import SessionMentorInfo from 'components/pages/Sessions/SessionMentorInfo'
import SEO from 'components/SEO/SEO'
import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import {
  MentorDetailsFieldsFragmentDoc,
  SessionDetailsFieldsFragmentDoc,
  SessionDetailsQuery,
  SessionDetailsQueryVariables,
  useSessionDetailsQuery,
} from 'types/graphql'

gql`
  query sessionDetails($id: ID!, $locale: String) {
    booking(id: $id) {
      description(format: "html")
      title
      mentor {
        ...MentorDetailsFields
      }
      ...SessionDetailsFields
    }
  }
  ${SessionDetailsFieldsFragmentDoc}
  ${MentorDetailsFieldsFragmentDoc}
`

const Sessions = () => {
  const { currentGroup } = useCurrentGroup()

  const bgColor = currentGroup?.styles?.backgroundColor || '#fdde35'

  return (
    <ConferenceWrapper>
      {(booking) => {
        if (!booking) {
          console.error('no booking')
          return null
        }

        return (
          <TypedQuery<SessionDetailsQueryVariables>
            typedQuery={useSessionDetailsQuery}
            variables={{ id: booking?.id }}
            skip={!booking?.id}
          >
            {({ booking }: SessionDetailsQuery) => (
              <>
                <SEO
                  description={booking?.description}
                  title={booking?.title || ''}
                  image={currentGroup?.backgroundImages[0]?.imageUrl}
                />
                <HalfPageWave color={bgColor}>
                  <SessionDetails session={booking} />
                  <SessionMentorInfo mentor={booking?.mentor} />
                </HalfPageWave>
              </>
            )}
          </TypedQuery>
        )
      }}
    </ConferenceWrapper>
  )
}

Sessions.Layout = Layout
export const getServerSideProps = connectServerSideProps(Sessions)
export default Sessions
