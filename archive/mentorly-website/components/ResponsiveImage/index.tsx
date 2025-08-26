import env from 'lib/env'
import { useEffect, useState, VFC } from 'react'

type ResponsiveImageProps = {
  alt?: string
  src: string
  width: number
  quality?: number
}

const ResponsiveImage: VFC<ResponsiveImageProps> = ({
  alt,
  src,
  width = 600,
  quality = 75,
  ...props
}) => {
  const [resultSrc, setResultSrc] = useState(src)

  useEffect(() => {
    if (!env.development) {
      const url = encodeURIComponent(
        `${window.location.protocol}//${window.location.host}${src}`
      )
      setResultSrc(
        `${process.env.NEXT_PUBLIC_API_URL}/images/${url}?w=${width}&q=${quality}`
      )
    }
  }, [src])
  return <img alt={alt || ''} src={resultSrc} {...props} />
}

export default ResponsiveImage
