import { H2, H3 } from 'components/Headings'
import { Panel } from 'components/Panel'
import { VFC } from 'react'

export interface Step {
  number?: string
  icon?: string
  title: string
  description: string
  details?: string
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'black'
}

export interface HowItWorksProps {
  title: string
  subtitle?: string
  steps: Step[]
  variant?: 'numbered' | 'icon' | 'timeline'
  backgroundColor?: 'white' | 'gray-50'
  bottomNote?: string
  id?: string
}

export const HowItWorks: VFC<HowItWorksProps> = ({
  title,
  subtitle,
  steps,
  variant = 'numbered',
  backgroundColor = 'gray-50',
  bottomNote,
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
      case 'black':
        return '#000000'
      default:
        return '#7582fb'
    }
  }

  const renderStep = (step: Step, index: number) => {
    switch (variant) {
      case 'icon':
        return (
          <div key={index} className="text-center">
            <div
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl"
              style={{
                backgroundColor: step.color
                  ? getColorValue(step.color) + '20'
                  : '#7582fb20',
              }}
            >
              {step.icon}
            </div>
            <H3 className="mb-4">{step.title}</H3>
            <p className="text-gray-600 mb-3">{step.description}</p>
            {step.details && (
              <p
                className="text-sm font-semibold"
                style={{ color: getColorValue(step.color) }}
              >
                {step.details}
              </p>
            )}
          </div>
        )

      case 'timeline':
        return (
          <div key={index} className="relative">
            {index < steps.length - 1 && (
              <div
                className="absolute top-10 left-10 w-0.5 h-full -ml-px"
                style={{ backgroundColor: '#e5e7eb' }}
              />
            )}
            <div className="flex items-start">
              <div
                className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold z-10"
                style={{ backgroundColor: getColorValue(step.color) }}
              >
                {step.number || index + 1}
              </div>
              <div className="ml-8 pb-12">
                <H3 className="mb-3">{step.title}</H3>
                <p className="text-gray-600">{step.description}</p>
                {step.details && (
                  <p className="text-sm text-gray-500 mt-2">{step.details}</p>
                )}
              </div>
            </div>
          </div>
        )

      default: // numbered
        return (
          <div key={index} className="text-center">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold mb-6"
              style={{
                backgroundColor: getColorValue(step.color),
                color: step.color === 'yellow' ? '#111' : '#fff',
              }}
            >
              {step.number || `0${index + 1}`}
            </div>
            {step.icon && <div className="text-4xl mb-4">{step.icon}</div>}
            <H3 className="mb-4">{step.title}</H3>
            <p className="text-gray-600">{step.description}</p>
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
          <div
            className={
              variant === 'timeline'
                ? 'max-w-3xl mx-auto'
                : `grid md:grid-cols-${steps.length === 4 ? '4' : '3'} gap-8`
            }
          >
            {steps.map((step, index) => renderStep(step, index))}
          </div>
          {bottomNote && (
            <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-center text-gray-600">{bottomNote}</p>
            </div>
          )}
        </Panel.Container>
      </Panel>
    </div>
  )
}
