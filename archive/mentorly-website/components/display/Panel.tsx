import classNames from 'classnames'
import ErrorBoundary from 'components/ErrorBoundary'
import { FC, ReactNode } from 'react'

const paddingX = 'px-6'
const paddingY = 'py-4'
const paddingT = 'pt-4'
const paddingB = 'pb-4'

type PanelProps = {
  children: ReactNode
  className?: string
  style?: object
}

export const Panel = ({
  children,
  className,
  style,
}: PanelProps): JSX.Element => {
  return (
    <ErrorBoundary>
      <div
        className={classNames(
          'bg-white flex py-2 mb-5 flex-col w-full',
          className
        )}
        style={style}
      >
        {children}
      </div>
    </ErrorBoundary>
  )
}

type HeaderProps = {
  children?: ReactNode
  heading?: string
  subheading?: string
  className?: string
  action?: ReactNode
}
export const Header: FC<HeaderProps> = ({
  children,
  heading,
  subheading,
  className,
  action,
}) => {
  return (
    <div
      className={classNames(
        'font-black text-lg w-full flex justify-between',
        paddingX,
        paddingT,
        className
      )}
    >
      {heading && (
        <div>
          {<div className="text-lg">{heading}</div>}
          {subheading && (
            <div className="text-sm font-normal text-darkerGray">
              {subheading}
            </div>
          )}
        </div>
      )}
      {action || children}
    </div>
  )
}

type FooterProps = {
  children: ReactNode
  className?: string
}

export const Footer: FC<FooterProps> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        'w-full flex justify-between',
        paddingX,
        paddingB,
        className
      )}
    >
      {children}
    </div>
  )
}

type BodyProps = {
  children: ReactNode
  className?: string
}

export const Body: FC<BodyProps> = ({ children, className }) => {
  return (
    <div className={classNames('flex-1 w-full', paddingX, paddingY, className)}>
      {children}
    </div>
  )
}

type SidebarProps = {
  children: ReactNode
  className: string
}
export const Sidebar: FC<SidebarProps> = ({ children, className }) => {
  return (
    <div className={classNames('w-64 bg-lightGray p-4', className)}>
      {children}
    </div>
  )
}

Panel.Header = Header
Panel.Body = Body
Panel.Footer = Footer
Panel.Sidebar = Sidebar

export default Panel
