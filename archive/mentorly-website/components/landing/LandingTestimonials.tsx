import { H2 } from 'components/Headings'
import { PartnersHardcodedScrolling } from 'components/pages/Pricing/PartnersHardcodedScrolling'
import { Panel } from 'components/Panel'
import { VFC } from 'react'

export interface Testimonial {
  quote: string
  author: string
  role: string
  company?: string
  logo?: string
}

export interface LandingTestimonialsProps {
  title: string
  subtitle?: string
  testimonials: Testimonial[]
  showPartners?: boolean
  backgroundColor?: 'white' | 'gray-50'
  cardColor?: 'gray' | 'blue' | 'green' | 'purple' | 'yellow'
}

export const LandingTestimonials: VFC<LandingTestimonialsProps> = ({
  title,
  subtitle,
  testimonials,
  showPartners = true,
  backgroundColor = 'white',
  cardColor = 'gray',
}) => {
  const getCardColorClass = () => {
    switch (cardColor) {
      case 'blue':
        return 'bg-blue-50'
      case 'green':
        return 'bg-green-50'
      case 'purple':
        return 'bg-purple-50'
      case 'yellow':
        return 'bg-yellow-50'
      default:
        return 'bg-gray-50'
    }
  }

  const getQuoteIconColor = () => {
    switch (cardColor) {
      case 'blue':
        return 'text-blue'
      case 'green':
        return 'text-green'
      case 'purple':
        return 'text-purple'
      case 'yellow':
        return 'text-yellow'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="mt-24">
      <Panel color={backgroundColor} className="py-36">
        <Panel.Container>
          <div className="text-center mb-16">
            <H2 className="mb-6">{title}</H2>
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`${getCardColorClass()} rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="mb-6">
                  <svg
                    className={`w-8 h-8 ${getQuoteIconColor()}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  {testimonial.company && (
                    <p className="text-sm text-gray-500">
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {showPartners && <PartnersHardcodedScrolling />}
        </Panel.Container>
      </Panel>
    </div>
  )
}
