import classNames from 'classnames'
import IconButton from 'components/general/IconButton'
import FileInput from 'components/Uploader/FileInput'
import Uploader, {
  UploaderFileType,
  UppyUploadType,
} from 'components/Uploader/Uploader'
import { fileTypesAllowed } from 'lib/fileTypesAllowed'
import { FC, useState } from 'react'
import { Upload } from 'react-feather'

type ImageControlProps = {
  name: string
  defaultValue: any
  onValueChange: any
  large?: boolean
  onUploading: any
  className?: string
}

const Image: FC<ImageControlProps> = ({
  name,
  defaultValue,
  onValueChange,
  large,
  onUploading,
  className,
}) => {
  const [source, setSource] = useState(defaultValue)

  const handleUpload = (data: UploaderFileType, file: UppyUploadType) => {
    onValueChange(data)
    setSource(URL.createObjectURL(file.data))
  }

  const size = large ? 'w-40 h-40' : 'w-20 h-20'

  return (
    <div
      className={classNames(
        'border border-darkGray rounded relative bg-gradient-to-t',
        size,
        className
      )}
    >
      {source && (
        <img alt={name} src={source} className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <Uploader
          id={name}
          onUploading={onUploading}
          onUpload={handleUpload}
          allowedFileTypes={fileTypesAllowed}
        >
          <FileInput>
            {({ onClick, loading }) => (
              <div
                className={`flex items-center justify-center h-full w-full ${
                  source && 'opacity-0 hover:opacity-100'
                }`}
              >
                <IconButton
                  className="bg-white opacity-50 hover:opacity-100"
                  icon={Upload}
                  onClick={onClick}
                  loading={loading}
                />
              </div>
            )}
          </FileInput>
        </Uploader>
      </div>
    </div>
  )
}

export default Image
