import { gql } from '@apollo/client'
import { H2 } from 'components/Headings'
import Panel from 'components/Panel'
import { MultiSlider } from 'components/Slider'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { Maybe, usePartnerContentsQuery } from 'types/graphql'

gql`
  query partnerContents($locale: String!) {
    partnerContents {
      id
      name(locale: $locale)
      url(locale: $locale)
      imageUrl(locale: $locale, width: 124, height: 124)
    }
  }
`

const sliderSettings = {
  xl: {
    breakpoint: { max: 4000, min: 1280 },
    items: 10,
  },
  desktop: {
    breakpoint: { max: 1280, min: 768 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 768, min: 576 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 576, min: 0 },
    items: 1,
  },
}

type PartnerType = {
  id: string
  url?: Maybe<string>
  imageUrl?: Maybe<string>
  name?: Maybe<string>
}

type PartnerProps = {
  partner?: Maybe<PartnerType>
}

const Partner: VFC<PartnerProps> = ({ partner }) => {
  if (!partner) {
    return null
  }

  return (
    <div className="m-6">
      <a href={partner.url || '#'} target="_blank" rel="noopener noreferrer">
        <img src={partner.imageUrl || ''} alt={partner.name || ''} />
      </a>
    </div>
  )
}

export const Partners = () => {
  const intl = useIntl()
  const { loading, error, data } = usePartnerContentsQuery({
    variables: { locale: intl.locale },
  })

  if (loading) {
    return null
  }

  if (error) {
    console.error(error)
    return null
  }

  const partnerContents = data?.partnerContents.filter(
    (partner) => partner.imageUrl
  )

  return (
    <Panel color="white" hasWave>
      <H2 className="text-center mt-16">
        {intl.formatMessage({ id: 'header.companiesWhoTrust' })}
      </H2>
      <MultiSlider
        settings={sliderSettings}
        itemClass="flex justify-center items-center"
        removeArrowOnDeviceType={['mobile']}
      >
        {partnerContents?.map((partner) => (
          <Partner
            // className="hidden md:block"
            key={partner.id}
            partner={partner}
          />
        ))}
      </MultiSlider>
    </Panel>
  )
}
