import { FC } from 'react'

import { HeadingProps } from '.'

const H5: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <h5
      className={`text-sm lg:text-sm font-black leading-tight uppercase mb-6 ${className}`}
      {...props}
    >
      {children}
    </h5>
  )
}

export default H5
