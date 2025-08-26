import IconPill from 'components/display/IconPill'
import UserList from 'components/display/UserList'
import UserPill from 'components/display/UserPill'
import Modal from 'components/Modal'
import { isEmpty } from 'lodash'
import { FC, useState } from 'react'
import { Users } from 'react-feather'
import { User } from 'types/graphql'

import FilterPills from './FilterPills'

type SelectedUsersType = {
  selectedUsers?: User[]
  userIds?: string[]
  handleRemove?: (user: Pick<User, 'id'>) => void
  readOnly?: boolean
  filters?: any
  isMulti?: boolean
  limit?: number
}
const SelectedUsers: FC<SelectedUsersType> = ({
  selectedUsers,
  userIds,
  handleRemove,
  readOnly,
  filters,
  isMulti,
  limit,
}) => {
  const [showUserListModal, setShowUserListModal] = useState(false)

  const isFiltering = !isEmpty(filters) && isEmpty(userIds)

  if ((!selectedUsers || selectedUsers.length === 0) && !isFiltering) {
    return null
  }

  if (!isFiltering && selectedUsers && userIds && limit) {
    const users = isMulti
      ? selectedUsers?.slice(-limit).reverse()
      : [selectedUsers]

    const overlimit = users.length - limit

    const text = `${
      (limit > 0 && '...plus ') +
      overlimit.toString() +
      (limit === 0 ? ' recipients' : ' more')
    }`

    return (
      <>
        {isMulti && (
          <Modal
            width="md"
            open={showUserListModal}
            close={() => setShowUserListModal(false)}
          >
            <UserList
              participantIds={userIds}
              onRemove={readOnly ? undefined : handleRemove}
            />
          </Modal>
        )}
        <>
          {users?.map((m: any) => (
            <UserPill
              key={m.id}
              user={m}
              onRemove={isFiltering ? undefined : handleRemove}
            />
          ))}
        </>
        {overlimit > 0 && (
          <IconPill
            icon={Users}
            text={text}
            onClick={() => setShowUserListModal(true)}
          />
        )}
      </>
    )
  }

  return <FilterPills filters={filters} readOnly={readOnly} />
}

export default SelectedUsers
