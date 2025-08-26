import { gql } from '@apollo/client'
import User from 'components/Dashboard/Home/User'
import Avatar, { AvatarGroup } from 'components/display/Avatar'
import StarRating from 'components/display/StarRating'
import { useModal } from 'components/Modal/ModalContext'
import { format, isCurrentYear } from 'lib/date'
import { truncate } from 'lodash'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import {
  GroupAvatarsFieldsFragmentDoc,
  RatingEventFieldsFragment,
} from 'types/graphql'

gql`
  fragment RatingEventFields on Review {
    id
    booking {
      startTime
      endTime
      groupSession
      mentor {
        ...GroupAvatarsFields
      }
      mentee {
        ...GroupAvatarsFields
      }
    }
    sessionRating
    sessionRatingDetails
    otherDetails
    user {
      ...GroupAvatarsFields
    }
  }
  ${GroupAvatarsFieldsFragmentDoc}
`

type EventReviewProp = {
  event: RatingEventFieldsFragment
}

type EventWrapperProps = {
  date: string
}

export const EventWrapper: FC<EventWrapperProps> = ({ date, children }) => {
  return (
    <div className="flex items-center">
      <ReviewDate date={date} />
      {children}
    </div>
  )
}

const RatingEvent: FC<EventReviewProp> = ({ event }) => {
  if (!event) {
    return null
  }

  return (
    <EventWrapper date={event?.booking?.startTime}>
      <Rating event={event} />
    </EventWrapper>
  )
}

export const Rating: FC<EventReviewProp> = ({ event }) => {
  return (
    <div className="bg-gray rounded w-full self-stretch p-4 text-sm">
      <RatingAndUsers event={event} />
      <Reviews event={event} />
    </div>
  )
}

type ReviewDateProps = {
  date?: string
}

const ReviewDate: FC<ReviewDateProps> = ({ date }) => {
  if (!date) {
    return <div>no date</div>
  }

  const line1 = format(date, 'MMM dd')
  let line2 = format(date, 'H:mm')

  if (!isCurrentYear(date)) {
    line2 = format(date, 'yyyy')
  }

  return (
    <>
      <div className="whitespace-nowrap w-10 flex-none text-sm">
        <div className="text-center md:text-left">{line1}</div>
        <div className="text-center md:text-left">{line2}</div>
      </div>
      <div className="p-1 m-1 h-1 w-1 bg-backgroundColor rounded-full ml-4"></div>
      <hr className="h-4 w-1 md:w-4 md:h-1 border-none bg-gray flex-none" />
    </>
  )
}

const compareUsers = (event: RatingEventFieldsFragment) => {
  if (event?.booking?.groupSession) {
    return null
  }

  if (event?.booking?.mentor?.name) {
    if (event.user?.name === event?.booking?.mentor?.name) {
      return event?.booking?.mentee
    }
    return event?.booking?.mentor
  }
}

const isMentor = (user: { name: string }, event: RatingEventFieldsFragment) => {
  return user?.name === event?.booking?.mentor?.name
}

const RatingAndUsers: FC<EventReviewProp> = ({ event }) => {
  const { formatMessage } = useIntl()

  const user = event.user
  const groupSession = event.booking?.groupSession || false

  const otherUser = compareUsers(event)

  return (
    <div className="flex justify-between">
      <div>
        <StarRating className="mb-2 -ml-1" rating={event.sessionRating} />
        <div>
          <User user={user} />{' '}
          {groupSession ? (
            <span>
              {formatMessage({ id: 'event.hasReviewedGroupSession' })}
            </span>
          ) : (
            <>
              <span>{formatMessage({ id: 'event.hasReviewed' })}</span>{' '}
              <User user={otherUser} />
            </>
          )}
        </div>
      </div>
      <div>
        <AvatarGroup>
          {user && <Avatar mentor={isMentor(user, event)} {...user?.avatar} />}
          {otherUser && (
            <Avatar mentor={isMentor(otherUser, event)} {...otherUser.avatar} />
          )}
        </AvatarGroup>
      </div>
    </div>
  )
}

const Reviews: FC<EventReviewProp> = ({ event }) => {
  const { formatMessage } = useIntl()
  return (
    <>
      {event.sessionRatingDetails && (
        <div className="pb-2">
          <div className="mt-4 font-bold">
            {event?.user?.name || 'they'}{' '}
            {formatMessage({
              id: 'event.hasSaid',
            })}
            {':'}
          </div>
          <div className={`break-words relative`}>
            {event.sessionRatingDetails.length > 120 ? (
              <>
                <TruncatedText text={event.sessionRatingDetails} />
                <FullReview review={event} />
              </>
            ) : (
              event.sessionRatingDetails
            )}
          </div>
        </div>
      )}
      {event.otherDetails && (
        <div className="break-all">
          <div className="font-bold mt-2">
            {formatMessage({ id: 'event.hasAdded' })}
            {':'}
          </div>
          <div>
            {event.otherDetails.length > 120 ? (
              <>
                <TruncatedText text={event.otherDetails} />
                <FullReview review={event} />
              </>
            ) : (
              ` ${event.otherDetails}`
            )}
          </div>
        </div>
      )}
    </>
  )
}

type TruncatedTextProps = {
  text: string
}
const TruncatedText: FC<TruncatedTextProps> = ({ text }) => (
  <>
    {truncate(text, {
      length: 120,
      omission: '...',
    })}
  </>
)

type FullReviewProps = {
  review: RatingEventFieldsFragment
}
const FullReview: FC<FullReviewProps> = ({ review }) => {
  const { formatMessage } = useIntl()
  const { showModal } = useModal()

  return (
    <>
      <span
        className="text-highlightColor whitespace-nowrap cursor-pointer"
        onClick={() =>
          showModal({
            width: 'md',
            padding: 'p-12',
            content: (
              <>
                <RatingAndUsers event={review} />
                {review.sessionRatingDetails && (
                  <div className="pb-2">
                    <div className="mt-4 font-bold">{`${
                      review?.user?.name
                    } ${formatMessage({
                      id: 'event.hasSaid',
                    })} :`}</div>
                    <div className={`break-all relative`}>
                      {review.sessionRatingDetails}
                    </div>
                  </div>
                )}
                {review.otherDetails && (
                  <div className="break-all">
                    <div className="font-bold mt-2">
                      {formatMessage({ id: 'event.hasAdded' })}
                      {' :'}
                    </div>
                    <div className="h-auto overflow-hidden">
                      {review.otherDetails.length > 0 &&
                        ` ${review.otherDetails}`}
                    </div>
                  </div>
                )}
              </>
            ),
          })
        }
      >
        {formatMessage({ id: 'button.readMore' })}
      </span>
    </>
  )
}

export default RatingEvent
