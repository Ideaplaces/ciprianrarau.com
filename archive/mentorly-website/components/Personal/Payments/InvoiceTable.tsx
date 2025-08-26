import FormatDateTime from 'components/general/DateTime'
import React, { FC } from 'react'
import { Download } from 'react-feather'
import { FormattedNumber, useIntl } from 'react-intl'

type Invoice = {
  id: string
  invoicePdf: string
  number: string
  created: string
  status: string
  amountPaid: number
  currency: string
}

type InvoiceTableProps = {
  invoices: Invoice[]
  totalPages: number
  firstPage: boolean
  lastPage: boolean
  page: number
  decreasePagePagination: () => void
  increasePagePagination: () => void
}

const InvoiceTable: FC<InvoiceTableProps> = ({
  invoices,
  totalPages,
  firstPage,
  lastPage,
  page,
  decreasePagePagination,
  increasePagePagination,
}) => {
  const { formatMessage } = useIntl()

  const handleStatus = (status: string) => {
    // draft, open, paid, uncollectible, or void
    switch (status) {
      case 'Draft':
        return formatMessage({ id: 'invoices.draft' })
      case 'Open':
        return formatMessage({ id: 'invoices.open' })
      case 'Paid':
        return formatMessage({ id: 'invoices.paid' })
      case 'Uncollectible':
        return formatMessage({ id: 'invoices.uncollectible' })
      case 'Void':
        return formatMessage({ id: 'invoices.void' })
      default:
        return status
    }
  }

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
              scope="col"
            >
              {formatMessage({ id: 'invoices.invoiceNumber' })}
            </th>
            <th
              className="hidden md:block bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
              scope="col"
            >
              Date
            </th>
            <th
              className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
              scope="col"
            >
              {formatMessage({ id: 'invoices.invoiceStatus' })}
            </th>
            <th
              className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
              scope="col"
            >
              {formatMessage({ id: 'invoices.invoiceAmount' })}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {invoices.map(
            ({
              id,
              invoicePdf,
              number,
              created,
              status,
              amountPaid,
              currency,
            }) => (
              <tr className="bg-white" key={id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 hover:text-gray-900">
                  <div className="flex">
                    <a
                      href={invoicePdf}
                      className="inline-flex space-x-2 truncate text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="pr-1">{number}</span>
                      <Download size={16} />
                    </a>
                  </div>
                </td>
                <td className="hidden md:block whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <FormatDateTime date={created} format="date.fullDate" />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {handleStatus(status)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <FormattedNumber
                    value={amountPaid / 100}
                    style="currency"
                    currency={currency}
                  />
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Page <span className="font-semibold">{page}</span>{' '}
              {formatMessage({ id: 'invoices.of' })}{' '}
              <span className="font-semibold">{totalPages}</span>
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            {!firstPage && (
              <button
                className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none"
                onClick={decreasePagePagination}
              >
                {formatMessage({ id: 'invoices.previous' })}
              </button>
            )}
            {!lastPage && (
              <button
                className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none"
                onClick={increasePagePagination}
              >
                {formatMessage({ id: 'invoices.next' })}
              </button>
            )}
          </div>
        </nav>
      )}
    </>
  )
}

export default InvoiceTable
