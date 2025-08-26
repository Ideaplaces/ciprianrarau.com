import { ButtonLink } from 'components/Button/Button'
import { H2 } from 'components/Headings'
import { Panel } from 'components/Panel'
import Link from 'next/link'
import { VFC } from 'react'

export interface CTAButton {
  text: string
  href: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
}

export interface LandingCTAProps {
  title: string
  subtitle?: string
  buttons: CTAButton[]
  backgroundColor?: 'blue' | 'green' | 'yellow' | 'purple' | 'white'
  bottomText?: string
}

export const LandingCTA: VFC<LandingCTAProps> = ({
  title,
  subtitle,
  buttons,
  backgroundColor = 'blue',
  bottomText,
}) => {
  const getTextColorClass = () => {
    if (backgroundColor === 'white' || backgroundColor === 'yellow') {
      return 'text-black'
    }
    return 'text-white'
  }

  const getSubtitleColorClass = () => {
    if (backgroundColor === 'white') return 'text-gray-700'
    if (backgroundColor === 'yellow') return 'text-gray-700'
    if (backgroundColor === 'blue') return 'text-blue-100'
    if (backgroundColor === 'green') return 'text-green-100'
    if (backgroundColor === 'purple') return 'text-purple-100'
    return 'text-gray-100'
  }

  const getBottomTextColorClass = () => {
    if (backgroundColor === 'white' || backgroundColor === 'yellow') {
      return 'text-gray-600'
    }
    if (backgroundColor === 'blue') return 'text-blue-200'
    if (backgroundColor === 'green') return 'text-green-200'
    if (backgroundColor === 'purple') return 'text-purple-200'
    return 'text-gray-200'
  }

  const getButtonColor = (button: CTAButton) => {
    if (
      button.variant === 'secondary' &&
      (backgroundColor === 'white' || backgroundColor === 'yellow')
    ) {
      return undefined
    }
    if (button.variant === 'secondary') {
      return 'white'
    }
    return undefined
  }

  return (
    <div className="mt-24">
      <Panel color={backgroundColor} className="py-36">
        <Panel.Container>
          <div
            className={`text-center max-w-4xl mx-auto ${getTextColorClass()}`}
          >
            <H2 className={`mb-6 ${getTextColorClass()}`}>{title}</H2>
            {subtitle && (
              <p className={`text-xl mb-10 ${getSubtitleColorClass()}`}>
                {subtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {buttons.map((button, index) => (
                <Link key={index} href={button.href} passHref>
                  <ButtonLink
                    variant={button.variant || 'primary'}
                    size={button.size || 'large'}
                    color={getButtonColor(button)}
                  >
                    {button.text}
                  </ButtonLink>
                </Link>
              ))}
            </div>
            {bottomText && (
              <p className={`mt-6 text-sm ${getBottomTextColorClass()}`}>
                {bottomText}
              </p>
            )}
          </div>
        </Panel.Container>
      </Panel>
    </div>
  )
}
