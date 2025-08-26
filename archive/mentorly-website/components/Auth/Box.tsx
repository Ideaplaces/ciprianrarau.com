import classNames from 'classnames'
import { FC, ReactNode } from 'react'

type BoxProps = {
  className?: string
  children: ReactNode
}

const Box: FC<BoxProps> = ({ className, children }) => {
  return (
    <div
      className={classNames(
        'w-full mx-auto bg-white p-6 rounded shadow',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Box
