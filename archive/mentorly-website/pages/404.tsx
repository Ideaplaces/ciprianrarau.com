import { ReactNode } from 'react'
import { useIntl } from 'react-intl'

const Custom404 = () => {
  const { formatMessage } = useIntl()

  return (
    <h1 className="text-center my-64 text-5xl font-black">
      {formatMessage({ id: 'header.pageNotFound' })}
    </h1>
  )
}

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return <div>{children}</div>
}

Custom404.Layout = Layout

export default Custom404
