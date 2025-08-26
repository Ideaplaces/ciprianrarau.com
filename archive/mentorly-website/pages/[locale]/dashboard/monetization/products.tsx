import { useQuery } from '@apollo/client'
import DashboardLayout from 'components/Dashboard/Layout'
import { MonetizationMenu } from 'components/Dashboard/Menu'
import Panel from 'components/display/Panel'
import Result from 'components/Graphql/Result'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { graphql } from 'src/gql'

const stripeProductsQueryDocument = graphql(/* GraphQL */ `
  query stripeProducts($groupId: ID!) {
    group(id: $groupId) {
      id
      account {
        id
        inAppBilling
        stripeAccount {
          id
          products {
            name
            type
            amount
            currency
          }
        }
      }
    }
  }
`)

const Product = ({ product }: any) => {
  return (
    <div className="flex align-middle">
      <div className="font-bold w-1/2">{product.name}</div>
      <div className="w-1/4">
        ${product.amount / 100} {product.currency}
      </div>
      <div className="w-1/4">{product.type}</div>
    </div>
  )
}

const Index = () => {
  const { currentGroup } = useCurrentGroup()

  const result = useQuery(stripeProductsQueryDocument, {
    variables: { groupId: currentGroup.id },
  })

  return (
    <div>
      <MonetizationMenu />

      <Panel className="pt-4 h-auto max-w-4xl">
        <Panel.Body className="h-full drop-shadow-sm">
          <Result result={result}>
            {({ group }) => {
              const account = group?.account
              const products = account?.stripeAccount?.products || []

              return (
                <>
                  {products.length === 0 && <div>No products</div>}
                  <div className="flex flex-col gap-4">
                    {products.map((p) => (
                      <Product key={p.name} product={p} />
                    ))}
                  </div>
                </>
              )
            }}
          </Result>
        </Panel.Body>
      </Panel>
    </div>
  )
}

Index.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Index)
export default Index
