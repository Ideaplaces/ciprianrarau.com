import { gql } from '@apollo/client'
import { getFeatureFlag } from 'components/Feature'
import { isFuture, isPast } from 'date-fns'
import { useCurrentGroup } from 'lib/GroupContext'
import { useCurrentUser } from 'lib/UserContext'
import { useState, VFC } from 'react'
import { BookingReviewFieldsFragment } from 'types/graphql'

import ReviewForm from './ReviewForm'
import RightRender from './RightRender'
import Success from './Success'

gql`
  fragment BookingReviewFields on Booking {
    id
    pid
    mentor {
      id
    }
    startTime
    endTime
    lastReviewByViewer {
      ...ReviewFormFields
    }
    conversation {
      id
    }
  }
`

type ReviewProps = {
  booking: BookingReviewFieldsFragment
}
const Review: VFC<ReviewProps> = ({ booking }) => {
  const [finishSurvey, setFinishSurvey] = useState(false)
  const { currentGroup } = useCurrentGroup()
  const { currentUser } = useCurrentUser()

  const isMentor = currentUser.id === booking?.mentor?.id
  const isSessionValid =
    (isPast(new Date(booking?.startTime)) &&
      isFuture(new Date(booking?.endTime))) ||
    !getFeatureFlag(currentGroup, 'sessionTimer')

  return (
    <div className="container wrapper mx-auto flex flex-col md:flex-row mt-12">
      <div className="md:w-1/2 md:mr-12">
        {finishSurvey ? (
          <Success
            sessionId={booking?.id}
            isMarketplace={currentGroup?.marketplace}
            isSessionValid={isSessionValid}
            conversationId={booking?.conversation?.id}
          />
        ) : (
          <ReviewForm
            currentReview={booking?.lastReviewByViewer}
            setFinishSurvey={setFinishSurvey}
            bookingPid={booking?.pid}
            isMentor={isMentor}
          />
        )}
      </div>
      <div className="md:w-1/2 relative">
        <RightRender
          isMarketplace={currentGroup?.marketplace}
          isMentor={isMentor}
        />
      </div>
    </div>
  )
}

export default Review
