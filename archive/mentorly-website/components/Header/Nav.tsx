import classNames from 'classnames'
import { getFeatureFlag } from 'components/Feature'
import env from 'lib/env'
import { useCurrentUser } from 'lib/UserContext'
import Link from 'next/link'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Group } from 'types/graphql'

export type NavProps = {
  children: any
  className?: string
}

export const Nav: FC<NavProps> = ({ children, className }) => (
  <nav>
    <ul className={classNames('flex', className)}>{children}</ul>
  </nav>
)

export type NavElProps = {
  className?: string
  group: Group
  id: string
  legacy?: boolean
  needAuth?: boolean
  path?: string
  test?: boolean
}

const CLASSES = 'mr-5 xl:mr-10 rounded'

export const NavEl: FC<NavElProps> = ({
  className,
  group,
  id,
  legacy,
  needAuth,
  path,
  test,
}) => {
  const { currentUser } = useCurrentUser()
  const { formatMessage, locale } = useIntl()

  if (!getFeatureFlag(group, id)) {
    return null
  }

  if (test && env.production) {
    return null
  }

  if (needAuth && !currentUser) {
    return null
  }

  if (legacy) {
    return (
      <a
        href={path}
        className={classNames(CLASSES, className)}
        target={id === 'menu.faq' ? '_blank' : '_self'}
        rel="noreferrer"
      >
        {formatMessage({ id })}
      </a>
    )
  }

  return (
    <Link href={`/${locale}${path}`}>
      <a className={classNames(CLASSES, className)}>{formatMessage({ id })}</a>
    </Link>
  )
}
