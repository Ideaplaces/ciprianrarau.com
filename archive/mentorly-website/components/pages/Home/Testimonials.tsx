import { gql } from '@apollo/client'
import classNames from 'classnames'
import { H2 } from 'components/Headings'
import { Panel } from 'components/Panel'
import { MultiSlider } from 'components/Slider'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { Maybe, useTestimonialContentsQuery } from 'types/graphql'

type QuoteProps = {
  quote: string
  person?: Maybe<string>
  imageUrl?: Maybe<string>
}

export const Quote: VFC<QuoteProps> = ({ quote, person, imageUrl }) => {
  const { formatMessage } = useIntl()
  return (
    <figure className="w-5/6 mb-8 mx-auto items-center">
      <div className="w-16 m-auto pb-10">
        <img alt="quotes" src="/images/quotes.png" />
      </div>
      <blockquote
        className="text-xl text-center md:text-left"
        dangerouslySetInnerHTML={{ __html: quote as string }}
      />
      {imageUrl ? (
        <div className="w-32 h-32 inline-block my-6">
          <img
            src={imageUrl}
            alt={person || ''}
            className="rounded-full border-4 border-white"
          />
        </div>
      ) : (
        <br />
      )}
      <figcaption className="text-lg font-bold">
        {person || formatMessage({ id: 'table.header.user' })}
      </figcaption>
    </figure>
  )
}

const sliderSettings = {
  universal: {
    breakpoint: { max: 4000, min: 0 },
    items: 1,
  },
}

gql`
  query testimonialContents($locale: String!, $category: String) {
    testimonialContents(category: $category) {
      id
      category
      body(locale: $locale, format: "html")
      name(locale: $locale)
      imageUrl(width: 124, height: 124)
    }
  }
`

type TestimonialsProps = {
  color?: string
  hasWave?: boolean
  imageUrl?: string
  hideTitle?: boolean
  highlight?: string
  className?: string
  category?: string
}

export const Testimonials: VFC<TestimonialsProps> = ({
  color,
  hasWave,
  imageUrl,
  hideTitle,
  // highlight,
  className,
  category = 'b2b',
}) => {
  const { locale, formatMessage } = useIntl()
  const { loading, error, data } = useTestimonialContentsQuery({
    variables: { locale, category },
  })

  if (loading) {
    return null
  }

  if (error) {
    console.error(error)
    return null
  }

  return (
    <Panel
      color={color}
      className="bg-cover bg-top"
      style={{
        backgroundImage: imageUrl,
      }}
      hasWave={hasWave}
    >
      <Panel.Container className={classNames('text-center mb-0', className)}>
        {!hideTitle && (
          <H2 className="-mb-10 sm:-mb-6 md:mb-6">
            {formatMessage({ id: 'header.customerSatisfaction' })}
          </H2>
        )}

        <MultiSlider
          settings={sliderSettings}
          removeArrowOnDeviceType={['mobile']}
          dotListClass="relative flex mt-8"
          arrows
          swipeable
          draggable
          itemClass="my-auto items-center"
          renderDotsOutside
        >
          {data?.testimonialContents.map(
            (item) =>
              item.body && (
                <Quote
                  key={item.id}
                  quote={item.body}
                  person={item.name}
                  imageUrl={item.imageUrl}
                />
              )
          )}
        </MultiSlider>
      </Panel.Container>
    </Panel>
  )
}
