import { ButtonLink } from 'components/Button/Button'
import { H2 } from 'components/Headings'
import { Panel } from 'components/Panel'
import Link from 'next/link'
import { ReactNode, VFC } from 'react'

export interface ContentSectionProps {
  backgroundColor?: 'white' | 'gray-50'
  className?: string
  children: ReactNode
}

export const ContentSection: VFC<ContentSectionProps> = ({
  backgroundColor = 'white',
  className = 'py-16',
  children,
}) => {
  return (
    <Panel color={backgroundColor} className={className}>
      <Panel.Container>{children}</Panel.Container>
    </Panel>
  )
}

// Pre-built content blocks
export interface InfoBlockProps {
  badge?: {
    text: string
    icon?: string
    color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
  }
  title: string
  subtitle?: string
  description?: string
  cta?: {
    text: string
    href: string
  }
  gradient?: {
    from: string
    to: string
  }
}

export const InfoBlock: VFC<InfoBlockProps> = ({
  badge,
  title,
  subtitle,
  description,
  cta,
  gradient,
}) => {
  const getBadgeColorClass = () => {
    switch (badge?.color) {
      case 'blue':
        return 'bg-blue text-white'
      case 'green':
        return 'bg-green text-white'
      case 'yellow':
        return 'bg-yellow text-black'
      case 'purple':
        return 'bg-purple text-white'
      case 'red':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue text-white'
    }
  }

  const gradientStyle = gradient
    ? {
        background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
      }
    : {}

  return (
    <div className="text-center">
      <div
        className={`${
          gradient ? '' : 'bg-gradient-to-r from-blue-50 to-green-50'
        } rounded-lg p-12 max-w-5xl mx-auto`}
        style={gradientStyle}
      >
        {badge && (
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getBadgeColorClass()} mb-6`}
          >
            {badge.icon && <span className="mr-2">{badge.icon}</span>}
            {badge.text}
          </div>
        )}
        <h3 className="text-4xl font-black text-gray-900 mb-6">{title}</h3>
        {subtitle && (
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-lg text-gray-700 font-semibold">{description}</p>
        )}
        {cta && (
          <div className="flex justify-center mt-8">
            <Link href={cta.href} passHref>
              <ButtonLink variant="primary">{cta.text}</ButtonLink>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

// Stats block
export interface Stat {
  value: string
  label: string
  description?: string
}

export interface StatsBlockProps {
  title?: string
  subtitle?: string
  stats: Stat[]
  backgroundColor?: string
  textColor?: string
}

export const StatsBlock: VFC<StatsBlockProps> = ({
  title,
  subtitle,
  stats,
  backgroundColor = 'blue',
  textColor = 'white',
}) => {
  return (
    <Panel color={backgroundColor} className={`py-36 text-${textColor}`}>
      <Panel.Container>
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && <H2 className={`mb-6 text-${textColor}`}>{title}</H2>}
            {subtitle && (
              <p
                className={`text-xl ${
                  textColor === 'white' ? 'text-blue-100' : 'text-gray-600'
                } max-w-3xl mx-auto`}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className={`grid md:grid-cols-${stats.length} gap-8`}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-center"
            >
              <div className={`text-5xl font-bold text-${textColor} mb-4`}>
                {stat.value}
              </div>
              <p
                className={`${
                  textColor === 'white' ? 'text-blue-100' : 'text-gray-700'
                } font-semibold`}
              >
                {stat.label}
              </p>
              {stat.description && (
                <p
                  className={`${
                    textColor === 'white' ? 'text-blue-200' : 'text-gray-600'
                  } text-sm mt-2`}
                >
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </Panel.Container>
    </Panel>
  )
}
