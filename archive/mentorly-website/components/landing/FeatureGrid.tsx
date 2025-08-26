import { H2, H3 } from 'components/Headings'
import { Panel } from 'components/Panel'
import { VFC } from 'react'

export interface Feature {
  icon: string
  title: string
  description: string
  color?: 'blue' | 'green' | 'yellow' | 'purple'
  highlights?: string[]
}

export interface FeatureGridProps {
  title: string
  subtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
  variant?: 'default' | 'bordered' | 'shadowed' | 'detailed'
  backgroundColor?: 'white' | 'gray-50'
  id?: string
}

export const FeatureGrid: VFC<FeatureGridProps> = ({
  title,
  subtitle,
  features,
  columns = 3,
  variant = 'default',
  backgroundColor = 'white',
  id,
}) => {
  const getColorValue = (color?: string) => {
    switch (color) {
      case 'blue':
        return '#7582fb'
      case 'green':
        return '#03c18e'
      case 'yellow':
        return '#fddd36'
      case 'purple':
        return '#989DFF'
      default:
        return '#7582fb'
    }
  }

  const getGridClass = () => {
    switch (columns) {
      case 2:
        return 'md:grid-cols-2'
      case 3:
        return 'md:grid-cols-3'
      case 4:
        return 'md:grid-cols-2 lg:grid-cols-4'
      default:
        return 'md:grid-cols-3'
    }
  }

  const renderFeature = (feature: Feature, index: number) => {
    switch (variant) {
      case 'bordered':
        return (
          <div
            key={index}
            className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300 border-l-4"
            style={{ borderLeftColor: getColorValue(feature.color) }}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <H3 className="mb-4 text-xl">{feature.title}</H3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        )

      case 'shadowed':
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <H3 className="mb-4">{feature.title}</H3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        )

      case 'detailed':
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-start mb-6">
              <div className="text-4xl mr-4">{feature.icon}</div>
              <div className="flex-1">
                <H3 className="mb-3 text-2xl">{feature.title}</H3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
            {feature.highlights && (
              <div className="grid grid-cols-1 gap-3 ml-14">
                {feature.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                    <svg
                      className="w-5 h-5 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ color: getColorValue(feature.color) }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return (
          <div key={index} className="text-center">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <H3 className="mb-4">{feature.title}</H3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        )
    }
  }

  return (
    <div id={id} className="mt-24">
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
          <div className={`grid ${getGridClass()} gap-8`}>
            {features.map((feature, index) => renderFeature(feature, index))}
          </div>
        </Panel.Container>
      </Panel>
    </div>
  )
}
