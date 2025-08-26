import { H2 } from 'components/Headings'
import React from 'react'
import { useIntl } from 'react-intl'
import { usePageContentQuery } from 'types/graphql'

const Hero = () => {
  const intl = useIntl()
  const { loading, error, data } = usePageContentQuery({
    variables: { id: 'b2b.case_studies.intro', locale: intl.locale },
  })

  if (loading || !data) {
    return null
  }

  if (error) {
    console.error(error)
    return null
  }

  const { pageContent } = data

  if (!pageContent) {
    return null
  }

  return (
    <div
      className="pt-6 md:pt-12 pb-32 lg:pt-32 lg:pb-48 bg-primary bg-cover bg-bottom"
      style={{ backgroundImage: ' url(/images/faq-leaves.png)' }}
    >
      <div className="relative z-10 text-center">
        {/* <H2>{pageContent.title}</H2> */}
        <H2>{pageContent.title}</H2>
        <div
          className="mb-10"
          dangerouslySetInnerHTML={{ __html: pageContent.body as string }}
        />
      </div>
    </div>
  )
}

export default Hero
