import LoginForm from 'components/Forms/Login/Login'
import { firstName } from 'lib/firstName'
import { useCurrentUser } from 'lib/UserContext'
import { FC } from 'react'
import { useIntl } from 'react-intl'

// @TODO: enable signup form to include sign-in and social accounts
// @TODO: enable payment
const UserPanel: FC = () => {
  const { currentUser } = useCurrentUser()
  const { formatMessage } = useIntl()

  if (currentUser) {
    return (
      <div className="w-auto md:w-5/12">
        <div className="font-black text-lg mb-4">
          {' '}
          {formatMessage({ id: 'header.confirmDetails' })}
        </div>
        <div>
          {formatMessage(
            { id: 'text.bookingAlmostDone' },
            { name: firstName(currentUser.name) }
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-auto md:w-5/12">
      <div className="pb-4 mb-4 border-b border-darkerGray">
        {formatMessage({ id: 'button.signIn' })}
      </div>
      <LoginForm noredirect />
    </div>
  )
}
export default UserPanel
