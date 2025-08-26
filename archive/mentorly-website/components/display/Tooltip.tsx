import classNames from 'classnames'
import ErrorBoundary from 'components/ErrorBoundary'
import { FC, ReactElement, ReactNode } from 'react'
import { Position, Tooltip as Tippy } from 'react-tippy'
import { Maybe } from 'types/graphql'

type Link = {
  href: string
  label: string
  target?: string
}

type TooltipProps = {
  position?: Position
  text: ReactNode
  theme?: 'dark' | 'light'
  hide?: boolean
  link?: Link
  className?: string
  divClass?: string
  children: Maybe<ReactElement<any, any>>
  enterable?: boolean
  arrow?: boolean
  distance?: number
}

const Tooltip: FC<TooltipProps> = ({
  children,
  position,
  theme,
  arrow = true,
  distance,
  text,
  hide,
  link,
  className,
  enterable,
  divClass,
}) => {
  if (!text) return children

  return (
    <ErrorBoundary>
      <Tippy
        position={position || 'top'}
        theme={theme || 'light'}
        className={classNames(divClass, className)}
        interactive={enterable}
        disabled={hide}
        arrow={arrow}
        distance={distance}
        useContext
        html={
          <span>
            {text}
            {link && (
              <a
                className="text-highlightColor ml-2 font-bold"
                target="_blank"
                href={link.href}
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            )}
          </span>
        }
      >
        {children}
      </Tippy>
    </ErrorBoundary>
  )
}

export default Tooltip
