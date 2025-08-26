import { VFC } from 'react'

type ImageProps = {
  alt: string
  href?: string
  [x: string]: any
}

const Image: VFC<ImageProps> = ({ alt, href, ...props }) => {
  const imageTag = <img src={props.src} alt={alt} {...props} />

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {imageTag}
      </a>
    )
  }

  return imageTag
}

export default Image
