import { MutationHookOptions, MutationTuple } from '@apollo/client'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

import EditCohortButton from './EditCohortButton'

type TableProps = {
  data: Record<string, any>[]
  typedMutation: (
    baseOptions?: MutationHookOptions<any, any>
  ) => MutationTuple<any, any, any, any>
}

const Table: VFC<TableProps> = ({ data, typedMutation }) => {
  const { formatMessage } = useIntl()

  return (
    <div className="my-2">
      <table className="w-full">
        <tbody>
          <tr>
            <th className="text-left">{formatMessage({ id: 'term.name' })}</th>
            <th>&nbsp;</th>
          </tr>
          {data.map((row: any) => (
            <TableRow key={row.id} typedMutation={typedMutation} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

type TableRowProps = {
  typedMutation: (
    baseOptions?: MutationHookOptions<any, any>
  ) => MutationTuple<any, any, any, any>
  row: Record<string, any>
}
const TableRow: VFC<TableRowProps> = ({ typedMutation, row }) => {
  return (
    <tr>
      <td className="w-1/2 py-2 break-all">{row.nameEn || row.name}</td>
      <td className="">
        <div className="flex justify-end">
          <EditCohortButton typedMutation={typedMutation} row={row} />
        </div>
      </td>
    </tr>
  )
}

export default Table
