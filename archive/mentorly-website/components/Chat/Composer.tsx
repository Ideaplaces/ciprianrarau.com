import { gql, RefetchQueriesFunction } from '@apollo/client'
import Button from 'components/Button/Button'
import FilePreviewCard from 'components/Chat/FilePreviewCard'
import Field from 'components/controls/Field'
import Textarea from 'components/controls/Textarea'
import Tooltip from 'components/display/Tooltip'
import Alert from 'components/feedback/Alert'
import IconButton from 'components/general/IconButton'
import FileInput from 'components/Uploader/FileInput'
import Uploader, {
  UploaderFileType,
  UppyUploadType,
} from 'components/Uploader/Uploader'
import { FormikValues, useFormikContext } from 'formik'
import { produce } from 'immer'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { useCurrentUser } from 'lib/UserContext'
import { Dictionary, isEmpty, omit } from 'lodash'
import { event } from 'nextjs-google-analytics'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { Paperclip, Send, X } from 'react-feather'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  ComposerFieldsFragment,
  ConversationDocument,
  ConversationQuery,
  GroupAvatarsFieldsFragmentDoc,
  Message,
  Upload,
  UploadAttributes,
  useCreateConversationFileMutation,
  useCreateGroupConversationMutation,
  useCreateMessageMutation,
} from 'types/graphql'
import { ulid } from 'ulid'

// @TODO: handle onRemove for filters

gql`
  mutation createMessage($id: ID!, $conversationId: ID!, $text: String!) {
    createMessage(id: $id, conversationId: $conversationId, text: $text) {
      message {
        id
        text
        user {
          id
          name
        }
        createdAt
      }
      errors
      errorDetails
    }
  }

  mutation createGroupConversation(
    $senderId: ID
    $recipientIds: [ID!]
    $memberFilters: MemberFiltersAttributes
    $isAnnouncement: Boolean
    $title: String
    $message: String!
  ) {
    createGroupConversation(
      senderId: $senderId
      recipientIds: $recipientIds
      memberFilters: $memberFilters
      isAnnouncement: $isAnnouncement
      title: $title
      message: $message
    ) {
      conversation {
        id
      }
      errors
      errorDetails
    }
  }

  mutation createConversationFile(
    $id: ID!
    $conversationId: ID!
    $file: UploadAttributes!
  ) {
    createConversationFile(
      id: $id
      conversationId: $conversationId
      file: $file
    ) {
      message {
        id
        url
        user {
          id
          name
        }
        createdAt
      }
      errors
      errorDetails
    }
  }

  fragment ComposerFields on Conversation {
    id
    memberFilters {
      archived
      cohort
      disciplineId
      experience
      query
      segment
      status
      subdisciplineId
      tag
    }
    sender {
      ...GroupAvatarsFields
    }
    isAnnouncement
    members(limit: $memberLimit) {
      ...GroupAvatarsFields
    }
  }
  ${GroupAvatarsFieldsFragmentDoc}
`

type ComposerProps = {
  conversation?: ComposerFieldsFragment
  close?: () => void
  refetchConversations?: RefetchQueriesFunction
  userIds?: string[]
  filters?: Dictionary<
    string | number | boolean | (string | null)[] | null | undefined
  >
  messageType?: string
}

const Composer: FC<ComposerProps> = ({
  conversation,
  close,
  refetchConversations,
  userIds,
  filters,
  messageType,
}) => {
  const { values, setValues, setFieldValue, initialValues, resetForm } =
    useFormikContext<FormikValues>()
  const [files, setFiles] = useState<UploaderFileType[]>([])
  const { formatMessage, locale } = useIntl()
  const { currentGroup, isDashboard } = useCurrentGroup()
  const { currentUser } = useCurrentUser()
  const { push, asPath } = useRouter()
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValues({ ...initialValues })
  }, [conversation?.id])

  const base = (isDashboard: boolean) =>
    isDashboard ? 'dashboard' : 'personal'

  const conversationId = conversation?.id
  const hasFilters = !isEmpty(filters) || !isEmpty(conversation?.memberFilters)
  const isGroupMessage = (userIds && userIds?.length > 1) || hasFilters
  const isReply = conversationId
  const hasRecipients = (userIds && userIds?.length > 0) || hasFilters
  const textIsValid = values?.message?.trim().length > 0
  const fileIsValid = files.length > 0
  const hasValidContent = textIsValid || fileIsValid
  const isSender = conversation?.sender?.id === currentUser.id // initial messages will not yet have a sender
  const isAnnouncement =
    messageType === 'announcement' || conversation?.isAnnouncement
  const announcementReply = isAnnouncement && !isSender && conversation?.members
  const isNew = userIds || asPath.includes('/new')

  const sendDisabledText =
    !conversation?.members && !hasRecipients
      ? 'Add recipients to send'
      : !hasValidContent
      ? 'You cannot send a blank message'
      : !isGroupMessage && isAnnouncement
      ? 'You cannot send an announcement to a single person'
      : undefined

  const [createConversation, { loading: creatingConversation }] =
    useCreateGroupConversationMutation()
  const [createMessage, { loading: creatingMessage }] =
    useCreateMessageMutation()
  const [addFile, { loading: addingFile }] = useCreateConversationFileMutation()

  const loading = creatingConversation || creatingMessage || addingFile

  const cacheQuery = {
    query: ConversationDocument,
    variables: { id: conversationId },
  }

  const handleCreate = async () => {
    const op = conversation?.sender?.id

    try {
      const variables = {
        groupId: currentGroup.id,
        senderId: currentUser?.id,
        isAnnouncement: isReply && !isSender ? false : isAnnouncement,
        memberFilters: filters,
        recipientIds: announcementReply ? op : userIds,
        title: !isReply ? values?.title : undefined,
        message: values?.message,
      }

      // @TODO: remove once we know this isn't needed
      // currently we generate the title dynamically everywhere,
      // but just in case this is used in the backend, renable if a bug appears
      //
      // if (!variables.title && !isReply && isGroupMessage) {
      //   variables.title = conversationTitle(
      //     variables,
      //     formatMessage,
      //     currentGroup
      //   )
      // }

      const createdConversation = await createConversation({ variables })

      const { conversation, errorDetails } =
        createdConversation?.data?.createGroupConversation || {}

      if (errorDetails) {
        throw Error(errorDetails)
      }
      resetForm({ values: initialValues })
      push(`/${locale}/${base(isDashboard)}/messaging/${conversation?.id}`)
      refetchConversations && refetchConversations()
      close && close()
      toast.success(formatMessage({ id: 'text.sent' }))
    } catch (error: unknown) {
      console.error('error: ', error)
      toast.error(formatMessage({ id: 'error.unknown' }), {
        autoClose: 4000,
      })
    }
  }

  const handleReply = () => {
    const id = ulid()
    values?.message &&
      createMessage({
        variables: {
          id,
          conversationId: conversationId as string,
          text: values?.message,
        },
        update: (cache, { data }) => {
          const newData = cache.readQuery(cacheQuery)
          const nextData = produce(newData, (draftData: ConversationQuery) => {
            draftData?.viewer?.conversation?.events.push(
              data?.createMessage?.message as Message
            )
          })
          cache.writeQuery({ ...cacheQuery, data: nextData })
        },
        refetchQueries: refetchConversations
          ? [refetchConversations?.name]
          : undefined,
      })

    files?.length > 0 && files.forEach((file) => addAttachment(file))
    setFieldValue('message', '')
  }

  const handleUpload = (data: UploaderFileType, file: UppyUploadType) => {
    if (ref?.current) ref.current.focus() //ref?.current?.focus() will throw error
    // @TODO: attaching another image will replace the first one because the this function is being memoized in Uploader, so files is not updated

    const userFile = {
      ...data,
      url: file.url,
    } as UploaderFileType

    setFiles([...files, userFile])
  }

  const addAttachment = (attachment: any) => {
    const id = ulid()

    const file = omit(attachment, 'url')

    addFile({
      variables: {
        id,
        conversationId: conversationId as string,
        file: file as UploadAttributes,
      },
      update: (cache, { data }) => {
        const newData = cache.readQuery(cacheQuery)
        const nextData = produce(newData, (draftData: ConversationQuery) => {
          draftData?.viewer?.conversation?.events.push(
            data?.createConversationFile?.message as Upload
          )
        })
        cache.writeQuery({ ...cacheQuery, data: nextData })
      },
    }).catch((e) => console.error(e))
  }

  const handleKeyPress = (e: React.KeyboardEvent<any>) => {
    if (e.charCode === 13 && !e.getModifierState('Shift')) {
      const messageIsValid = textIsValid || fileIsValid
      e.preventDefault()
      messageIsValid && handleSubmit()
    }
  }

  const handleSubmit = () => {
    event('Send Message', {
      category: 'Messaging',
      label: 'Sent message',
      // userId: currentUser?.id,
    })
    !isReply || announcementReply ? handleCreate() : handleReply()
    setFiles([])
  }

  const removeFile = (file: UploaderFileType) => {
    const newArray = files.filter((f) => f !== file)
    setFiles(newArray)
  }

  const sendButtonLabel = formatMessage({
    id: isAnnouncement
      ? 'conversation.sendAnnouncement'
      : isGroupMessage
      ? 'conversation.groupStart'
      : 'conversation.start',
  })

  const announcementReplyTooltip = isSender
    ? formatMessage({ id: 'conversation.announcementSender' })
    : formatMessage({ id: 'conversation.announcementReply' })

  const convoType = formatMessage({
    id: isAnnouncement
      ? 'conversation.announcement'
      : isGroupMessage
      ? 'conversation.group'
      : 'term.message',
  })

  const titlePlaceholder =
    locale === 'fr'
      ? formatMessage({ id: 'term.titreDe' }) + ' ' + convoType
      : convoType + ' ' + formatMessage({ id: 'form.title' }).toLowerCase()

  return (
    <>
      {isAnnouncement && conversation?.members && (
        <Alert
          type="subtle"
          description={announcementReplyTooltip}
          className="mt-2 text-xs p-0"
        />
      )}
      {isGroupMessage && !isReply && (
        <Field
          name="title"
          placeholder={titlePlaceholder}
          className="border-t border-darkGray mb-0"
          maxLength={100}
          hideLabel
          borderless
        />
      )}
      <Field
        name="message"
        ref={ref}
        control={Textarea}
        controlClassName="max-h-full py-2 px-4 overflow-y-auto border-none resize-none focus:outline-none no-focus min-h-10"
        className={`w-full border-t border-darkGray mb-0`}
        border={false}
        placeholder={formatMessage({ id: 'form.yourMessage' })}
        onKeyPress={handleKeyPress}
        hideLabel
        onValueChange={null}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setFieldValue('message', e?.target?.value)
        }
      />
      {files.length > 0 && (
        <div className="border-t-2 border-b-2 border-gray m-3 p-2 flex flex-wrap">
          {files.map((file) => (
            <PreviewImage file={file} removeFile={removeFile} key={file.id} />
          ))}
        </div>
      )}
      <div className="flex justify-between items-center p-2 border-t border-gray">
        <div className="w-12">
          {!isNew && (
            <Uploader
              id={conversationId || 'conversationUploader'}
              onUpload={handleUpload}
              allowedFileTypes={undefined}
              setError={undefined}
              onUploading={undefined}
            >
              <FileInput>
                {({ onClick, loading }) => (
                  <IconButton
                    icon={Paperclip}
                    onClick={onClick}
                    loading={loading}
                  />
                )}
              </FileInput>
            </Uploader>
          )}
        </div>
        {!isNew && (
          <div className="text-darkGray text-sm text-right px-4 whitespace-pre select-none">
            {formatMessage({ id: 'tooltip.sendMessage' })}
          </div>
        )}
        <div>
          <Tooltip text={sendDisabledText}>
            <Button
              onClick={handleSubmit}
              disabled={!!sendDisabledText}
              loading={loading}
              className="flex space-x-2"
              variant={isNew ? 'primary' : 'icon'}
            >
              <Send />
              {isNew && <p>{sendButtonLabel}</p>}
            </Button>
          </Tooltip>
        </div>
      </div>
    </>
  )
}

type PreviewImageProps = {
  file: UploaderFileType
  removeFile: (file: UploaderFileType) => void
}

const PreviewImage: FC<PreviewImageProps> = ({ file, removeFile }) => {
  const fileTypeImage = file?.metadata?.mimeType?.includes('image')

  const imageUrl = file?.url

  return (
    <div className="relative flex-inline m-1">
      {/* @TODO: move to storybook */}
      <div className="relative">
        <button
          onClick={() => removeFile(file)}
          className="absolute flex items-center justify-center text-white m-1 top-0 right-0 w-4 h-4 rounded-full bg-red opacity-75 hover:opacity-100"
        >
          <X size={13} />
        </button>
        {fileTypeImage && imageUrl ? (
          <img
            src={imageUrl}
            alt="f"
            className="border border-darkGray shadow-sm w-48"
          />
        ) : (
          <FilePreviewCard file={file} />
        )}
      </div>
    </div>
  )
}

export default Composer
