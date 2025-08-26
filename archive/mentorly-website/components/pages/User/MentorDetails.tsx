import { gql } from '@apollo/client'
import BookButton from 'components/Booking/BookButton'
import { ButtonLink } from 'components/Button'
import ReadMore from 'components/display/ReadMore'
import Feature from 'components/Feature'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { useEffect, VFC } from 'react'
import { useIntl } from 'react-intl'
import { MentorProfileDetailsFieldsFragment } from 'types/graphql'

gql`
  fragment MentorProfileDetailsFields on User {
    id
    bookingLink
    welcomeMessage
    masterclasses {
      id
    }
  }
`

type MentorDetailsProps = {
  mentor: MentorProfileDetailsFieldsFragment
}

const MentorDetails: VFC<MentorDetailsProps> = ({ mentor }) => {
  const { currentGroup }: any = useCurrentGroup()
  const { query, asPath, push } = useRouter()
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (query.open) {
      push(asPath.split('?')[0], undefined, {
        shallow: true,
      })
    }
  }, [])

  return (
    <>
      {mentor.welcomeMessage && (
        <Feature id="userWelcomeMessage">
          <div className="flex items-start my-4 h-full">
            <ReadMore
              text={mentor.welcomeMessage || undefined}
              breakpoint={80}
            />
          </div>
        </Feature>
      )}
      <div className="flex flex-auto mt-6 flex-wrap items-end justify-start gap-4">
        {currentGroup.allowMasterclasses && !!mentor.masterclasses && (
          <div>
            <ButtonLink
              href="#masterclasses"
              variant="secondary"
              className="text-center items-center justify-center whitespace-nowrap"
            >
              {formatMessage({ id: 'button.viewMasterclasses' })}
            </ButtonLink>
          </div>
        )}
        <Feature id="bookUser">
          <div>
            <BookButton mentor={mentor} />
          </div>
        </Feature>
      </div>
    </>
  )
}

export default MentorDetails
