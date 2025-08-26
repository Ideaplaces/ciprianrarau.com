/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames'
import { motion } from 'lib/framer-motion'
import Link from 'next/link'
import { FC, ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { GroupEssentialsFieldsFragment } from 'types/graphql'

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
}

export type MenuLinkItem = {
  legacy: boolean
  id: string
  path: string
}

type MenuLinkProps = {
  group?: GroupEssentialsFieldsFragment
  item: MenuLinkItem
  toggleOpen: () => void
}

export const MenuLink: FC<MenuLinkProps> = ({ item, toggleOpen }) => {
  const { locale, formatMessage } = useIntl()

  if (item.legacy) {
    return (
      <a
        href={item.path}
        className="text-2xl"
        onClick={toggleOpen}
        onKeyPress={toggleOpen}
      >
        {formatMessage({ id: item.id })}
      </a>
    )
  }

  // Handle path construction properly
  // Build a valid URL path, specially handling dashboard routes
  const path = item.path || ''
  const cleanPath = path === 'undefined' ? '' : path

  // If it's a dashboard path, make sure it's properly structured
  let finalHref = `/${locale}${
    cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
  }`

  // Special handling for dashboard URLs to prevent issues with reporting/etc.
  if (cleanPath.includes('dashboard')) {
    // Handle dashboard path segments properly
    const pathSegments = cleanPath.split('/').filter(Boolean)
    if (pathSegments.length >= 1) {
      finalHref = `/${locale}/dashboard/${pathSegments.slice(1).join('/')}`
    }
  }

  return (
    <Link href={finalHref}>
      <a className="text-2xl" onClick={toggleOpen} onKeyPress={toggleOpen}>
        {formatMessage({ id: item.id })}
      </a>
    </Link>
  )
}

type MenuItemProps = {
  children: ReactNode
  animateOnly?: boolean
  className?: string
  noTapMotion?: boolean
}
export const MenuItem: FC<MenuItemProps> = ({
  children,
  animateOnly,
  className,
}) => {
  return (
    <motion.li variants={variants} className={classNames('mb-1', className)}>
      <motion.div
        whileHover={!animateOnly ? { x: -5 } : undefined}
        whileTap={!animateOnly ? { x: 5 } : undefined}
        className="font-black text-left py-2"
      >
        {children}
      </motion.div>
    </motion.li>
  )
}
