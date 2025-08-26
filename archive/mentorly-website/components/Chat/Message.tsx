import { gql } from '@apollo/client'
import { has } from 'lodash'
import Link from 'next/link'
import { FC } from 'react'
import Linkify from 'react-linkify'
import {
  ConversationMembership,
  GroupAvatarsFieldsFragmentDoc,
  Maybe,
  MessageDeletionFieldsFragment,
  MessageFieldsFragment,
  UploadFieldsFragment,
} from 'types/graphql'

import FilePreviewCard from './FilePreviewCard'
import { shouldCollapse } from './lib'
import MessageHeader from './MessageHeader'
import ReadIndicator from './ReadIndicator'

gql`
  fragment MessageFields on Message {
    id
    user {
      ...GroupAvatarsFields
    }
    createdAt
    text
  }
  fragment MessageDeletionFields on MessageDeletion {
    id
    user {
      ...GroupAvatarsFields
    }
    createdAt
    eventId
  }
  fragment UploadFields on Upload {
    id
    user {
      ...GroupAvatarsFields
    }
    createdAt
    filename
    image
    mimeType
    url
  }
  ${GroupAvatarsFieldsFragmentDoc}
`

export type MessageType =
  | MessageFieldsFragment
  | MessageDeletionFieldsFragment
  | UploadFieldsFragment

type MessageProps = {
  message: MessageType
  previous: Maybe<MessageType>
  memberships?: ConversationMembership[]
}

const Message: FC<MessageProps> = ({ message, previous, memberships }) => {
  const data =
    has(message, 'url') && (message as UploadFieldsFragment).image ? (
      <div>
        <div className="text-darkerGray text-sm">
          {(message as UploadFieldsFragment).filename}
        </div>
        <img
          className="border border-darkGray rounded-sm w-full max-w-sm my-1"
          src={(message as UploadFieldsFragment).url}
          alt="Upload"
        />
      </div>
    ) : has(message, 'url') ? (
      <Link href={(message as UploadFieldsFragment).url}>
        <a className="underline text-blue break-all" target="_blank">
          <FilePreviewCard
            file={{ metadata: message as UploadFieldsFragment }}
          />
        </a>
      </Link>
    ) : (
      <p className="whitespace-pre-wrap break-words">
        <Linkify
          componentDecorator={(url: string, text: string, key: number) => (
            <a
              target="_blank"
              href={url}
              key={key}
              className="underline text-blue break-all"
              rel="noreferrer"
            >
              {text}
            </a>
          )}
        >
          {(message as MessageFieldsFragment).text}
        </Linkify>
      </p>
    )

  if (!data) return null

  const member = message.user

  return (
    <div className="relative flex flex-col flex-1 w-full">
      {!shouldCollapse(previous, message) && (
        <MessageHeader member={member} message={message} />
      )}
      <span className="border-l-lightGray border-l-4 ml-2 pl-2">{data}</span>
      {/* @TODO: hide unless the next message read receipts are different */}
      {memberships && (
        <ReadIndicator memberships={memberships} message={message} />
      )}
    </div>
  )
}

export default Message
