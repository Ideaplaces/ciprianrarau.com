import useByteFormatter from 'lib/useByteFormatter'
import { VFC } from 'react'
import { File } from 'react-feather'
import { Maybe } from 'types/graphql'

type FilePreviewCardProps = {
  file: {
    metadata: {
      mimeType?: Maybe<string>
      filename: string
      size?: number
    }
  }
}

const FilePreviewCard: VFC<FilePreviewCardProps> = ({ file }) => {
  let extension

  switch (file.metadata.mimeType) {
    case 'application/msword':
      extension = 'doc'
      break

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      extension = 'docx'
      break

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
      extension = 'dotx'
      break

    case 'application/vnd.ms-word.template.macroEnabled.12':
      extension = 'dotm'
      break

    case 'text/html':
      extension = 'html'
      break

    case 'application/pdf':
      extension = 'pdf'
      break

    case 'text/csv':
      extension = 'csv'
      break

    case 'application/rtf':
      extension = 'rtf'
      break

    case 'text/plain':
      extension = 'txt'
      break

    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      extension = 'xlsx'
      break

    case 'application/vnd.ms-excel':
      extension = 'xls'
      break

    case 'application/epub+zip':
      extension = 'epub'
      break

    default:
      extension = 'doc'
      break
  }

  const size = useByteFormatter(file?.metadata?.size)

  return (
    <div className="bg-lightGray p-2 flex items-end px-4">
      <div className="relative mr-2">
        <File size="52" className="text-coolGray" />
        <div className="absolute px-2 py-1 rounded bg-black text-white align-middle leading-none top-0 right-0 mr-4 mt-6 text-xs">
          {extension}
        </div>
      </div>
      <div>
        <div className="w-64 truncate">{file.metadata.filename}</div>
        {size && <div>{size}</div>}
      </div>
    </div>
  )
}

export default FilePreviewCard

// Other FileTypes
// potm	application/vnd.ms-powerpoint.template.macroEnabled.12
// potx	application/vnd.openxmlformats-officedocument.presentationml.template
// ppam	application/vnd.ms-powerpoint.addin.macroEnabled.12
// pps	application/vnd.openxmlformats-officedocument.presentationml.slideshow
// ppsx	application/vnd.openxmlformats-officedocument.presentationml.slideshow
// ppsm	application/vnd.ms-powerpoint.slideshow.macroEnabled.12

// ppt	application/vnd.ms-powerpoint
// pptm	application/vnd.ms-powerpoint.presentation.macroEnabled.12
// pptx	application/vnd.openxmlformats-officedocument.presentationml.presentation
// rtf	application/rtf
// rtf2	text/rtf
// txt	text/plain
