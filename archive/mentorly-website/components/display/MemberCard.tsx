import { gql } from '@apollo/client'
import classNames from 'classnames'
import BookButton from 'components/Booking/BookButton'
import ButtonRow from 'components/display/ButtonRow'
import ProfilePicture from 'components/display/ProfilePicture'
import UserLocation from 'components/display/UserLocation'
import Feature from 'components/Feature'
import MessageUser from 'components/pages/User/MessageUser'
import { firstName } from 'lib/firstName'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { useEffect, VFC } from 'react'
import { MessageCircle } from 'react-feather'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import {
  MemberCardFieldsFragment,
  ProfilePictureFieldsFragmentDoc,
  ViewProfileButtonFieldsFragmentDoc,
} from 'types/graphql'

import ViewProfileButton from './ViewProfileButton'

gql`
  fragment MemberCardFields on User {
    id
    name
    disciplines {
      id
      name
    }
    role
    location
    ...ProfilePictureFields
    ...ViewProfileButtonFields
  }
  ${ProfilePictureFieldsFragmentDoc}
  ${ViewProfileButtonFieldsFragmentDoc}
`

export type MemberCardProps = {
  user: MemberCardFieldsFragment
  className?: string
  showBook?: boolean
  showMessage?: boolean
  hideBadge?: boolean
  loading?: boolean
}
const MemberCard: VFC<MemberCardProps> = ({
  user,
  className,
  showBook,
  showMessage,
  hideBadge,
  loading,
}) => {
  const { currentGroup } = useCurrentGroup()
  const { formatMessage } = useIntl()
  const { query, asPath, push } = useRouter()

  // @TODO: what is this for??
  useEffect(() => {
    if (query.open) {
      push(asPath.split('?')[0], undefined, {
        shallow: true,
      })
    }
  }, [])

  if (!currentGroup || !user) return null

  return (
    <div className={className} data-testid="member-card">
      <div
        className={classNames(
          'relative flex flex-col',
          'bg-white text-black text-center',
          'justify-evenly rounded overflow-hidden h-full break-words',
          'p-1/12'
        )}
      >
        <div className="flex-0 w-10/12 mx-auto pt-2">
          <div className="w-11/12 mx-auto pt-full relative">
            <span className="absolute top-0 bottom-0 left-0 right-0">
              {loading ? (
                <Skeleton circle className="h-full" />
              ) : (
                <ProfilePicture user={user} hideBadge={hideBadge} asAvatar />
              )}
            </span>
          </div>
          <div className="mt-6 font-bold text-xl">
            {loading ? <Skeleton /> : user.name}
          </div>
          <div className="h-auto">
            {loading ? (
              <Skeleton />
            ) : (
              user.disciplines.map((d) => d.name).join(', ') || <>&nbsp;</>
            )}
          </div>
        </div>

        <span className="flex flex-1 flex-col justify-evenly space-y-6">
          <div className="flex flex-1 justify-center items-center italic">
            {loading ? <Skeleton /> : user?.role}
          </div>
          {loading ? (
            <Skeleton />
          ) : (
            user.location && <UserLocation>{user.location}</UserLocation>
          )}
        </span>

        <div className="flex flex-col items-center text-center justify-items-center content-center mt-6 mb-1">
          {loading ? (
            <Skeleton
              borderRadius="999px"
              width="12rem"
              className="px-8 h-12"
            />
          ) : (
            user.mentor &&
            showBook && <BookButton mentor={user} variant="secondary" />
          )}
          <ViewProfileButton user={user} />
          {showMessage && (
            <Feature id="messaging">
              {loading ? (
                <Skeleton />
              ) : (
                <MessageUser userId={user.id}>
                  <ButtonRow
                    testId="message-user-link"
                    icon={<MessageCircle />}
                  >
                    {formatMessage(
                      { id: 'button.messageUser' },
                      { user: firstName(user.name) }
                    )}
                  </ButtonRow>
                </MessageUser>
              )}
            </Feature>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemberCard
