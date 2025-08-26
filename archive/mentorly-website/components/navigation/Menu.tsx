import classNames from 'classnames'
import { FC } from 'react'

import MenuItem, { MenuItemProps } from './MenuItem'

// @TODO: configure other typed components like this, rather than using JSX.Element
type MenuSubComponentsProps = {
  Item: FC<MenuItemProps>
}

const Menu: FC<MenuItemProps> & MenuSubComponentsProps = ({
  children,
  className,
  onClick,
}) => {
  return (
    <div
      className={classNames('flex flex-col min-w-32', className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

Menu.Item = MenuItem

export default Menu
