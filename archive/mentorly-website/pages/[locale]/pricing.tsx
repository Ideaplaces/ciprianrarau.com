import { gql } from '@apollo/client'
import TypedQuery, { TypedQueryReturn } from 'components/Graphql/TypedQuery'
import PricingB2B from 'components/Pricing/PricingB2B'
import PricingB2C from 'components/Pricing/PricingB2C'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'
import {
  FeaturesFieldsFragmentDoc,
  PlanFieldsFragmentDoc,
  PricingContentsQuery,
  PricingContentsQueryVariables,
  usePricingContentsQuery,
} from 'types/graphql'

gql`
  query pricingContents($pageId: ID!, $locale: String!) {
    pageContent(id: $pageId) {
      ...PricingPageContent
    }
    planContents {
      ...PlanFields
    }
    featureContents {
      ...FeaturesFields
    }
  }
  fragment PricingPageContent on PageContent {
    title(locale: $locale)
    description(locale: $locale)
    body(locale: $locale, format: "html", headerOffset: 0)
  }
  ${PlanFieldsFragmentDoc}
  ${FeaturesFieldsFragmentDoc}
`

const Pricing = () => {
  const { currentGroup, loading } = useCurrentGroup()
  const { locale } = useIntl()
  if (loading) return null

  const pageId = `${currentGroup?.marketplace ? 'b2c' : 'b2b'}.pricing.intro`

  return (
    <TypedQuery<PricingContentsQueryVariables>
      typedQuery={usePricingContentsQuery}
      variables={{ locale, pageId }}
      runOnServer
    >
      {({
        pageContent,
        featureContents,
        planContents,
        loading,
      }: TypedQueryReturn & PricingContentsQuery) => {
        if (loading) {
          return null
        }

        if (currentGroup?.marketplace) {
          return <PricingB2C pageContent={pageContent} />
        }
        return (
          <PricingB2B
            pageContent={pageContent}
            planContents={planContents}
            featureContents={featureContents}
          />
        )
      }}
    </TypedQuery>
  )
}

export const getServerSideProps = connectServerSideProps(Pricing)
export default Pricing
