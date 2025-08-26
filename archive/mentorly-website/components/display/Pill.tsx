import classNames from 'classnames'
import { contrastBW } from 'lib/color'
import { ReactNode, VFC } from 'react'

export type PillProps = {
  className?: string
  children: ReactNode
  color?: string
  testId?: string
  fontSize?: string
  onRemove?: () => void
}

const Pill: VFC<PillProps> = ({
  children,
  color = 'yellow',
  className,
  testId,
  fontSize = 'xs',
  onRemove = undefined,
}) => {
  const bgColor = color ? `bg-${color}` : 'bg-yellow'
  const fontColor = `text-${contrastBW(color)}`
  const fontClass = `text-${fontSize} ${fontColor}`

  // bg-invited bg-signedUp bg-pending bg-booked bg-available bg-completedProfile

  return (
    <div className="flex items-start">
      <div
        className={classNames(
          'flex space-x-1 rounded-full px-2 focus:outline-none whitespace-nowrap',
          bgColor,
          fontClass,
          className
        )}
        data-testid={testId || bgColor}
      >
        <span className="w-auto flex flex-start space-x-1">{children}</span>
        {onRemove && (
          <button
            className="h-full flex select-none items-center cursor-pointer text-xs opacity-50 hover:opacity-100 hover:text-red hover:font-bold"
            onClick={onRemove}
          >
            &times;
          </button>
        )}
      </div>
    </div>
  )
}

type PillBoxProps = {
  children: ReactNode
}

export const PillBox: VFC<PillBoxProps> = ({ children }) => {
  return <div className="flex flex-wrap gap-2">{children}</div>
}

export default Pill
