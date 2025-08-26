import { FC } from 'react'

import { HeadingProps } from '.'

const H3: FC<HeadingProps> = ({ children, className, ...props }) => {
  return (
    <h3
      className={`text-3xl lg:text-4xl leading-none font-black text-black mb-6 ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
}

export default H3
