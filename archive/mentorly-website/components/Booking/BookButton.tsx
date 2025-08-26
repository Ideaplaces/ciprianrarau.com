import classNames from 'classnames'
import Booking from 'components/Booking'
import Button, { ButtonLink } from 'components/Button'
import Spinner from 'components/feedback/Spinner'
import RequireLogin from 'components/Forms/Login/RequireLogin'
import { useModal } from 'components/Modal/ModalContext'
import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import { disableBookingProps } from 'lib/userBookingChecks'
import { useCurrentUser } from 'lib/UserContext'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import { Maybe, useMentorAvailabilityQuery } from 'types/graphql'

// @TODO: use fragment for these fields as they're also used in page/Booking/index query
export const mentorAvailability = gql`
  query mentorAvailability($id: ID!) {
    mentor(id: $id) {
      id
      name
      group {
        id
        slug
      }
      bookable
      mentorSessionsRemaining
      hasAvailability
    }
  }
`

export type BookButtonProps = {
  mentor: {
    id: string
    bookingLink?: Maybe<string>
  }
  className?: string
  variant?: 'primary' | 'secondary'
}

const BookButton: VFC<BookButtonProps> = ({ mentor, className, variant }) => {
  const { formatMessage } = useIntl()

  if (mentor.bookingLink) {
    return (
      <ButtonLink
        href={mentor.bookingLink}
        target="_blank"
        type="button"
        testId="book-button"
        variant={variant}
      >
        {formatMessage({
          id: 'button.bookSession',
        })}
      </ButtonLink>
    )
  }

  return (
    <BookingModalButton
      className={className}
      variant={variant}
      mentor={mentor}
    />
  )
}

const BookingModalButton: VFC<BookButtonProps> = ({
  mentor,
  className,
  variant,
}) => {
  const { showModal, hideModal } = useModal()
  const { formatMessage } = useIntl()
  const { currentUser, refetch: refetchCurrentUser }: any = useCurrentUser()
  const { currentGroup }: any = useCurrentGroup()

  const [buttonLoading, setButtonLoading] = useState(false)

  const variables = {
    id: mentor.id,
  }

  const {
    loading,
    error,
    refetch: refetchMember,
    data,
  } = useMentorAvailabilityQuery({
    variables,
    skip: !mentor.id,
  })

  if (loading && !data) return <Spinner />

  if (error) {
    console.error(error)
    return null
  }

  const member = data?.mentor

  const disabledProps = disableBookingProps(currentGroup, currentUser, member)

  const checkLimits = async () => {
    setButtonLoading(true)
    return Promise.all([refetchMember(), refetchCurrentUser()]).then(
      (payload) => {
        const mentor = payload[0].data.mentor
        const mentee = payload[1].data.viewer
        setButtonLoading(false)
        return disableBookingProps(currentGroup, mentee, mentor)
      }
    )
  }

  const handleOpen = () => {
    member &&
      checkLimits().then(
        (disable) =>
          !disable &&
          showModal({
            width: 'xl',
            content: <Booking member={member} close={hideModal} />,
            callback: () => checkLimits,
          })
      )
  }

  const isSelf = member?.id === currentUser?.id

  return (
    <RequireLogin whenLoggedIn={handleOpen}>
      <Button
        type="button"
        className={classNames('rounded-full min-w-48', className)}
        disabled={currentUser && disabledProps?.disabled && !isSelf}
        disabledProps={disabledProps}
        variant={variant}
        onClick={handleOpen}
        loading={buttonLoading}
        testId="book-button"
      >
        {formatMessage({
          id: isSelf ? 'user.selfBook' : 'button.bookSession',
        })}
      </Button>
    </RequireLogin>
  )
}

export default BookButton
