import { VFC } from 'react'
import { Users } from 'react-feather'

export type UserCountProps = {
  count: number | string
}

const UserCount: VFC<UserCountProps> = ({ count }) => (
  <span className="flex items-center border border-darkGray bg-white rounded-full space-x-1 px-2">
    <Users size={14} />
    <p className="text-sm">{count}</p>
  </span>
)

export default UserCount
