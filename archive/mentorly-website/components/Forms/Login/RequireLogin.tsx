import { handleChildren } from 'components/Generic/util'
import { useModal } from 'components/Modal/ModalContext'
import { useCurrentUser } from 'lib/UserContext'
import { FC, ReactElement } from 'react'
import { useIntl } from 'react-intl'

import Login from './Login'

type RequireLoginProps = {
  children: ReactElement
  whenLoggedIn: () => void
}

const RequireLogin: FC<RequireLoginProps> = ({ children, whenLoggedIn }) => {
  const { currentUser } = useCurrentUser()
  const { formatMessage } = useIntl()
  const { showModal, hideModal } = useModal()

  if (currentUser) return handleChildren(children, { onClick: whenLoggedIn })

  const afterLogin = () => {
    hideModal()
    whenLoggedIn()
  }

  return (
    <>
      {handleChildren(children, {
        onClick: () =>
          showModal({
            content: (
              <>
                <div className="mb-12">
                  <h1 className="text-4xl">
                    {formatMessage({ id: 'menu.signIn' })}
                  </h1>
                </div>
                <Login afterLogin={afterLogin} noredirect />
              </>
            ),
          }),
      })}
    </>
  )
}

export default RequireLogin
