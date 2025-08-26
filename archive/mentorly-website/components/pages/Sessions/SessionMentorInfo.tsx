import { gql } from '@apollo/client'
import { ButtonLink } from 'components/Button'
import Avatar from 'components/display/Avatar'
import SocialIcon from 'components/icons/SocialIcon'
import { useCurrentGroup } from 'lib/GroupContext'
import { memberUrl } from 'lib/urls'
import Link from 'next/link'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import {
  AvatarFieldsFragmentDoc,
  Maybe,
  MentorDetailsFieldsFragment,
  SocialLink,
} from 'types/graphql'

gql`
  fragment MentorDetailsFields on User {
    id
    slug
    name
    role
    avatar {
      ...AvatarFields
    }
    location
    socialLinks {
      url
      type
    }
  }
  ${AvatarFieldsFragmentDoc}
`

type SessionMentorInfoProps = {
  mentor?: Maybe<MentorDetailsFieldsFragment>
}

const SessionMentorInfo: FC<SessionMentorInfoProps> = ({ mentor }) => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()

  if (!mentor) return null

  return (
    <div
      id="sidePanel"
      className="container flex flex-col sm:flex-row items-start justify-center md:flex-col space-x-0 sm:space-x-12 md:space-x-0"
    >
      <div className="w-5/12 sm:w-4/12 md:w-2/5 mx-auto">
        <Avatar
          className="rounded-full overflow-hidden mb-4 mx-auto"
          size="lg"
          {...mentor.avatar}
        />
      </div>
      <div
        id="mentor-profile"
        className="w-full sm:w-2/3 md:w-full mb-4 mx-auto"
      >
        <div className="mb-4 text-center sm:text-left md:text-center">
          <Link
            href={`/${locale}${memberUrl(
              currentGroup,
              mentor.slug || mentor.id
            )}`}
          >
            <a>
              <h1 className="font-bold">{mentor.name}</h1>
            </a>
          </Link>
          {mentor.role && <h2>{mentor.role}</h2>}
          {mentor.location && mentor.location}
          {mentor.socialLinks && (
            <div className="my-6 flex space-x-2 justify-center sm:justify-start md:justify-center">
              <ListSocialLinks list={mentor.socialLinks} />
            </div>
          )}
          <Link
            href={`/${locale}${memberUrl(
              currentGroup,
              mentor.slug || mentor.id
            )}`}
            passHref
          >
            <ButtonLink variant="secondary">
              {formatMessage({ id: 'menu.viewProfile' })}
            </ButtonLink>
          </Link>
        </div>
      </div>
    </div>
  )
}

// @TODO: this is copied from mentor/[id]/index
// should separate into reusable component
type ListSocialLinksProps = {
  list: SocialLink[]
}
const ListSocialLinks: FC<ListSocialLinksProps> = ({ list }) => (
  <>
    {list.map((link) => {
      if (!link.url || link.url === '') return false
      const type = link.type.replace('_link', '')
      return (
        <a href={link.url} target="_blank" key={type} rel="noreferrer">
          <SocialIcon type={type} />
        </a>
      )
    })}
  </>
)

export default SessionMentorInfo
