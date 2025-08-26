import classNames from 'classnames'
import { FormContext } from 'components/controls/Form'
import Dropdown from 'components/Dropdown/Dropdown'
import ErrorBoundary from 'components/ErrorBoundary'
import { DecodedValueMap } from 'lib/next-query-params'
import useClickOutside from 'lib/useClickOutside'
import { isEqual, kebabCase, last, omit, startCase } from 'lodash'
import { FC, useContext } from 'react'
import { Check, ChevronDown, X } from 'react-feather'
import { useIntl } from 'react-intl'
import { Maybe } from 'types/graphql'

type Query = DecodedValueMap<{ [x: string]: any }>

export const showReset = (query: Query) =>
  Object.values(omit(query, 'page', 'orderBy')).some(Boolean)

export const changeFilter = (query: Query, filter: string, value: any) => {
  const newParams = {
    ...query,
    [filter]: value,
    page: filter == 'page' ? value : undefined,
  }
  return newParams
}

type ResetFiltersProps = {
  onClick: () => void
}
export const ResetFilters: FC<ResetFiltersProps> = ({ onClick }) => {
  const { formatMessage } = useIntl()

  return (
    <button
      className="flex items-center rounded text-sm bg-lightGray hover:bg-gray p-2"
      onClick={onClick}
    >
      {formatMessage({ id: 'term.reset' })}
      <X className="ml-2" size={16} />
    </button>
  )
}

const fieldLabel = (formId: string, name: string) => {
  const shortName = last(name.split('Id')[0].split('.'))

  return [`form.${formId}.${shortName}`, `form.${shortName}`]
}

export type FilterOption = {
  // sometimes options have nameId, other times it's just name?
  name?: string
  nameId?: string
  id?: string | number | boolean | Record<string, any>
}
type TriggerProps = {
  name: string
  option: FilterOption
  onClick: () => void
  disabled: boolean
  testId?: string
}

const Trigger: FC<TriggerProps> = ({
  name,
  option,
  onClick,
  disabled,
  testId,
}) => {
  // @TODO: DRY up logic repeated in Field as well
  const { formatMessage, messages } = useIntl()
  const { id: formId } = useContext(FormContext) || { id: undefined }
  const [messageId, shortMessageId] = fieldLabel(formId, name)

  const labelText = formatMessage({
    id: messages[messageId] ? messageId : shortMessageId,
    defaultMessage: startCase(name),
  })

  return (
    <button
      type="button"
      className={classNames(
        'flex items-center rounded text-sm bg-lightGray hover:bg-gray p-2 whitespace-nowrap',
        { 'bg-mediumGray hover:bg-mediumGray cursor-not-allowed': disabled }
      )}
      data-testid={testId || `${name}-filter`}
      onClick={onClick}
      disabled={disabled}
    >
      {labelText || name} {': '}
      {option ? (
        <OptionName option={option} />
      ) : (
        `${formatMessage({ id: 'term.all' })}`
      )}
      <ChevronDown className="ml-2" size={16} />
    </button>
  )
}

type MenuProps = {
  close: () => void
  onSelectClick: (props?: any) => void
  options: FilterOption[]
  selection?: Maybe<string | number | boolean | Record<string, any>>
}
const Menu: FC<MenuProps> = ({ close, onSelectClick, options, selection }) => {
  const ref = useClickOutside<HTMLDivElement>(close)

  return (
    <div
      ref={ref}
      //@TODO: add class right-0 if Filter is on far half of screen
      className="absolute bg-white rounded border-mediumGray shadow-lg border mt-1 min-w-full z-10 overflow-scroll max-h-[80vh]"
    >
      {options.map((option) => {
        return (
          <MenuOption
            key={option.id?.toString()}
            option={option}
            onSelectClick={onSelectClick}
            selected={isEqual(option.id, selection)}
            close={close}
          />
        )
      })}
    </div>
  )
}

const OptionName = ({ option }: { option: FilterOption }) => {
  const { formatMessage } = useIntl()

  if (option.name) {
    return <>{option.name}</>
  }

  if (option.nameId) {
    return <>{formatMessage({ id: option.nameId })}</>
  }

  return <>{'None'}</>
}

type MenuOptionType = {
  close: () => void
  onSelectClick: (props?: any) => void
  option: FilterOption
  selected?: boolean
}

const MenuOption: FC<MenuOptionType> = ({
  close,
  onSelectClick,
  option,
  selected,
}) => {
  const onClick = () => {
    if (selected) {
      onSelectClick(null)
    } else {
      onSelectClick(option.id)
    }
    close()
  }

  return (
    <button
      key={option.id?.toString()}
      data-testid={`${kebabCase(option.name) || option.id}-dropdown-button`}
      className="flex items-center justify-start text-left text-sm pl-2 pr-6 py-2 w-full whitespace-nowrap hover:bg-gray focus:outline-none max-w-[80vw]"
      onClick={onClick}
    >
      <div className="w-5">{selected ? <Check size={16} /> : undefined}</div>
      <p className="flex-1 truncate">
        <OptionName option={option} />
      </p>
    </button>
  )
}

type FiltersType = {
  name: string
  testId?: string
  options: FilterOption[]
  selection?: Maybe<string | number | boolean | Record<string, any>>
  setSelection: (value?: any) => void
  setPage?: (value?: any) => void
  className?: string
  disabled?: boolean
}
const Filters: FC<FiltersType> = ({
  name,
  testId = undefined,
  options,
  selection,
  setSelection,
  setPage = undefined,
  className = '',
  disabled = false,
}) => {
  if (!options || options.length < 1) {
    return null
  }

  const onSelectClick = (id: string) => {
    setPage && setPage(1)
    setSelection(id)
  }

  const option = options.find((o) => isEqual(o.id, selection)) as FilterOption

  return (
    <ErrorBoundary>
      <Dropdown
        className={className}
        trigger={({ toggle }: { toggle: any }) => (
          <Trigger
            name={name}
            option={option}
            testId={testId}
            onClick={toggle}
            disabled={disabled}
          />
        )}
      >
        {({ close }: { close: any }) => (
          <Menu
            options={options}
            close={close}
            onSelectClick={onSelectClick}
            selection={selection}
          />
        )}
      </Dropdown>
    </ErrorBoundary>
  )
}

export default Filters
