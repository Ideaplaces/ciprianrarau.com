import { gql } from '@apollo/client'
import { ButtonLink } from 'components/Button'
import { Rating } from 'components/Dashboard/Ratings/RatingEvent'
import { Timeline } from 'components/Dashboard/Timeline'
import MentorLegend from 'components/display/MentorLegend'
import Panel from 'components/display/Panel'
import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  DashboardRatingsFieldsFragment,
  Maybe,
  RatingEventFieldsFragmentDoc,
} from 'types/graphql'

gql`
  fragment DashboardRatingsFields on ManagedGroup {
    id
    reviewCount(query: $query, comparisonType: $comparisonType)
    averageSessionRating
    reviews(
      page: $ratingsPage
      limit: $ratingsLimit
      sessionRating: $sessionRating
      query: $query
      orderBy: $orderBy
      comparisonType: $comparisonType
    ) {
      ...RatingEventFields
    }
  }
  ${RatingEventFieldsFragmentDoc}
`

type RatingsProps = {
  group?: Maybe<DashboardRatingsFieldsFragment>
  displayAll?: boolean
}
const Ratings: VFC<RatingsProps> = ({ group, displayAll }) => {
  const ratings = group?.reviews || []
  const { formatMessage, locale } = useIntl()

  return (
    <Panel>
      <Panel.Header>{formatMessage({ id: 'section.ratings' })}</Panel.Header>
      <Panel.Body>
        {ratings && <Timeline events={ratings} component={Rating} />}
      </Panel.Body>
      <Panel.Footer>
        <div>
          {ratings.length > 0 && !displayAll && (
            <Link href={`/${locale}/dashboard/ratings`} passHref>
              <ButtonLink className="text-xs" testId="ratings-view-more-button">
                {formatMessage({ id: 'button.viewMore' })}
              </ButtonLink>
            </Link>
          )}
        </div>
        <MentorLegend />
      </Panel.Footer>
    </Panel>
  )
}

export default Ratings
