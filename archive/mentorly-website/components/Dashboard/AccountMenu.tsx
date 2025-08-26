import classNames from 'classnames'
import Select, { SelectOption } from 'components/controls/ReactSelect'
import { useCurrentGroup } from 'lib/GroupContext'
import { groupDomain } from 'lib/urls'
import { useCurrentUser } from 'lib/UserContext'
import { useMemo, VFC } from 'react'
import { useIntl } from 'react-intl'
import { ActionMeta, SingleValue } from 'react-select'
import { Account } from 'types/graphql'

// Custom component for the group option in the dropdown
const GroupOption = ({ innerProps, data, isFocused }: any) => (
  <div
    {...innerProps}
    className={classNames('px-4 py-1 block hover:bg-gray cursor-pointer', {
      'bg-gray': isFocused,
    })}
  >
    {data.label}
  </div>
)

// Custom component to group options by account
const GroupHeading = ({ data }: any) => (
  <div className="font-bold px-4 py-1">{data.label}</div>
)

// Format accounts and groups into a structure for react-select
const formatOptionsForSelect = (accounts: Account[]) => {
  return accounts.map((account) => ({
    label: account.name,
    options: account.groups.map((group) => ({
      value: group.id,
      label: group.name,
      slug: group.slug,
      // Add account name to each option for filtering
      accountName: account.name,
    })),
  }))
}

// Custom filter function that checks both group name and account name
const filterOption = (option: any, inputValue: string) => {
  if (!inputValue) return true

  const input = inputValue.toLowerCase()

  // Check if either group name or account name matches the input
  return (
    option.label?.toLowerCase().includes(input) ||
    option.data?.accountName?.toLowerCase().includes(input)
  )
}

const AccountMenu: VFC = () => {
  const { loading, currentUser } = useCurrentUser()
  const { currentGroup } = useCurrentGroup()
  const { locale } = useIntl()

  // Format the options for the select component
  const options = useMemo(
    () => formatOptionsForSelect(currentUser.accounts),
    [currentUser.accounts]
  )

  // Find the currently selected option based on currentGroup.id
  const selectedOption = useMemo(() => {
    if (!currentGroup || !options) return null

    for (const accountGroup of options) {
      const foundOption = accountGroup.options.find(
        (option) => option.value === currentGroup.id
      )
      if (foundOption) {
        return foundOption
      }
    }
    return null
  }, [options, currentGroup])

  if (loading || !currentUser) {
    return null
  }

  const handleGroupSelect = (
    newValue: SingleValue<SelectOption>,
    _actionMeta: ActionMeta<SelectOption>
  ) => {
    if (newValue && 'slug' in newValue && typeof newValue.slug === 'string') {
      window.location.href = `${groupDomain(newValue.slug)}/${locale}/dashboard`
    } else {
      console.warn('Invalid selection in AccountMenu', newValue)
    }
  }

  return (
    <div className="w-full">
      <Select
        isSearchable
        options={options}
        onChange={handleGroupSelect}
        placeholder=""
        formatGroupLabel={(data) => data.label}
        formatOptionLabel={(data) => data.label}
        value={selectedOption}
        openMenuOnFocus
        menuPlacement="bottom"
        backspaceRemovesValue={false}
        tabSelectsValue={false}
        borderless={false}
        className="font-bold text-lg"
        components={{
          Option: GroupOption,
          GroupHeading: GroupHeading,
        }}
        filterOption={filterOption}
      />
    </div>
  )
}

export default AccountMenu
