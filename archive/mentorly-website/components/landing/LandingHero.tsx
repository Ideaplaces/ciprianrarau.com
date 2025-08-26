import { ButtonLink } from 'components/Button/Button'
import { Panel } from 'components/Panel'
import Link from 'next/link'
import { VFC } from 'react'

export interface LandingHeroProps {
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'white'
  title: string
  subtitle: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
    color?: string
  }
  image: {
    src: string
    alt: string
  }
  badge?: {
    text: string
    icon?: string
  }
  textColor?: string
}

export const LandingHero: VFC<LandingHeroProps> = ({
  color = 'blue',
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  image,
  badge,
  textColor,
}) => {
  const getTextColorClass = () => {
    if (textColor) return textColor
    if (color === 'white' || color === 'yellow') return 'text-black'
    return 'text-white'
  }

  const getSubtitleColorClass = () => {
    if (color === 'white') return 'text-gray-700'
    if (color === 'yellow') return 'text-gray-700'
    if (color === 'blue') return 'text-blue-100'
    if (color === 'green') return 'text-green-100'
    if (color === 'purple') return 'text-purple-100'
    return 'text-gray-100'
  }

  const getBadgeColorClass = () => {
    if (color === 'white' || color === 'yellow') {
      return 'bg-blue text-white'
    }
    return 'bg-white bg-opacity-20 text-white'
  }

  return (
    <Panel color={color} className="overflow-hidden -mt-48 pt-48 md:pt-64">
      <Panel.Container className="md:flex items-center">
        <div className="w-full sm:mb-0 absolute right-0 bottom-0 z-0">
          <img
            src="/images/form-flowers-no-circle.png"
            className="absolute bottom-0 right-0 opacity-20"
            alt=""
          />
        </div>
        <div
          className={`relative mt-12 md:mt-0 sm:mb-16 md:mb-6 lg:pt-6 xl:mb-16 z-10 md:w-1/2 md:mr-8 ${getTextColorClass()}`}
        >
          {badge && (
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getBadgeColorClass()} mb-6`}
            >
              {badge.icon && <span className="mr-2">{badge.icon}</span>}
              {badge.text}
            </div>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          <p
            className={`mb-10 text-lg md:text-xl lg:text-2xl ${getSubtitleColorClass()} leading-relaxed`}
          >
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={primaryCTA.href} passHref>
              <ButtonLink variant="primary">{primaryCTA.text}</ButtonLink>
            </Link>
            {secondaryCTA && (
              <Link href={secondaryCTA.href} passHref>
                <ButtonLink
                  variant="secondary"
                  color={
                    secondaryCTA.color ||
                    (color === 'white' || color === 'yellow'
                      ? undefined
                      : 'white')
                  }
                >
                  {secondaryCTA.text}
                </ButtonLink>
              </Link>
            )}
          </div>
        </div>
        <div className="relative z-10 md:w-1/2 mt-8 md:mt-0 md:ml-12 lg:ml-16">
          <img
            src={image.src}
            alt={image.alt}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '24px',
              boxShadow:
                '0 40px 80px -12px rgba(0, 0, 0, 0.5), 0 20px 40px -12px rgba(0, 0, 0, 0.3)',
            }}
          />
        </div>
      </Panel.Container>
    </Panel>
  )
}
