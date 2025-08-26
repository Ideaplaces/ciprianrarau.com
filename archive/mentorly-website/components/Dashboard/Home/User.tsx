import Link from 'next/link'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { Maybe } from 'types/graphql'

type UserProps = {
  user?: Maybe<{
    id: string
    name: string
  }>
}

const User: VFC<UserProps> = ({ user }) => {
  const { locale, formatMessage } = useIntl()

  if (!user) {
    return (
      <span className="font-black line-through whitespace-nowrap strikeout">
        {formatMessage({ id: 'error.userDeleted' })}
      </span>
    )
  }

  return (
    <Link href={`/${locale}/dashboard/members/${user.id}`}>
      <a className="font-black hover:underline whitespace-no-wrap">
        {user.name}
      </a>
    </Link>
  )
}

export default User
