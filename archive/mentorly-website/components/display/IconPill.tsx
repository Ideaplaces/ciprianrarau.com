import classNames from 'classnames'
import { FC, ReactNode } from 'react'
import { Icon as IconType } from 'react-feather'

type CircleIconProps = {
  icon: IconType
  size?: number
}

const CircleIcon: FC<CircleIconProps> = ({ icon, size = 18 }) => {
  const Icon = icon
  return (
    <div className="flex items-center justify-center rounded-full bg-gray w-6 h-6 p-1">
      <Icon size={size} />
    </div>
  )
}

export type IconPillProps = {
  icon?: IconType
  customIcon?: ReactNode
  text: string | ReactNode
  onRemove?: () => any
  onClick?: () => any
  className?: string
}

const IconPill: FC<IconPillProps> = ({
  icon,
  customIcon,
  text,
  onRemove,
  onClick,
  className,
}) => (
  <div
    className={classNames(
      'group inline-flex mb-1 mr-1 p-1 bg-white items-center border border-black border-opacity-15 rounded-full overflow-hidden hover:shadow-sm hover:border-opacity-20',
      className
    )}
  >
    <button
      className="inline-flex items-center space-x-2 mr-2 select-none cursor-pointer"
      onClick={onClick}
      type="button"
    >
      {icon ? <CircleIcon icon={icon} /> : customIcon}
      <p className="text-sm">{text}</p>
    </button>
    {onRemove && (
      <button
        className="pr-2 h-full flex select-none items-center cursor-pointer text-xs opacity-50 hover:opacity-100 hover:text-red hover:font-bold"
        data-testid="iconPillRemoveBtn"
        onClick={onRemove}
      >
        x
      </button>
    )}
  </div>
)

export default IconPill
