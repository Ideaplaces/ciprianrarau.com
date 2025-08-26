import classNames from 'classnames'
import { compact, uniq } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { Search } from 'react-feather'
import { useIntl } from 'react-intl'
import { User } from 'types/graphql'

import MemberList from './MemberList'
import SelectedUsers from './SelectedUsers'

const MemberSearchList = ({ omitIds = [], ...props }) => {
  const {
    showDefaultUsers,
    className,
    searchbarClassNames,
    readOnly,
    query,
    setQuery,
    value,
    title,
    inline,
    borderless,
    type,
    onValueChange,
    isMulti,
    onSelect,
    onRemove,
    listInside,
    listPosition,
    filters,
    limit = 5,
    userIds = [],
  } = props
  const { formatMessage } = useIntl()
  const [selectedUsers, setSelectedUsers] = useState(value)
  const ref = useRef<HTMLInputElement>(null)

  const selectedIds = Array.isArray(selectedUsers)
    ? selectedUsers.map((u) => u?.id)
    : [selectedUsers?.id]

  const allUserIds = uniq(compact([...omitIds, ...selectedIds, ...userIds]))

  useEffect(() => {
    onValueChange && onValueChange(selectedUsers)
  }, [selectedUsers])

  useEffect(() => {
    setSelectedUsers(value)
  }, [value])

  const handleChange = ({ data }: { data: User }) => {
    const user = data
    setQuery && setQuery('')
    const userAlreadySelected =
      selectedUsers?.length > 0 &&
      selectedUsers.find((u: User) => u.id === user.id)

    if (userAlreadySelected) return null

    isMulti
      ? setSelectedUsers(
          selectedUsers?.length > 0 ? [...selectedUsers, user] : [user]
        )
      : setSelectedUsers(user)
    onSelect && onSelect(user)
    ref?.current && ref.current.focus()
  }

  const handleRemove = (data: Pick<User, 'id'>) => {
    isMulti
      ? setSelectedUsers(
          selectedUsers?.filter((v: Pick<User, 'id'>) => v.id !== data.id)
        )
      : setSelectedUsers(null)
    onRemove && onRemove(data)
  }

  const searchFor = (term: string) =>
    formatMessage({ id: 'tooltip.searchFor' }, { term: term.toLowerCase() })

  const showList = (showDefaultUsers && !query) || query

  const showSearch =
    !selectedUsers ||
    selectedUsers?.length === 0 ||
    (selectedUsers?.length > 0 && isMulti)

  return (
    <div className={classNames('w-full', className, { relative: !inline })}>
      {title && (
        <div className="mb-3 font-bold opacity-90 text-left">
          {title || searchFor(formatMessage({ id: 'menu.members' }))}
        </div>
      )}
      {!listInside && listPosition === 'TOP' && (
        <div className="flex flex-wrap mb-2" data-testid="selectedUsers">
          <SelectedUsers
            selectedUsers={selectedUsers}
            userIds={allUserIds}
            handleRemove={!readOnly ? handleRemove : undefined}
            limit={limit}
            isMulti={isMulti}
            filters={filters}
          />
        </div>
      )}
      {showSearch && (
        <div
          className={classNames(
            'group mb-2 relative flex w-full items-center',
            {
              'flex-wrap': listInside,
            },
            searchbarClassNames
          )}
        >
          {!borderless && <Search className="absolute ml-2 text-darkGray" />}
          {listInside && (
            <SelectedUsers
              selectedUsers={selectedUsers}
              userIds={allUserIds}
              handleRemove={readOnly ? undefined : handleRemove}
              isMulti={isMulti}
              limit={limit}
              filters={filters}
            />
          )}
          <input // @TODO: tailwind -> outline group when focusing
            ref={ref}
            data-testid="memberSearchListInput"
            className={classNames('p-1 h-auto flex-grow text-sm md:text-base', {
              'py-2 pl-10 pr-2 border border-darkGray rounded': !borderless,
              'focus:outline-none focus:ring-0 group-focus:ring': !!listInside,
              hidden: readOnly,
            })}
            value={query}
            onChange={(e) => setQuery && setQuery(e.currentTarget.value)}
            placeholder={
              props.placeholder || formatMessage({ id: 'form.searchForUser' })
            }
          />
        </div>
      )}
      {/* @TODO: this should be pulled outside the component */}
      {showList && (
        <>
          {type === 'matches' && (
            <div className="flex justify-between mb-3 text-sm lg:text-base">
              <div className="font-bold">
                {formatMessage({ id: 'text.topSuggestions' })}
              </div>
              <div className="font-bold">
                {formatMessage({ id: 'table.header.compatibility' })}
              </div>
            </div>
          )}
          <MemberList
            members={props.members}
            enableEmail={props.enableEmail}
            query={props.query}
            setQuery={props.setQuery}
            loading={props.loading}
            handleChange={handleChange}
            omitIds={allUserIds}
            {...props}
          />
        </>
      )}
      {!listInside && listPosition !== 'TOP' && (
        <div className="flex flex-wrap my-2" data-testid="selectedUsers">
          <SelectedUsers
            selectedUsers={selectedUsers}
            userIds={allUserIds}
            handleRemove={!readOnly ? handleRemove : undefined}
            limit={limit}
            isMulti={isMulti}
            filters={filters}
          />
        </div>
      )}
    </div>
  )
}

export default MemberSearchList
