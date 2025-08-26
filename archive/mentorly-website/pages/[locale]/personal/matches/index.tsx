import { gql } from '@apollo/client'
import DashboardLayout from 'components/Dashboard/Layout'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import PersonalMatches from 'components/Personal/Matches'
import { connectServerSideProps } from 'lib/ssg'
import {
  MenteeMatchFieldsFragmentDoc,
  MentorMatchFieldsFragmentDoc,
  useViewerActiveMatchesQuery,
  ViewerActiveMatchesQuery,
  ViewerActiveMatchesQueryVariables,
} from 'types/graphql'

gql`
  query viewerActiveMatches {
    viewer {
      id
      menteeMatches(active: true) {
        ...MenteeMatchFields
      }
      mentorMatches(active: true) {
        ...MentorMatchFields
      }
    }
  }
  ${MentorMatchFieldsFragmentDoc}
  ${MenteeMatchFieldsFragmentDoc}
`

const Matches = () => (
  <TypedQuery<ViewerActiveMatchesQueryVariables>
    typedQuery={useViewerActiveMatchesQuery}
  >
    {({
      viewer: activeMatches,
    }: TypedQueryReturn & ViewerActiveMatchesQuery) => {
      return <PersonalMatches matches={activeMatches} />
    }}
  </TypedQuery>
)

Matches.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Matches)
export default Matches
