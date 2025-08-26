// import Head from 'next/head'
import { VFC } from 'react'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'
import { GroupEssentialsFieldsFragment } from 'types/graphql'

type GroupType = Pick<
  GroupEssentialsFieldsFragment,
  | 'title'
  | 'name'
  | 'styles'
  | 'whiteLabel'
  | 'backgroundImages'
  | 'subtitle'
  | 'logoImage'
  | 'marketplace'
>

export type MetaHeaderProps = {
  group: GroupType
}

export const groupFonts = (
  group: Pick<GroupEssentialsFieldsFragment, 'styles'>
) => {
  const stylesBoldItalic = 'ital,wght@0,400;0,700;0,900;1,400;1,700;1,900'

  const { fontName, titleFontName } = group?.styles || {}

  if (!fontName && !titleFontName) return false

  const fontList = [fontName, titleFontName]
    .filter(Boolean)
    .map((font) => `family=${font?.replace(' ', '+')}:${stylesBoldItalic}`)

  return fontList.join('&')
}

const getDescription = ({ marketplace, whiteLabel }: GroupType) => {
  if (marketplace) {
    return 'seo.b2cDescription'
  }

  if (whiteLabel) {
    return 'seo.whiteLabelDescription'
  }

  return 'seo.greyLabelDescription'
}

const MetaHeader: VFC<MetaHeaderProps> = ({ group }) => {
  const { locale, formatMessage } = useIntl()
  const { title, name, whiteLabel, backgroundImages, subtitle, logoImage } =
    group

  const description = formatMessage(
    { id: getDescription(group) },
    { program: title, organisation: name, mission: subtitle }
  )

  return (
    <Helmet>
      <title>{`${title} | ${whiteLabel ? name : 'Mentorly'}`}</title>
      <meta name="robots" content="noindex" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:locale" content={locale} key="locale" />
      <meta property="og:title" content={title || undefined} key="title" />
      <meta property="og:description" content={description} key="description" />
      <meta
        property="og:image"
        content={
          backgroundImages[0]?.imageUrl || logoImage?.imageUrl || undefined
        }
        key="image"
      />
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
        content={
          whiteLabel ? `@${group.name.replace(' ', '')}` : '@infomentorly'
        }
        key="twitterHandle"
      />
      <meta
        property="twitter:title"
        name="twitter:title"
        content={title || undefined}
        key="twitterTitle"
      />
      <meta
        property="twitter:description"
        name="twitter:description"
        content={description}
        key="twitterDescription"
      />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?${groupFonts(
          group
        )}&display=swap`}
      />
    </Helmet>
  )
}

export default MetaHeader
