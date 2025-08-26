import PlainPanel from 'components/display/Panel'
import HomePanel from 'components/Panel/Panel'
import { useCurrentGroup } from 'lib/GroupContext'
import { FC, ReactNode } from 'react'

type PanelProps = {
  children: ReactNode
}
const Panel: FC<PanelProps> = ({ children }) => {
  const { currentGroup, loading } = useCurrentGroup()

  if (loading) {
    return null
  }

  if (currentGroup) {
    return (
      <PlainPanel
        style={{
          backgroundColor: currentGroup?.styles?.backgroundColor || '#fdde35',
        }}
        className="pt-20 min-h-screen-minus-navbar"
      >
        {children}
      </PlainPanel>
    )
  }

  return (
    <HomePanel
      className="min-h-screen-minus-navbar"
      color="yellow"
      style={{
        backgroundImage: 'url(/images/faq-leaves.png)',
        backgroundSize: 'cover',
      }}
    >
      {children}
    </HomePanel>
  )
}

export default Panel
