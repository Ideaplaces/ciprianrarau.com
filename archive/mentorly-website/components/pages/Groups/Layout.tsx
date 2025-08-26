import Spinner from 'components/feedback/Spinner'
import Footer from 'components/Footer'
import Header from 'components/Header/Header'
import { useCurrentGroup } from 'lib/GroupContext'
import { groupMenu } from 'lib/groupMenu'
import { ReactNode, VFC } from 'react'

import MetaHeader from './MetaHeader'

const Loading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Spinner />
    </div>
  )
}

const NotFound = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <h1 className="text-4xl font-black">Not found</h1>
    </div>
  )
}

type LayoutProps = {
  children: ReactNode
}

const Layout: VFC<LayoutProps> = ({ children }) => {
  const { currentGroup, loading } = useCurrentGroup()

  if (loading) {
    return <Loading />
  }

  if (!currentGroup) {
    return <NotFound />
  }

  return (
    <>
      <MetaHeader group={currentGroup} />
      <div className="flex flex-col min-h-screen">
        <Header group={currentGroup} data={groupMenu(currentGroup)} />
        <div
          style={{ fontFamily: currentGroup.styles?.fontName || 'sans-serif' }}
          className="flex flex-1 z-0"
        >
          {children}
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Layout
