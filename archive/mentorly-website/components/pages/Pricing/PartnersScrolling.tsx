import { gql } from '@apollo/client'
import { H2 } from 'components/Headings'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { Maybe, usePartnerContentsQuery } from 'types/graphql'

import styles from './PartnersScrolling.module.css'

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
    <a
      href={partner.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.partnerItem}
    >
      <img src={partner.imageUrl || ''} alt={partner.name || ''} />
    </a>
  )
}

export const PartnersScrolling = () => {
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

  if (!partnerContents || partnerContents.length === 0) {
    return null
  }

  // Duplicate the array to create a seamless loop
  const duplicatedPartners = [...partnerContents, ...partnerContents]

  return (
    <div className={styles.bannerContainer}>
      <H2 className="text-center mb-12">
        {intl.formatMessage({ id: 'header.companiesWhoTrust' })}
      </H2>
      <div className={styles.scrollingWrapper}>
        <div className={styles.scrollingContent}>
          {duplicatedPartners.map((partner, index) => (
            <Partner key={`${partner.id}-${index}`} partner={partner} />
          ))}
        </div>
      </div>
    </div>
  )
}
