import { useCurrentGroup } from 'lib/GroupContext'
import publicUrl from 'lib/publicUrl'
import Head from 'next/head'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { Maybe } from 'types/graphql'

type SEOProps = {
  description?: Maybe<string>
  title: string
  image?: Maybe<string>
}

export const SEO: VFC<SEOProps> = ({ description, title, image }) => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup: group } = useCurrentGroup()

  const isMarketplace = group?.marketplace
  const isMentorly = !group || isMarketplace
  const isWhiteLabel = !isMarketplace && group?.whiteLabel

  const mentorlyDesc = isMarketplace
    ? formatMessage({ id: 'seo.b2cDescription' })
    : formatMessage({ id: 'seo.b2bDescription' })

  const groupDesc = isWhiteLabel
    ? formatMessage(
        { id: 'seo.whiteLabelDescription' },
        {
          program: group?.title,
          organisation: group?.name,
          mission: group?.subtitle,
        }
      )
    : formatMessage(
        {
          id: 'seo.greyLabelDescription',
        },
        { program: group?.name }
      )

  const mentorlyDescription = isMentorly ? mentorlyDesc : groupDesc

  const metaDescription = !description
    ? mentorlyDescription
    : `${description} 
  
      ${mentorlyDescription}`

  const metaImage =
    publicUrl(image) || 'https://s3.amazonaws.com/co.mentorly.prod/fb-share.png'

  return (
    <>
      <Head>
        <title>
          {title
            ? `${title} | ${
                isMarketplace
                  ? formatMessage({ id: 'seo.mentorlyTitleMarketplace' })
                  : group?.whiteLabel
                  ? group.name
                  : formatMessage({ id: 'seo.mentorlyTitlePlatform' })
              }`
            : 'Mentorly'}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:locale" content={locale} key="locale" />
        <meta property="og:title" content={title} key="title" />
        <meta
          property="og:description"
          content={metaDescription}
          key="description"
        />
        <meta property="og:image" content={metaImage.toString()} key="image" />
        <meta property="og:type" content="website" key="type" />
        <meta
          property="twitter:card"
          name="twitter:card"
          content="summary"
          key="twitterCard"
        />
        <meta
          property="twitter:creator"
          name="twitter:creator"
          content="@infomentorly"
          key="twitterHandle"
        />
        <meta
          property="twitter:title"
          name="twitter:title"
          content={title}
          key="twitterTitle"
        />
        <meta
          property="twitter:description"
          name="twitter:description"
          content={metaDescription}
          key="twitterDescription"
        />
      </Head>
    </>
  )
}

export default SEO
