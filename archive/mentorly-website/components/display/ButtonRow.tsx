import classNames from 'classnames'
import { useCurrentGroup } from 'lib/GroupContext'
import Link from 'next/link'
import { FC, ReactNode } from 'react'
import { ArrowRightCircle } from 'react-feather'

export type ButtonRowProps = {
  children: ReactNode
  external?: boolean
  href?: string
  onClick?: () => void
  newWindow?: boolean
  testId?: string
  [x: string]: any
}

const ButtonRow: FC<ButtonRowProps> = ({
  children,
  external,
  href,
  onClick = () => {},
  newWindow,
  testId = 'button-row',
  ...props
}) => {
  if (href) {
    return (
      <Spacer testId={testId}>
        {external ? (
          <a
            href={href}
            onClick={onClick}
            target={newWindow ? '_blank' : '_self'}
            rel="noreferrer"
          >
            <Row {...props} onClick={onClick}>
              {children}
            </Row>
          </a>
        ) : (
          <Link href={href} passHref>
            <Row {...props} onClick={onClick}>
              {children}
            </Row>
          </Link>
        )}
      </Spacer>
    )
  }
  return (
    <Spacer testId={testId}>
      <Row {...props} onClick={onClick}>
        {children}
      </Row>
    </Spacer>
  )
}

type SpacerProps = {
  testId: string
  children: ReactNode
}

const Spacer: FC<SpacerProps> = ({ testId, children }) => (
  <div data-testid={testId} className="first:pt-0 first:pb-4 py-4">
    {children}
  </div>
)

type RowProps = {
  color?: string
  icon?: any
  className?: string
  hideIcon?: boolean
  children: ReactNode
  ungroup?: boolean
  onClick?: () => void
}
const Row: FC<RowProps> = ({
  color,
  icon,
  className,
  hideIcon,
  children,
  ungroup,
  onClick,
}) => {
  const { currentGroup } = useCurrentGroup()

  const stroke = currentGroup && currentGroup.styles?.backgroundColor
  const Icon = () => icon || <ArrowRightCircle color={stroke || 'black'} />
  return (
    <div
      className={classNames(
        'flex w-full justify-between space-x-4 px-0 items-center',
        `bg-${color || 'white'}`,
        ungroup ? 'cursor-default' : 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex">{children}</div>
      {!hideIcon && (
        <div className="flex space-x-2 flex-wrap justify-end">
          <Icon />
        </div>
      )}
    </div>
  )
}

export default ButtonRow
