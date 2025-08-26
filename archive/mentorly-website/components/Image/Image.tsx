import React, { VFC } from 'react'
import { Maybe } from 'types/graphql'

type ImageProps = {
  className?: string
  src?: Maybe<string>
  alt: string
}

const Image: VFC<ImageProps> = ({ className, src, alt }) => (
  <div
    className={`${className} group w-full h-full overflow-hidden flex items-center justify-center`}
  >
    <img
      src={src || undefined}
      alt={alt}
      className="object-cover object-center w-full h-full visible"
    />
  </div>
)

export default Image
