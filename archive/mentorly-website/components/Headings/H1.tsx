import { FC } from 'react'

import { HeadingProps } from '.'

const H1: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <h1
      className={`text-4xl lg:text-6xl leading-none text-black mb-6 ${className}`}
      {...props}
    >
      {children}
    </h1>
  )
}

export default H1
