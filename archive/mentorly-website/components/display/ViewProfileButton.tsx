import gql from 'graphql-tag'
import { useCurrentGroup } from 'lib/GroupContext'
import { memberUrl } from 'lib/urls'
import Link from 'next/link'
import { VFC } from 'react'
import { ArrowRight } from 'react-feather'
import { useIntl } from 'react-intl'
import { User, ViewProfileButtonFieldsFragment } from 'types/graphql'

gql`
  fragment ViewProfileButtonFields on User {
    id
    slug
    mentor
  }
`

type ViewProfileButtonProps = {
  user: ViewProfileButtonFieldsFragment
}

const ViewProfileButton: VFC<ViewProfileButtonProps> = ({ user }) => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  return (
    <Link
      href={`/${locale}${memberUrl(
        currentGroup,
        user?.slug || user.id,
        user as User
      )}`}
    >
      <a data-testid="view-profile-button">
        <div className="flex items-center whitespace-nowrap border-2 border-black rounded-full space-x-2 px-4 py-2 p-1 mt-2">
          <p className="whitespace-nowrap font-bold">
            {formatMessage({ id: 'menu.viewProfile' })}
          </p>
          <ArrowRight size={16} />
        </div>
      </a>
    </Link>
  )
}

export default ViewProfileButton
