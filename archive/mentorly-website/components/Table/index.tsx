import classNames from 'classnames'
import ConditionalWrapper from 'components/ConditionalWrapper'
import Spinner from 'components/feedback/Spinner'
import useFlexTable from 'lib/flexTable'
import { IndexProvider } from 'lib/IndexContext'
import { CurrentRowType } from 'lib/matching'
import { ReactElement, VFC } from 'react'
import { useIntl } from 'react-intl'
import { Maybe } from 'types/graphql'

import classes from './Table.module.scss'

type TableType = {
  options: {
    gridTemplateColumns: string
    thClassName?: string
    thWrapper?: (children: ReactElement | null) => ReactElement
    tdClassName: string
    tdWrapper: (children: ReactElement | null) => ReactElement
    noResizeHandle?: boolean
  }
  onRowClick: (...args: any) => void
  rows?: Maybe<CurrentRowType[]>
  headers: Array<{
    id: string
    name?: string
    className?: string
    noResizeHandle?: boolean
    hidden?: boolean
    colSpan?: number
    domId?: string
  }>
  loading: boolean
}

const Table: VFC<TableType> = ({
  options,
  onRowClick,
  rows,
  headers,
  loading,
}) => {
  useFlexTable()

  const { formatMessage } = useIntl()

  if (loading)
    return (
      <div className="p-4">
        <Spinner />
      </div>
    )

  return (
    <table
      className={classNames(classes.FlexTable, 'pb-0')}
      style={{ gridTemplateColumns: options.gridTemplateColumns }}
    >
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              className={classNames(
                options.thClassName,
                header.className,
                'truncate'
              )}
              colSpan={header.colSpan}
              id={header.domId}
              key={index}
            >
              <ConditionalWrapper
                condition={!!options.thWrapper}
                wrapper={options.thWrapper}
              >
                <>
                  {!header.hidden &&
                    (header.name ||
                      formatMessage({ id: `table.header.${header.id}` }))}
                </>
              </ConditionalWrapper>
              {!options.noResizeHandle && !header.noResizeHandle && (
                <span className="resize-handle"></span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows?.map(({ row }, rowIndex) => (
          <tr onClick={() => onRowClick(rowIndex)} key={rowIndex}>
            {row.map((cell, subIndex) => {
              if (!cell) {
                console.error('no cell in Table component')
                return null
              }

              const [expanded, index, matchCount] = [
                cell.props?.expanded,
                cell.props?.index,
                cell.props?.member?.allMatches?.length,
              ]

              return (
                <td
                  className={classNames(options.tdClassName, {
                    'border-none': expanded && index !== matchCount,
                    'cursor-pointer':
                      (expanded && index === 0) ||
                      (matchCount !== 0 && !expanded),
                  })}
                  key={subIndex}
                >
                  <IndexProvider data={{ rowIndex }}>
                    <ConditionalWrapper
                      condition={!!options.tdWrapper}
                      wrapper={options.tdWrapper}
                    >
                      {cell}
                    </ConditionalWrapper>
                  </IndexProvider>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
