import { gql } from '@apollo/client'
import classNames from 'classnames'
import { contrastBW } from 'lib/color'
import { Optional } from 'lib/typeUtilities'
import { FC, ReactNode, useState } from 'react'
import { Edit, Slash } from 'react-feather'
import Skeleton from 'react-loading-skeleton'
import { AvatarFieldsFragment } from 'types/graphql'

import MentorBadge from './MentorBadge'

gql`
  fragment AvatarFields on Avatar {
    id
    color
    initials
    imageUrl(height: 64, width: 64)
  }
`

// keep difference between sizes proportional
export const SIZES = {
  xs: 'w-6 h-6 text-xs',
  s: 'w-8 h-8 text-xs',
  sm: 'w-10 h-10 text-xs',
  md: 'w-12 h-12 text-lg',
  ml: 'w-16 h-16 text-lg',
  lg: 'w-20 h-20 text-lg',
  xl: 'w-24 h-24 text-lg',
}

export type SizeKey = keyof typeof SIZES

type AvatarImageProps = Optional<AvatarFieldsFragment, 'id'> & {
  size?: SizeKey
  status?: string
}

const statuses = {
  STAGED: Edit,
  DEACTIVATED: Slash,
} as Record<string, any>

const AvatarImage: FC<AvatarImageProps> = ({
  color,
  initials,
  imageUrl,
  size,
  status,
}) => {
  const [error, setError] = useState(false)
  const handleError = () => {
    setError(true)
  }

  const Icon = status ? statuses[status] : undefined

  if (Icon) {
    return (
      <div className="rounded-full bg-darkerGray h-full w-full">
        <Icon className="absolute m-auto left-0 right-0 top-0 bottom-0 text-white" />
      </div>
    )
  }

  if (!initials && error) {
    return (
      <div className="rounded-full flex justify-center items-center bg-red text-white h-full w-full">
        <Slash />
      </div>
    )
  }

  if (imageUrl && !error) {
    return (
      <div className="rounded-full bg-darkGray h-full w-full">
        <img
          alt={initials || undefined}
          className="rounded-full h-full w-full"
          src={imageUrl}
          onError={handleError}
        />
      </div>
    )
  }

  return (
    <div
      className={classNames(
        'rounded-full flex justify-center items-center h-full w-full',
        {
          [`text-3xl`]: size === 'lg',
          // @TODO: add more if needed but requires testing
        },
        `text-${contrastBW(color || 'white')}`
      )}
      style={color ? { backgroundColor: color } : undefined}
    >
      {initials}
    </div>
  )
}

export type AvatarProps = AvatarImageProps & {
  mentor?: boolean
  className?: string
  loading?: boolean
  size?: SizeKey
  status?: string
}

const Avatar: FC<AvatarProps> = ({
  color,
  initials,
  imageUrl,
  mentor,
  className,
  loading,
  status,
  size = 'md',
}) => {
  const sizeClassName = SIZES[size] || SIZES.md

  if (loading) {
    return (
      <Skeleton
        circle
        inline
        containerClassName={classNames('flex', sizeClassName)}
        className="block h-full"
      />
    )
  }

  return (
    <div
      className={classNames(
        'rounded-full relative',
        sizeClassName,
        className,
        mentor ? 'shadow-yellow' : 'shadow-gray'
      )}
    >
      <AvatarImage
        status={status}
        color={color}
        initials={initials}
        imageUrl={imageUrl}
        size={size}
      />
      {mentor && (
        <MentorBadge className="absolute right-0 bottom-0 w-1/3 h-1/3" />
      )}
    </div>
  )
}

type AvatarGroupProps = {
  children: ReactNode
  className?: string
}

export const AvatarGroup: FC<AvatarGroupProps> = ({ children, className }) => {
  return (
    <div className={classNames('flex h-12 -space-x-4', className)}>
      {children}
    </div>
  )
}

export default Avatar
