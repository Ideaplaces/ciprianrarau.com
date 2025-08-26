import classNames from 'classnames'
import { pick } from 'lodash'
import { LegacyRef, VFC } from 'react'
import { CSVLink as ReactCSVLink } from 'react-csv'
// eslint-disable-next-line import/no-unresolved
import Link, { LinkProps } from 'react-csv/components/Link'
import { Download } from 'react-feather'

export type CSVLinkProps = LinkProps & {
  className?: string
  ref?: LegacyRef<Link>
}

const CSVLink: VFC<CSVLinkProps> = ({ className, data, headers, ...props }) => {
  const keys = headers?.map((header) =>
    typeof header === 'string' ? header : header.key
  )

  if (!keys) {
    console.error('error rendering keys in CSVLink component')
    return null
  }

  const csvData = Array.isArray(data) ? data.map((r) => pick(r, keys)) : data

  return (
    <ReactCSVLink
      className={classNames('p-2 rounded hover:bg-lightGray', className)}
      data={csvData}
      headers={headers}
      {...props}
    >
      <Download />
    </ReactCSVLink>
  )
}

export default CSVLink
