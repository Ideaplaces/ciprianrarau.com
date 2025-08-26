import { gql } from '@apollo/client'
import Button, { ButtonLink } from 'components/Button/Button'
import Feature from 'components/Feature'
import JoinButton from 'components/Sessions/JoinButton'
import ReplyButton from 'components/Sessions/ReplyButton'
import { useCurrentUser } from 'lib/UserContext'
import Link from 'next/link'
import { FC } from 'react'
import { Check, Star, X } from 'react-feather'
import { useIntl } from 'react-intl'
import {
  JoinButtonFieldsFragmentDoc,
  ReplyButtonFieldsFragmentDoc,
  SessionActionsFieldsFragment,
} from 'types/graphql'

import { SessionCardFormat } from '.'

gql`
  fragment SessionActionsFields on Booking {
    type
    groupSession
    id
    lastReviewByViewer {
      id
      sessionRating
      sessionRatingDetails
      sessionRatingReason
      platformRating
      platformRatingDetails
      platformRatingReason
      otherDetails
      noShow
    }
    mentee {
      id
      name
    }
    guests {
      id
    }
    mentor {
      id
    }
    ...ReplyButtonFields
    ...JoinButtonFields
  }
  ${JoinButtonFieldsFragmentDoc}
  ${ReplyButtonFieldsFragmentDoc}
`

type SessionActionsProps = {
  booking: SessionActionsFieldsFragment
  format: SessionCardFormat
  context: 'cancelled' | 'future' | 'past'
  handleApproveBooking: () => void
  isApproving: boolean
  handleDeclineBooking: () => void
  slim: boolean
  hideRatings?: boolean
}

// Extending the type to include the new fields until the types are regenerated
type ReviewWithRating = {
  id: string
  sessionRating?: number
  sessionRatingDetails?: string
  sessionRatingReason?: string
  otherDetails?: string
  noShow?: boolean
}

const Wrapper: FC = ({ children }) => {
  return (
    <div className="mt-4 mb-1 flex flex-col sm:flex-row flex-wrap gap-3 justify-between items-start">
      {children}
    </div>
  )
}

type ReplyProps = {
  booking: SessionActionsFieldsFragment
  slim?: boolean
}

const Reply: FC<ReplyProps> = ({ booking, slim }) => {
  return (
    <Feature id="messaging">
      <ReplyButton booking={booking} slim={slim} />
    </Feature>
  )
}

// Helper component to render stars based on rating
const RatingStars: FC<{
  rating: number
  label?: string
}> = ({ rating, label }) => {
  const stars = []
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 inline ${
          i < rating ? 'text-yellow fill-yellow' : 'text-gray'
        }`}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    )
  }
  return (
    <div className="flex items-center">
      {label && <span className="text-sm text-gray-700 mr-2">{label}:</span>}
      {stars}
    </div>
  )
}

const SessionActions: FC<SessionActionsProps> = ({
  booking,
  format,
  context,
  handleApproveBooking,
  isApproving,
  handleDeclineBooking,
  slim = true,
  hideRatings = false,
}) => {
  const { formatMessage, locale } = useIntl()
  const { currentUser } = useCurrentUser()

  if (!currentUser) {
    console.error(
      'cannot render SessionActions for SessionCard without currentUser'
    )
    return null
  }
  const { groupSession, mentee, type, guests, lastReviewByViewer } = booking
  const review = lastReviewByViewer as unknown as ReviewWithRating

  const isMentee =
    mentee?.id == currentUser?.id ||
    guests?.map((u) => u.id).includes(currentUser?.id)
  const rebookable = !groupSession && isMentee
  const needsReview = context === 'past' && !lastReviewByViewer
  const hasReview = context === 'past' && lastReviewByViewer

  if (context === 'future') {
    switch (type) {
      case 'incomingRequest':
        return (
          <Wrapper>
            {/* Action buttons grouped together */}
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <Button
                onClick={handleApproveBooking}
                loading={isApproving}
                type="submit"
                className="inline-flex items-stretch hover:shadow-sm mb-1 mr-1"
                color="green"
                slim={slim}
                full
              >
                <Check className="inline mr-1" />
                {formatMessage({ id: 'button.approve' })}
              </Button>
              <Button
                onClick={handleDeclineBooking}
                className="inline-flex items-stretch hover:shadow-sm border-mediumGray border-2"
                color="white"
                slim={slim}
                full
              >
                <X className="inline mr-1" color="red" />
                {formatMessage({ id: 'button.decline' })}
              </Button>
              <Reply booking={booking} slim={slim} />
            </div>
          </Wrapper>
        )
      case 'booking':
        return (
          <Wrapper>
            {/* Action buttons grouped together */}
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <JoinButton
                booking={booking}
                variant="secondary"
                slim={slim}
                showTooltip
                tooltipOffset={format === 'modal' ? 100 : undefined}
              />
              <Reply booking={booking} slim={slim} />
            </div>
          </Wrapper>
        )
      default:
        return (
          <Wrapper>
            {/* Action buttons grouped together */}
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <Reply booking={booking} slim={slim} />
            </div>
          </Wrapper>
        )
    }
  } else {
    return (
      <Wrapper>
        {/* Left side: Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          {rebookable && (
            <Link
              href={`/${locale}/mentors/${booking?.mentor?.id}?open=true`}
              passHref
            >
              <ButtonLink
                className="cursor-pointer"
                variant="secondary"
                slim={slim}
              >
                {formatMessage({ id: `button.rebook.${context}` })}
              </ButtonLink>
            </Link>
          )}
          <Reply booking={booking} slim={slim} />
        </div>

        {/* Right side: Rating buttons and displays */}
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          {needsReview && (
            <Link href={`/${locale}/sessions/${booking.id}/review`} passHref>
              <ButtonLink
                className="cursor-pointer inline-flex items-center"
                variant="primary"
                slim={slim}
              >
                <Star className="inline mr-1 h-4 w-4" />
                {formatMessage({ id: 'button.rateSession' })}
              </ButtonLink>
            </Link>
          )}
          {hasReview && !hideRatings && review?.sessionRating && (
            <div className="flex flex-col">
              <div className="text-sm text-gray-700 mb-1">
                {formatMessage({ id: 'review.yourRating' })}:
              </div>

              {review.sessionRating && (
                <RatingStars
                  rating={review.sessionRating}
                  label={formatMessage({ id: 'review.sessionRating' })}
                />
              )}

              {(review.sessionRatingDetails || review.otherDetails) && (
                <div className="text-sm text-gray-600 mt-1 italic line-clamp-3">
                  {review.sessionRatingDetails && (
                    <p>&ldquo;{review.sessionRatingDetails}&rdquo;</p>
                  )}
                  {review.otherDetails && (
                    <p className="mt-1 text-gray-500">
                      &ldquo;{review.otherDetails}&rdquo;
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Wrapper>
    )
  }
}

export default SessionActions
