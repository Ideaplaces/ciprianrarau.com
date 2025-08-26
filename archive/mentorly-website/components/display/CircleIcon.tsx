import { VFC } from 'react'
import { Icon } from 'react-feather'

export type CircleIconProps = {
  icon: Icon
  bg?: string
  color?: string
  size?: number
}

const CircleIcon: VFC<CircleIconProps> = ({
  icon,
  bg = 'gray',
  color = 'black',
  size = 16,
}) => {
  const Icon = icon

  // @TODO: replace style with tailwind arbitrary-values (i.e. p-[2px])
  return (
    <div className="flex">
      <div
        className={`flex-none bg-${bg} rounded-full`}
        style={{ padding: `${size * 0.6}px` }}
      >
        {Icon ? <Icon size={size} color={color} /> : ''}
      </div>
    </div>
  )
}

export default CircleIcon
