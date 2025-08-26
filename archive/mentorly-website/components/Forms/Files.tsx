import { gql } from '@apollo/client'
import Button from 'components/Button'
import Field from 'components/controls/Field'
import FieldError from 'components/controls/FieldError'
import RenderMedia from 'components/display/RenderMedia'
import Dropdown from 'components/Dropdown/Dropdown'
import ErrorBoundary from 'components/ErrorBoundary'
import Popover from 'components/Popover'
import FileInput from 'components/Uploader/FileInput'
import Uploader from 'components/Uploader/Uploader'
import { Form, Formik } from 'formik'
import { formatBytes } from 'lib/fileUtils'
import initialValues from 'lib/initialValues'
import { compact, has, isEmpty } from 'lodash'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import {
  ChevronLeft as MoveLeftIcon,
  ChevronRight as MoveRightIcon,
  Edit2 as EditIcon,
  MoreVertical,
  Plus as AddIcon,
  X as RemoveIcon,
} from 'react-feather'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  CreateGroupFileMutationVariables,
  CreateUserFileMutationVariables,
  GroupFile,
  UploadAttributes,
  useCreateGroupFileMutation,
  useCreateUserFileMutation,
  useDeleteAllGroupFilesMutation,
  useDeleteAllUserFilesMutation,
  useDeleteGroupFileMutation,
  useDeleteUserFileMutation,
  useMoveGroupFileHigherMutation,
  useMoveGroupFileLowerMutation,
  useMoveUserFileHigherMutation,
  useMoveUserFileLowerMutation,
  UserFile,
  useUpdateGroupFileMutation,
  useUpdateUserFileMutation,
} from 'types/graphql'

gql`
  mutation moveUserFileLower($id: ID!) {
    moveUserFileLower(id: $id) {
      userFile {
        id
        fileUrl
      }
      errors
      errorDetails
    }
  }

  mutation moveUserFileHigher($id: ID!) {
    moveUserFileHigher(id: $id) {
      userFile {
        id
        fileUrl
      }
      errors
      errorDetails
    }
  }

  mutation updateUserFile($id: ID!, $file: UploadAttributes) {
    updateUserFile(id: $id, file: $file) {
      userFile {
        id
        fileUrl
      }
      errors
      errorDetails
    }
  }

  mutation deleteUserFile($id: ID!) {
    deleteUserFile(id: $id) {
      userFile {
        id
        fileUrl
      }
      errors
      errorDetails
    }
  }

  mutation createUserFile($userId: ID!, $file: UploadAttributes!) {
    createUserFile(userId: $userId, file: $file) {
      userFile {
        id
        fileUrl
      }
      errors
      errorDetails
    }
  }

  mutation moveGroupFileLower($id: ID!) {
    moveGroupFileLower(id: $id) {
      groupFile {
        id
        url
      }
      errors
      errorDetails
    }
  }

  mutation moveGroupFileHigher($id: ID!) {
    moveGroupFileHigher(id: $id) {
      groupFile {
        id
        url
      }
      errors
      errorDetails
    }
  }

  mutation updateGroupFile($id: ID!, $url: String, $file: UploadAttributes) {
    updateGroupFile(id: $id, url: $url, file: $file) {
      groupFile {
        id
        url
      }
      errors
      errorDetails
    }
  }

  mutation deleteGroupFile($id: ID!) {
    deleteGroupFile(id: $id) {
      groupFile {
        id
        url
      }
      errors
      errorDetails
    }
  }

  mutation createGroupFile(
    $groupId: ID!
    $type: String!
    $file: UploadAttributes!
  ) {
    createGroupFile(groupId: $groupId, type: $type, file: $file) {
      groupFile {
        id
        url
      }
      errors
      errorDetails
    }
  }

  mutation deleteAllUserFiles($id: ID!) {
    deleteAllUserFiles(id: $id) {
      errorDetails
    }
  }

  mutation deleteAllGroupFiles($id: ID!, $type: String!) {
    deleteAllGroupFiles(id: $id, type: $type) {
      errorDetails
    }
  }

  fragment GroupFileFields on GroupFile {
    id
    position
    imageUrl(height: 192, width: 192)
    fileUrl
    type
  }
  fragment UserFileFields on UserFile {
    id
    position
    imageUrl(height: 192, width: 192)
    fileUrl
    type
  }
`

type FilesProps = {
  type: string
  groupId: string
  userId?: string
  isSelf?: boolean
  data?: any // @TODO revert back to "GroupFile | GroupFile[] | UserFile | UserFile[]" when GroupFile.key nullable is fixed
  multiple?: boolean
  hasURL?: boolean
  allowedFileTypes?: string[]
  refetch: () => void
  maxDimension?: number
  maxFileSize?: number
}

type HelpTextProps = {
  multiple?: boolean
  maxFileSize?: number
  maxDimension?: number
}

const HelpText: FC<HelpTextProps> = ({ maxFileSize, maxDimension }) => {
  const { locale } = useIntl()

  const restrictions = []

  if (maxFileSize) {
    restrictions.push(formatBytes(maxFileSize, 2, locale))
  }

  if (maxDimension) {
    restrictions.push(maxDimension + ' px')
  }

  return <span>{restrictions.join(' & ')} max</span>
}

// @TODO: query and mutation values should be passed by parent
// @TODO: refetchQueries in /dashboard/design no longer has access to groupId
const Files: FC<FilesProps> = ({
  type,
  groupId,
  userId,
  data,
  multiple,
  hasURL = false,
  allowedFileTypes,
  maxDimension = 4000,
  maxFileSize = 16.8 * 1024 * 1024,
  refetch,
}) => {
  const { formatMessage } = useIntl()
  const [error, setError] = useState<string>()

  const [createUserFile] = useCreateUserFileMutation({
    onCompleted: () => {
      toast.success(formatMessage({ id: 'text.fileUploaded' }))
    },
    onError: (error) => {
      setError(error.message)
      console.error(error)
      toast.error(formatMessage({ id: 'form.validation.mixed.file' }))
    },
  })
  const [createGroupFile] = useCreateGroupFileMutation({
    onCompleted: () => {
      toast.success(formatMessage({ id: 'text.fileUploaded' }))
    },
    onError: (error) => {
      setError(error.message)
      console.error(error)
      toast.error(formatMessage({ id: 'form.validation.mixed.file' }))
    },
  })

  const handleUpload = async (file: UploadAttributes) => {
    const variables = { file, type, userId, groupId }
    userId ? (variables.userId = userId) : (variables.groupId = groupId)
    userId
      ? await createUserFile({
          variables: variables as CreateUserFileMutationVariables,
        })
      : await createGroupFile({
          variables: variables as CreateGroupFileMutationVariables,
        })
    refetch()
  }

  const files = compact(Array.isArray(data) ? data : [data])

  const removeAll = userId
    ? useDeleteAllUserFilesMutation
    : useDeleteAllGroupFilesMutation

  const [deleteAllFiles] = removeAll()

  const handleDeleteAllFiles = () => {
    if (window.confirm(formatMessage({ id: 'confirm.deleteAllImages' }))) {
      deleteAllFiles({
        variables: {
          id: userId || groupId,
          type: type,
        },
      })
        .then(() =>
          toast.success(formatMessage({ id: 'toast.success.deleted' }))
        )
        .catch(() => toast.error(formatMessage({ id: 'toast.error.deleted' })))
    }
  }

  return (
    <div className="relative">
      {files.length > 1 && (
        <div className="absolute" style={{ top: -40, right: 0 }}>
          <Dropdown
            className={undefined}
            trigger={({ toggle }: any) => (
              <MoreVertical
                onClick={toggle}
                className="opacity-75 duration-200 ease-in-out cursor-pointer transition-opacity hover:opacity-100"
              />
            )}
          >
            {({ close }: any) => (
              <div className="absolute bg-white py-2 z-10 rounded border-gray shadow top-full mt-2 min-w-full text-left text-sm whitespace-nowrap right-0">
                <button
                  className="block hover:bg-gray text-left px-4 py-1 w-full"
                  onClick={() => {
                    handleDeleteAllFiles()
                    close()
                  }}
                >
                  {formatMessage({ id: 'button.deleteAllImages' })}
                </button>
              </div>
            )}
          </Dropdown>
        </div>
      )}
      {(maxFileSize || maxDimension) && (
        <div className="text-darkerGray -mt-4 mb-4">
          <HelpText
            multiple={multiple}
            maxFileSize={maxFileSize}
            maxDimension={maxDimension}
          />
        </div>
      )}
      <div className="flex flex-wrap">
        {!isEmpty(files) &&
          files.map((file) => (
            <FilesItem
              key={file.id}
              file={file}
              setError={setError}
              userId={userId}
              refetch={refetch}
              multiple={files.length > 1}
              hasURL={hasURL}
              allowedFileTypes={allowedFileTypes}
            />
          ))}
        {(multiple || files.length < 1) && (
          <div className="mr-4 mb-4 border border-darkGray rounded p-2">
            <ErrorBoundary>
              <Uploader
                id="formFiles"
                onUpload={handleUpload}
                setError={setError}
                allowedFileTypes={allowedFileTypes}
                onUploading={undefined}
                maxFileSize={maxFileSize}
                maxDimension={maxDimension}
              >
                <FileInput onChange={undefined} progress={undefined}>
                  {({
                    onClick,
                    loading,
                  }: {
                    onClick: any
                    loading: boolean
                  }) => (
                    <div className="h-48 w-48 flex justify-center items-center">
                      <Button
                        loading={loading}
                        disabled={loading}
                        onClick={onClick}
                      >
                        <AddIcon className="mr-1" />
                        {formatMessage({ id: 'button.add' })}
                      </Button>
                    </div>
                  )}
                </FileInput>
              </Uploader>
            </ErrorBoundary>
          </div>
        )}
      </div>
      {error && <FieldError error={error} />}
    </div>
  )
}

type FilesItemProps = {
  file: GroupFile | UserFile
  multiple?: boolean
  hasURL?: boolean
  userId?: string
  refetch: () => void
  allowedFileTypes?: string[]
  setError?: Dispatch<SetStateAction<string | undefined>>
}

const FilesItem: FC<FilesItemProps> = ({
  file,
  multiple,
  setError,
  hasURL,
  userId,
  refetch,
  allowedFileTypes,
}) => {
  const { formatMessage } = useIntl()
  const useMoveLower = userId
    ? useMoveUserFileLowerMutation
    : useMoveGroupFileLowerMutation
  const useMoveHigher = userId
    ? useMoveUserFileHigherMutation
    : useMoveGroupFileHigherMutation
  const useDeleteFile = userId
    ? useDeleteUserFileMutation
    : useDeleteGroupFileMutation
  const useUpdateFile = userId
    ? useUpdateUserFileMutation
    : useUpdateGroupFileMutation

  const [moveLower] = useMoveLower()
  const [moveHigher] = useMoveHigher()
  const [deleteFile] = useDeleteFile()
  const [updateFile] = useUpdateFile()

  const handleMoveLeft = async () => {
    await moveHigher({ variables: { id: file.id } })
    refetch()
  }

  const handleMoveRight = async () => {
    await moveLower({ variables: { id: file.id } })
    refetch()
  }

  const handleRemove = async () => {
    if (!confirm(formatMessage({ id: 'prompt.areYouSure' }))) return false

    await deleteFile({
      variables: { id: file.id },
      update(cache: any) {
        const id = cache.identify({
          id: file.id,
          __typename: userId ? 'UserFile' : 'GroupFile',
        })
        cache.evict({ id })
        cache.gc()
      },
    })
    refetch()
  }

  const handleUpload = async (upload: UploadAttributes) => {
    await updateFile({
      variables: {
        id: file.id,
        file: upload,
      },
      onCompleted: () => {
        toast.success(formatMessage({ id: 'text.fileUploaded' }))
      },
      onError: () => {
        toast.error(formatMessage({ id: 'form.validation.mixed.file' }))
      },
    })
    refetch()
  }

  return (
    <div key={file.id} className="mr-4 mb-4 border border-darkGray rounded p-2">
      <div className="flex justify-center items-center h-48 w-48 relative">
        <RenderMedia
          className={'object-contain h-48 w-48'}
          file={file}
          alt={`Background ${file.id}`}
          isThumbnail
          height={192}
          width={192}
        />
        <div className="absolute top-0 right-0 bg-white flex">
          {multiple && (
            <>
              <button
                className="text-darkGray hover:text-black"
                onClick={handleMoveLeft}
              >
                <MoveLeftIcon />
              </button>
              <button
                className="text-darkGray hover:text-black"
                onClick={handleMoveRight}
              >
                <MoveRightIcon />
              </button>
            </>
          )}
          <Uploader
            id={'fileUploader'}
            onUpload={handleUpload}
            setError={setError}
            allowedFileTypes={allowedFileTypes}
            onUploading={undefined}
          >
            <FileInput onChange={undefined} progress={undefined}>
              {({ onClick }: any) => (
                <button
                  className="text-darkGray hover:text-black"
                  onClick={onClick}
                >
                  <EditIcon />
                </button>
              )}
            </FileInput>
          </Uploader>
          <button
            className="text-darkGray hover:text-red"
            onClick={handleRemove}
          >
            <RemoveIcon />
          </button>
        </div>
      </div>
      {hasURL && (
        <Popover
          className="block truncate overflow-hidden w-48 "
          layer={<PopoverLayer file={file} />}
        >
          <div className="mt-1">
            {has(file, 'url') ? (
              (file as GroupFile).url
            ) : (
              <span className="text-darkerGray">no url</span>
            )}
          </div>
        </Popover>
      )}
    </div>
  )
}

const PopoverLayer = ({ file }: { file: GroupFile | UserFile }) => {
  const { formatMessage } = useIntl()
  const [updateGroupFile] = useUpdateGroupFileMutation({
    onCompleted: () => {
      toast.success(formatMessage({ id: 'text.fileUploaded' }))
    },
  })

  // @TODO: cannot save form because of error with whiteLabel
  const onSubmit = ({ url }: { url: string }) => {
    updateGroupFile({
      variables: {
        id: file.id,
        url,
      },
    })
  }

  return null

  return (
    <Formik
      initialValues={initialValues(file) as { url: string }}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <Form className="p-8 w-80" onSubmit={handleSubmit}>
          <Field name="url" />
          <div className="pt-4">
            <Button type="submit">Save</Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default Files
