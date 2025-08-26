import { FC, ReactNode } from 'react'
import { useIntl } from 'react-intl'

export type InfoRowProps = {
  children: ReactNode
  label: string
}
const InfoRow: FC<InfoRowProps> = ({ children, label }) => {
  const { formatMessage } = useIntl()
  return (
    <tr className="flex flex-col mb-2 lg:table-row">
      <td className="font-bold pr-4 align-top">
        {formatMessage({ id: label, defaultMessage: label })}
      </td>
      <td>{children}</td>
    </tr>
  )
}

export default InfoRow
