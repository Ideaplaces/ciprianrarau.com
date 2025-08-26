import classNames from 'classnames'
import Pill from 'components/display/Pill'
import Input from 'components/Input'
import { NumberParam, useQueryParam } from 'lib/next-query-params'
import { useRouter } from 'lib/router'
import { event } from 'nextjs-google-analytics'
import { ChangeEvent, KeyboardEvent, useEffect, useState, VFC } from 'react'
import { Search as SearchIcon, X } from 'react-feather'
import { useIntl } from 'react-intl'

// @TODO: enable setTimeout and have search perform automatically
// after users pauses in typing
export type SearchProps = {
  className?: string
  searchTerm?: string
  placeholder?: string
  collapsed?: boolean
  onSearch?: (props?: any) => void
  onChange?: (props?: any) => void
}

const Search: VFC<SearchProps> = ({
  className,
  searchTerm,
  placeholder,
  collapsed,
  onSearch,
}) => {
  const [value, setValue] = useState(searchTerm)
  const [expanded, setExpanded] = useState(!collapsed)
  const [_, setPage] = useQueryParam('page', NumberParam)
  const { asPath } = useRouter()

  useEffect(() => {
    setValue(searchTerm)
  }, [searchTerm])

  const performSearch = (value: string) => {
    if (asPath.includes('members') || asPath.includes('mentors')) {
      event('Member Search', {
        category: 'Search',
        label: `searched for: "${value}"`,
      })
    }
    setPage(undefined)
    onSearch && onSearch(value)
    setExpanded(!collapsed)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value)
  }

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch && e.preventDefault()
      e.currentTarget.value && performSearch(e.currentTarget.value)
    }
  }

  const onCancelClick = () => {
    setValue(undefined)
    onSearch && onSearch(undefined)
  }

  const { formatMessage } = useIntl()

  return (
    <div
      className={classNames('w-full relative', !expanded && 'flex', className)}
    >
      {expanded ? (
        <Input
          placeholder={placeholder || formatMessage({ id: 'term.search' })}
          value={value || ''}
          testId="search-input"
          onChange={onChange}
          onKeyPress={onKeyPress}
          border
        />
      ) : (
        searchTerm && (
          <Pill
            className="mx-2 order-2 flex space-x-1 items-center"
            color="gray"
          >
            <p>{searchTerm}</p>
            <Close onClick={onCancelClick} className="w-3 h-3" />
          </Pill>
        )
      )}
      <div
        className={`${
          expanded ? 'absolute right-0 inset-y-0 mr-4' : 'relative'
        } flex space-x-2`}
      >
        {expanded && (searchTerm || value) && <Close onClick={onCancelClick} />}
        <button
          data-testid="search-button"
          onClick={() =>
            expanded && value ? performSearch(value) : setExpanded(true)
          }
          type="button"
        >
          <SearchIcon color={expanded ? '#999' : '#000'} />
        </button>
      </div>
    </div>
  )
}
type CloseProps = {
  onClick: (props: any) => void
  className?: string
  color?: string
}
const Close: VFC<CloseProps> = ({
  onClick,
  className = 'w-4 h-4',
  color = '#999',
}) => (
  <button onClick={onClick} type="button" data-testid="cancel-search">
    <X className={className} color={color} />
  </button>
)

export default Search
