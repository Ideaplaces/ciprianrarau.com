import classNames from 'classnames'
import { VFC } from 'react'
import { ChevronDown as DescIcon, ChevronUp as AscIcon } from 'react-feather'
import { useIntl } from 'react-intl'

type CellFormatterProps = {
  value: any
}

const CellFormatter: VFC<CellFormatterProps> = ({ value }) => {
  return value
}

type ColumnToggleProps = {
  id: string
  label: string
  onClick: (...args: any) => void
  sorting: boolean
  direction: 'ASC' | 'DESC'
  isSortable: boolean
}

const ColumnToggle: VFC<ColumnToggleProps> = ({
  id,
  label,
  onClick,
  sorting,
  direction,
  isSortable,
}) => {
  const handleClick = () => {
    onClick(id, sorting && direction === 'ASC' ? 'DESC' : 'ASC')
  }

  const Icon = direction === 'ASC' ? AscIcon : DescIcon

  return (
    <button
      className={classNames(
        'font-bold inline-flex items-center',
        !isSortable && 'cursor-default'
      )}
      onClick={isSortable ? handleClick : undefined}
    >
      {label}
      {isSortable && sorting && <Icon className="ml-1" size={16} />}
      {isSortable && !sorting && (
        <AscIcon className="ml-1" size={16} color="#cccccc" />
      )}
    </button>
  )
}

type ColumnType = {
  className?: string
  id: string
  isSortable?: boolean
  formatter?: any
  label: string
}

export type TableProps = {
  data: any[]
  columns: ColumnType[]
  onSortClick: (...args: any) => void
  sortColumn: string
  sortDirection: 'ASC' | 'DESC'
}

const Table: VFC<TableProps> = ({
  data,
  columns,
  onSortClick,
  sortColumn,
  sortDirection,
}) => {
  const { formatMessage } = useIntl()
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.id}
              className={classNames('py-3 px-4', column.className)}
            >
              <ColumnToggle
                id={column.id}
                label={formatMessage({
                  id: `term.${column.label.toLocaleLowerCase()}`,
                })}
                onClick={onSortClick}
                sorting={sortColumn === column.id}
                direction={sortDirection}
                isSortable={column.isSortable || false}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((line, i) => {
          return (
            <tr key={i}>
              {columns.map((column) => {
                const Formatter = column.formatter || CellFormatter
                return (
                  <td
                    key={column.id}
                    className={classNames(
                      'py-3 px-4 font-normal',
                      column.className
                    )}
                  >
                    <Formatter value={line[column.id]} id={line.id} />
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table
