import classNames from 'classnames'
import { VFC } from 'react'
import { Icon } from 'react-feather'

export type InfoCardProps = {
  className?: string
  title: string
  value: string
  icon: Icon
  [x: string]: any
}

const InfoCard: VFC<InfoCardProps> = ({
  className,
  title,
  value,
  icon,
  ...props
}) => {
  return (
    <div
      className={classNames(
        className,
        'flex py-2 px-8 items-center border-2 border-darkGray border-opacity-50 rounded-md bg-white space-x-4'
      )}
      {...props}
    >
      <div className="p-4 border-darkGray inline-block rounded-full bg-primary">
        {icon}
      </div>
      <div className="p-4">
        <div className="font-black text-sm mb-2">{title}</div>
        <div className="font-normal text-sm">{value}</div>
      </div>
    </div>
  )
}

export default InfoCard
