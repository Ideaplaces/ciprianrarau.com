import BrowserWarning from 'components/statusPage/BrowserWarning'
import useIsIE from 'lib/hooks/useIsIE'
import { FC, ReactNode } from 'react'

export type IESupportProps = {
  children: ReactNode
}

const IESupport: FC<IESupportProps> = ({ children }) => {
  const renderMessage = useIsIE()

  if (renderMessage) {
    return <BrowserWarning />
  }

  return <>{children}</>
}

export default IESupport
