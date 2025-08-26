import { FC } from 'react'

import { HeadingProps } from '.'

const H2: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <h2
      className={`text-4xl lg:text-6xl leading-none font-black text-black mb-6 ${className}`}
      {...props}
    >
      {children}
    </h2>
  )
}

export default H2
