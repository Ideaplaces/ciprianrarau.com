import { gql } from '@apollo/client'
import DashboardLayout from 'components/Dashboard/Layout'
import TypedQuery from 'components/Graphql/TypedQuery'
import BankingInfo from 'components/Personal/Payments/BankingInfo'
import CancellationPolicy from 'components/Personal/Payments/CancellationPolicy'
import InvoiceList from 'components/Personal/Payments/InvoiceList'
import PaymentInfo from 'components/Personal/Payments/PaymentInfo'
import SessionRates from 'components/Personal/Payments/SessionRates'
import { connectServerSideProps } from 'lib/ssg'
import { useCurrentUser } from 'lib/UserContext'
import {
  useViewerStripeInfoQuery,
  ViewerStripeInfoQuery,
  ViewerStripeInfoQueryVariables,
} from 'types/graphql'

gql`
  query viewerStripeInfo {
    viewer {
      id
      stripeCustomer {
        id
        cvcPassed
        expMonth
        expYear
        lastFour
      }
      stripeAccount {
        id
      }
      stripeAccountLink
    }
  }
`

const Payments = () => {
  const { currentUser } = useCurrentUser()
  return (
    <TypedQuery<ViewerStripeInfoQueryVariables>
      typedQuery={useViewerStripeInfoQuery}
    >
      {({ viewer }: ViewerStripeInfoQuery) => (
        <div className="max-w-3xl">
          <PaymentInfo stripeCustomer={viewer?.stripeCustomer} />
          <InvoiceList />
          {currentUser?.mentor && (
            <>
              {viewer && <BankingInfo user={viewer} />}
              <SessionRates />
              <CancellationPolicy />
            </>
          )}
        </div>
      )}
    </TypedQuery>
  )
}

Payments.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Payments)
export default Payments
