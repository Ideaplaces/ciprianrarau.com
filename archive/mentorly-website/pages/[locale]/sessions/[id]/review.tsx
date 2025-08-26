import { gql } from '@apollo/client'
import QueryError from 'components/Error/QueryError'
import Spinner from 'components/feedback/Spinner'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import Review from 'components/Sessions/Review'
import { useDOMInteraction } from 'lib/DOMInteraction'
import isBrowser from 'lib/isBrowser'
import { useRouter } from 'lib/router'
import { connectServerSideProps } from 'lib/ssg'
import { useCurrentUser } from 'lib/UserContext'
import { useEffect, VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  BookingReviewFieldsFragmentDoc,
  ReviewPageQuery,
  ReviewPageQueryVariables,
  useReviewPageQuery,
} from 'types/graphql'

gql`
  query reviewPage($id: ID!) {
    booking(id: $id) {
      ...BookingReviewFields
    }
  }
  ${BookingReviewFieldsFragmentDoc}
`

const ReviewPage: VFC = () => {
  const { query, push } = useRouter()
  const { id, action } = query
  const { currentUser, loading: userLoading } = useCurrentUser()
  const { locale } = useIntl()

  const { DOMElement: intercomMsg } = useDOMInteraction({
    selector: '#intercom-container',
  })
  const { DOMElement: intercomIcon } = useDOMInteraction({
    selector: '.intercom-launcher',
  })

  const intercomButton = intercomMsg || intercomIcon

  useEffect(() => {
    if (action && intercomButton) {
      intercomButton.click()
    }
  }, [intercomButton, action])

  return (
    <TypedQuery<ReviewPageQueryVariables>
      typedQuery={useReviewPageQuery}
      variables={{ id: id as string }}
      skip={!id}
    >
      {({ booking, error, loading }: TypedQueryReturn & ReviewPageQuery) => {
        if (isBrowser() && !loading && !currentUser && !userLoading) {
          push('/[locale]/login', `/${locale}/login`)
          return null
        }

        if (loading || userLoading) {
          return (
            <div className="w-full flex justify-center align-center mt-10">
              <Spinner />
            </div>
          )
        }

        if (error) {
          return <QueryError error={error} />
        }

        if (!booking || !booking) {
          console.error('no data')
          return null
        }

        return <Review booking={booking} />
      }}
    </TypedQuery>
  )
}

export const getServerSideProps = connectServerSideProps(ReviewPage)
export default ReviewPage
