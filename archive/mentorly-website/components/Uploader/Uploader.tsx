import AwsS3Multipart from '@uppy/aws-s3-multipart'
import Uppy, { UploadedUppyFile } from '@uppy/core'
import { values } from 'lodash'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { Maybe } from 'types/graphql'

import { handleChildren } from '../Generic/util'

export type UploaderFileType = {
  // this is something we've built ourselves
  // i assume to satisfy the shape of what AWS needs?
  id: string
  storage: 'cache' | string
  metadata: {
    size: number
    filename: string
    mimeType: string
  }
  data?: File
  url?: string
}

export type UppyUploadType = File & {
  data: File
  url: string // we add this ourselves
}

const useUppy = ({
  id,
  config,
  onError,
  onFileAdded,
  onUploadError,
  onRestrictionFailed,
  onUploadProgress,
  onUploadSuccess,
}: any) => {
  const uppy = useMemo(() => {
    const u = Uppy(config)
    u.use(AwsS3Multipart, {
      limit: 1,
      companionUrl: process.env.NEXT_PUBLIC_API_URL,
    })

    u.on('error', onError)
    u.on('restriction-failed', onRestrictionFailed)
    u.on('file-added', onFileAdded)
    u.on('upload-progress', onUploadProgress)
    u.on('upload-error', onUploadError)
    u.on('upload-success', onUploadSuccess)
    return u
  }, [id])

  useEffect(() => {
    return () => uppy.close()
  }, [id])

  return uppy
}

type UploaderProps = {
  children: ReactNode
  id: string
  onUpload: (...args: any) => void // callback determined by the component using Uploader
  allowedFileTypes?: Maybe<string[]>
  setError?: (errorMessageId?: string) => void
  onUploading?: (uploading: boolean) => void
  maxFileSize?: number
  maxDimension?: number
}
const Uploader: FC<UploaderProps> = ({
  children,
  id,
  onUpload,
  allowedFileTypes,
  setError,
  onUploading,
  maxFileSize = 1024 * 1024 * 1024, // B to KB to MB = 1GB
  maxDimension = 4000, //pixels
}) => {
  const { formatMessage } = useIntl()
  const [progress, setProgress] = useState(null)

  const getImgDimension = async (imgFile: UppyUploadType) => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(imgFile.data)
      const img = new Image()
      img.onload = function () {
        URL.revokeObjectURL(img.src)
        resolve({
          width: img.width,
          height: img.height,
        })
      }
      img.src = url
    })
  }

  const checkImage = (image_url: string) => {
    const image = new Image()
    image.onerror = function () {
      const error = formatMessage({ id: 'form.validation.mixed.file' })
      setError && setError('form.upload_file_error')
      console.error(error)
      toast.error(error)
    }
    image.src = image_url
  }

  const checkVideo = (video_url: string) => {
    const video = document.createElement('video')
    video.onerror = function () {
      const error = formatMessage({ id: 'form.validation.mixed.file' })
      setError && setError('form.upload_file_error')
      console.error(error)
      toast.error(error)
    }
    video.src = video_url
  }

  const uppy = useUppy({
    id: id || '1',
    logger: null, // @TODO: this was Upp.nullLogger but that does not exist
    config: {
      autoProceed: false,
      restrictions: {
        allowedFileTypes,
        maxFileSize,
      },
    },
    onRestrictionFailed: (_file: File, error: unknown) => {
      console.error(error)
      setError && setError('form.upload_file_error')
    },
    onFileAdded: async (file: UppyUploadType) => {
      const isImage = file?.type?.includes('image')
      const imgDimension = isImage && (await getImgDimension(file))

      if (!isImage || values(imgDimension).every((d) => d < maxDimension)) {
        uppy.upload() // this triggers the Uppy onX callbacks
        setError && setError(undefined)
      } else {
        const error = formatMessage(
          { id: 'alert.maxDimensions' },
          { limit: maxDimension }
        )
        setError && setError(error)
        toast.error(error)
        console.error(error)
      }
    },
    onError: (error: unknown) => {
      console.error(error)
      setError && setError('form.upload_file_error')
    },
    onUploadError: (file: File, error: unknown) => {
      console.error('upload error:', file, error)
      setError && setError('form.upload_file_error')
    },
    onUploadProgress: (_file: File, progress: any) => {
      setProgress(progress)
      if (onUploading) {
        onUploading(true)
      }
    },
    onUploadSuccess: (file: File, data: UploadedUppyFile<any, any>) => {
      const id = data.uploadURL.match(/\/cache\/([^?]+)/)
      const uploadedFileData = {
        id: id && id[1], // extract key without prefix
        storage: 'cache',
        metadata: {
          size: file.size,
          filename: file.name,
          mimeType: file.type,
        },
      } as UploaderFileType

      file.type.includes('image') && checkImage(data.uploadURL)
      file.type.includes('video') && checkVideo(data.uploadURL)

      setProgress(null)
      setError && setError(undefined)

      if (onUploading) {
        onUploading(false)
      }

      const fileWithUrl = { ...file, url: data.uploadURL }

      onUpload(uploadedFileData, fileWithUrl)
    },
  })

  const onChange = (file: UppyUploadType) => {
    uppy.reset()
    try {
      uppy.addFile({
        name: file.name,
        type: file.type,
        data: file,
      })
      setError && setError(undefined)
    } catch (err: unknown) {
      setError && setError('form.upload_file_error')
      console.error(err)
      toast.error(formatMessage({ id: 'error.unknown' }), { autoClose: 5000 })
    }
  }

  return handleChildren(children, { onChange, progress })
}

export default Uploader
