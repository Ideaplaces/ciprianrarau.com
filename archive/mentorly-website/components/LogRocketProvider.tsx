import { useCurrentUser } from 'lib/UserContext'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import { useEffect } from 'react'

type LogRocketProviderProps = {
  appID?: string
}

const LogRocketProvider: React.FC<LogRocketProviderProps> = ({ appID }) => {
  const { currentUser }: any = useCurrentUser()

  useEffect(() => {
    if (appID) {
      try {
        LogRocket.init(appID)
        setupLogRocketReact(LogRocket)
      } catch (_e) {
        // do nothing
      }
    }
  }, [appID])

  useEffect(() => {
    if (currentUser) {
      LogRocket.identify(currentUser.id, {
        name: currentUser.name,
        email: currentUser.email,
      })
    }
  }, [currentUser && currentUser.id])

  return null
}

export default LogRocketProvider
