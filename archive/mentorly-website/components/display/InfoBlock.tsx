import classNames from 'classnames'
import React from 'react'
import { Icon } from 'react-feather'
import Skeleton from 'react-loading-skeleton'

export type InfoBlockProps = {
  className?: string
  loading?: boolean
  title: string
  value?: React.ReactNode
  backgroundColor?: string
  icon?: Icon
  iconColor?: string
  textColor?: string
}

const InfoBlock = ({
  className,
  loading,
  title,
  value,
  backgroundColor = 'bg-yellow',
  icon: IconComponent,
  iconColor = 'text-white',
  textColor = 'text-black',
}: InfoBlockProps) => {
  return (
    <div
      className={classNames(
        backgroundColor,
        'p-6 rounded-lg hover:shadow-lg transition-shadow duration-200',
        className
      )}
    >
      <div className="flex flex-col">
        {IconComponent && (
          <div className={classNames('mb-2', iconColor)}>
            <IconComponent size={24} />
          </div>
        )}
        <div
          className={classNames(
            'text-xs font-medium uppercase tracking-wide mb-1',
            textColor
          )}
        >
          {title}
        </div>
        <div className={classNames('text-2xl font-bold', textColor)}>
          {loading ? <Skeleton width={60} /> : value || '--'}
        </div>
      </div>
    </div>
  )
}

export default InfoBlock
