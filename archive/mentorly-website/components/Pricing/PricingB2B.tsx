import { H2 } from 'components/Headings'
import { Form } from 'components/pages/Home/Form'
import { Testimonials } from 'components/pages/Home/Testimonials'
import Panel from 'components/Panel'
import { SEO } from 'components/SEO/SEO'
import { connectStaticPaths, connectStaticProps } from 'lib/ssg'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import {
  FeaturesFieldsFragment,
  Maybe,
  PlanFieldsFragment,
  PricingPageContentFragment,
} from 'types/graphql'

import FeaturesList from './Features'
import Plan from './Plan'

const planColors = ['bg-graph-purple', 'bg-green', 'bg-purple', 'bg-black']

type PricingB2BProps = {
  planContents: PlanFieldsFragment[]
  pageContent?: Maybe<PricingPageContentFragment>
  featureContents: FeaturesFieldsFragment[]
}

const PricingB2B: VFC<PricingB2BProps> = ({
  planContents,
  pageContent,
  featureContents,
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="flex flex-col w-full">
      <SEO
        title="Pricing"
        description={pageContent?.title?.replace(/<(.|\n)*?>/g, '')}
        image={undefined}
      />
      <div
        className="pt-6 md:pt-12 pb-32 bg-primary bg-cover bg-bottom"
        style={{ backgroundImage: 'url(/images/pricing-leaves.png)' }}
      >
        <div className="text-center my-12">
          <H2>{pageContent?.title}</H2>
          <div
            dangerouslySetInnerHTML={{ __html: pageContent?.body as string }}
          />
        </div>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
          {planContents?.map((data, i) => (
            <Plan key={data.id} color={planColors[i]} data={data} />
          ))}
        </div>
      </div>
      <Panel color="white" hasWave className="-mt-32 min-h-panel mb-32">
        <div className="container mx-auto border border-gray border-solid">
          <div className="h-48 md:h-24 text-xl flex font-black">
            <div className="bg-gray flex justify-start items-center w-1/3 px-6">
              {formatMessage({ id: 'pricing.features' })}
            </div>
            {planContents?.map((data, i) => (
              <div
                key={data.id}
                className={`${planColors[i]} w-1/6 text-white flex justify-center items-center`}
              >
                <div className="transform -rotate-90 md:rotate-0">
                  {data.name}
                </div>
              </div>
            ))}
          </div>
        </div>
        <FeaturesList features={featureContents} />
      </Panel>
      <Testimonials
        color="yellow"
        hasWave
        imageUrl="url(/images/pricing-bottom-leaves.png)"
      />
      {/* <Partners /> */}
      <Form
        color="purple"
        hasWave
        className="bg-cover bg-top pb-48"
        style={{ backgroundImage: `url(/images/form-flowers-crop.png)` }}
      />
    </div>
  )
}

export const getStaticPaths = connectStaticPaths('pricing')
export const getStaticProps = connectStaticProps(PricingB2B)

export default PricingB2B
