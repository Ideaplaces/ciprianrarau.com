import { useCurrentGroup } from 'lib/GroupContext'
import { FC, ReactNode } from 'react'
import { MapPin } from 'react-feather'

export type UserLocationProps = {
  children: ReactNode
}

const UserLocation: FC<UserLocationProps> = ({ children }) => {
  const { currentGroup } = useCurrentGroup()

  const color =
    currentGroup && currentGroup.styles && currentGroup.styles.accentColor

  return (
    <div className="justify-center">
      <MapPin size={13} className="inline mb-1" color={color || 'purple'} />
      &nbsp;
      {children}
    </div>
  )
}

export default UserLocation
