import { FC } from 'react'

import { HeadingProps } from '.'

const H4: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <h4
      className={`text-lg lg:text-lg leading-tight font-black text-black mb-6 ${className}`}
      {...props}
    >
      {children}
    </h4>
  )
}

export default H4
