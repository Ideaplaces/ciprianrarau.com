import classNames from 'classnames'
import Clickable from 'components/general/Clickable'
import { FC, forwardRef } from 'react'

export type MenuItemProps = {
  className?: string
  children?: React.ReactNode
  onClick?: (event: any) => void
}

const MenuItem: FC<MenuItemProps> = forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <Clickable
        ref={ref}
        {...props}
        type="button"
        className={classNames(
          'hover:bg-gray px-3 py-1 text-left text-sm',
          className
        )}
      >
        {children}
      </Clickable>
    )
  }
)

MenuItem.displayName = 'MenuItem'

export default MenuItem
