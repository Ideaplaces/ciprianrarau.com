import { gql } from '@apollo/client'
import { FC, ReactNode, useRef, useState } from 'react'
import { AlertCircle as AlertIcon } from 'react-feather'
import { useIntl } from 'react-intl'

gql`
  fragment RenderMediaFields on UserFile {
    fileUrl
    mimeType
  }
`

type RenderMediaProps = {
  className?: string
  file: any // @TODO fix non-nullable field Key in backend then use GroupFile | UserFile
  isThumbnail?: boolean
  alt?: string
  height?: number
  width?: number
}

const RenderMedia: FC<RenderMediaProps> = ({
  className,
  file,
  height,
  isThumbnail,
  alt = '',
  width,
}) => {
  const { formatMessage } = useIntl()
  const [error, setError] = useState(false)
  const videoEl = useRef(null)
  const handleError = () => {
    setError(true)
  }

  if (error) {
    return isThumbnail ? (
      <AlertMessage>
        {formatMessage({ id: 'form.upload_file_error' })}
      </AlertMessage>
    ) : null
  }

  const fileUrl = file?.fileUrl || undefined
  const mimeType = file?.mimeType || undefined

  const type = mimeType?.split('/')[0]

  if (type == 'video') {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        src={fileUrl}
        className="w-full my-auto max-h-full"
        ref={videoEl}
        controls
      >
        <source src={fileUrl} type={mimeType} />
        Your browser does not support the video tag.
      </video>
    )
  }

  return (
    <img
      className={className}
      src={fileUrl}
      alt={alt}
      height={height}
      width={width}
      onError={handleError}
    />
  )
}

type AlertMessageProps = {
  children: ReactNode
}
const AlertMessage: FC<AlertMessageProps> = ({ children }) => (
  <div className="text-white bg-red p-2 rounded flex items-center">
    <AlertIcon className="mr-2" />
    {children}
  </div>
)

export default RenderMedia
