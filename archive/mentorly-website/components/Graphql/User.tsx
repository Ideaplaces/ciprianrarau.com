import {
  useCurrentFullUserQuery,
  CurrentFullUserQuery,
  Maybe,
} from 'types/graphql'
import Alert from 'components/feedback/Alert'
import Spinner from 'components/feedback/Spinner'
import { useCurrentUser } from 'lib/UserContext'
import { FC, ReactElement } from 'react'

type UserProps = {
  children: (
    user: CurrentFullUserQuery['viewer'],
    disciplines: CurrentFullUserQuery['disciplines'],
    refetch: () => void
  ) => Maybe<ReactElement>
}

const User: FC<UserProps> = ({ children }) => {
  const { currentUser } = useCurrentUser()

  const { loading, error, data, refetch } = useCurrentFullUserQuery({
    skip: !currentUser,
  })

  if (error) {
    return (
      <Alert title="Error" description={error.message} type="error" showIcon />
    )
  }

  if (loading) {
    return <Spinner className="w-8" />
  }

  if (!data) {
    return null
  }

  const { viewer: user, disciplines } = data

  if (!user) {
    return (
      <Alert
        title="Error"
        description="This user does not exist"
        type="error"
        className="w-10/12 mt-1/12 mx-auto"
        showIcon
      />
    )
  }

  return children(user, disciplines, refetch)
}

export default User
