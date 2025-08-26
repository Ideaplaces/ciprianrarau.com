import { gql } from '@apollo/client'
import DashboardLayout from 'components/Dashboard/Layout'
import Spinner from 'components/feedback/Spinner'
import InvoiceTable from 'components/Personal/Payments/InvoiceTable'
import { connectServerSideProps } from 'lib/ssg'
import { useCurrentUser } from 'lib/UserContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useDisplayInvoicesQuery } from 'types/graphql'

gql`
  query displayInvoices($page: Int) {
    viewer {
      invoiceList(page: $page) {
        invoices {
          id
          number
          created
          currency
          status
          amountPaid
          invoicePdf
        }
        pageInfo {
          totalPages
          firstPage
          lastPage
        }
      }
    }
  }
`

const InvoiceList = () => {
  const [page, setPage] = useState(1)
  const { formatMessage } = useIntl()

  const { currentUser } = useCurrentUser()

  const { error, data, loading } = useDisplayInvoicesQuery({
    variables: { page },
    skip: !currentUser,
  })

  if (error) return <div>{formatMessage({ id: 'invoices.error' })}</div>

  if (!currentUser) return null

  if (loading) {
    return <Spinner />
  }

  const invoiceList = data?.viewer?.invoiceList

  const invoices = invoiceList?.invoices || []
  const pageInfo = invoiceList?.pageInfo
  const totalPages = pageInfo?.totalPages || 1
  const firstPage = pageInfo?.firstPage || false
  const lastPage = pageInfo?.lastPage || false

  const increasePagePagination = () => {
    setPage((prevState) => Math.min(prevState + 1, totalPages))
  }

  const decreasePagePagination = () => {
    setPage((prevState) => prevState - 1)
  }

  return (
    <>
      <h2 className="font-semibold mb-2">
        {formatMessage({ id: 'invoices.invoices' })}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {formatMessage({ id: 'invoices.download' })}
      </p>
      {invoices.length > 0 ? (
        <InvoiceTable
          invoices={invoices}
          totalPages={totalPages}
          firstPage={firstPage}
          lastPage={lastPage}
          page={page}
          decreasePagePagination={decreasePagePagination}
          increasePagePagination={increasePagePagination}
        />
      ) : (
        <div className="text-center text-gray-500 mt-4">
          {formatMessage({ id: 'invoices.noInvoices' })}
        </div>
      )}
    </>
  )
}
InvoiceList.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(InvoiceList)
export default InvoiceList
