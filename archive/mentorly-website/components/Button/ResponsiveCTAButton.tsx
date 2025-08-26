import classNames from 'classnames'
import Button, { ButtonLink } from 'components/Button'
import { useWindowScroll } from 'lib/useWindowScroll'
import { useWindowSize } from 'lib/useWindowSize'
import Link from 'next/link'
import { VFC } from 'react'
import { Icon, Plus } from 'react-feather'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'

type ResponsiveCTAButtonProps = {
  loading?: boolean
  path?: string
  messageId: string
  onClick?: () => void
  Icon?: Icon
  external?: boolean
  responsive?: boolean
}

const ResponsiveCTAButton: VFC<ResponsiveCTAButtonProps> = ({
  path = '',
  messageId,
  onClick = () => {},
  Icon = Plus,
  external,
  responsive = true,
  loading,
  ...props
}) => {
  const { locale, formatMessage } = useIntl()
  const { scrollDirection } = useWindowScroll()
  const { isMobile } = useWindowSize()

  const Component = path ? ButtonLink : Button

  const className = responsive
    ? 'relative ml-3 space-x-2 px-4 py-4 md:px-8 md:py-2 shadow-2xl md:shadow-none'
    : 'px-8 py-2'

  const buttonClass =
    responsive && isMobile && scrollDirection > 0 ? 'hidden' : 'block'

  const button = (
    <Component
      className={className}
      onClick={onClick}
      target={external ? '_blank' : '_self'}
      {...props}
    >
      <span className="flex space-x-2">
        {!loading && <Icon />}
        <p className={buttonClass}>{formatMessage({ id: messageId })}</p>
      </span>
    </Component>
  )

  // @TODO: render Link conditionally... won't always be present
  return (
    <div
      className={
        responsive
          ? 'fixed z-top bottom-0 right-0 m-6 md:relative md:m-0'
          : 'relative m-0'
      }
    >
      {path && !loading ? (
        <Link href={external ? path : `/${locale}/${path}`} passHref>
          {button}
        </Link>
      ) : loading ? (
        <Skeleton
          className={classNames(
            buttonClass,
            'hidden md:block px-6 py-2 rounded-full'
          )}
          height={35}
          width={formatMessage({ id: messageId }).length * 15}
        />
      ) : (
        button
      )}
    </div>
  )
}

export default ResponsiveCTAButton
