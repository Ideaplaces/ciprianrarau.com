import PageContent from 'components/PageContent'
import Panel from 'components/Panel'
import { SEO } from 'components/SEO/SEO'
import { connectStaticPaths, connectStaticProps } from 'lib/ssg'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { Maybe, PricingPageContentFragment } from 'types/graphql'

type PricingB2CProps = {
  pageContent?: Maybe<PricingPageContentFragment>
}

const PricingB2C: VFC<PricingB2CProps> = ({ pageContent }) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <SEO
        title={formatMessage({ id: 'menu.pricing' })}
        description={pageContent?.title?.replace(/<(.|\n)*?>/g, '')}
        image={undefined}
      />
      <Panel color="white font-light">
        <Panel.Container>
          <div className="text-justify pl-10">
            <PageContent
              id="b2c.pricing.intro"
              titleSize="h2"
              contentStyle="text-lg"
              titlePosition="left"
            />
          </div>
          <div className="mt-8 pl-10">
            <PageContent
              id="b2c.pricing.example"
              contentStyle="text-xl m-10 pl-5 border-l-4 border-blue text-justify font-semibold"
              titleSize="h3"
              titlePosition="left"
            />
          </div>
          <div className="w-7/12 bg-darkGray h-96 mx-auto justify-center items-center text-3xl hidden">
            How it works video will go here
          </div>
        </Panel.Container>
      </Panel>
    </>
  )
}

export const getStaticPaths = connectStaticPaths('pricing')
export const getStaticProps = connectStaticProps(PricingB2C)

export default PricingB2C
