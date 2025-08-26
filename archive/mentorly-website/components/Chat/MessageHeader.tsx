import Avatar from 'components/display/Avatar'
import WrapperSize from 'components/display/WrapperSize'
import { FC } from 'react'
import { GroupAvatarsFieldsFragment } from 'types/graphql'

import { MessageType } from './Message'
import MessageTime from './MessageTime'

type MessageHeaderProps = {
  member: GroupAvatarsFieldsFragment
  message: MessageType
}
const MessageHeader: FC<MessageHeaderProps> = ({ member, message }) => (
  <div className="py-2 hover:bg-lightGray flex items-center">
    <div className="w-6 mr-2">
      <Avatar {...member.avatar} size="xs" />
    </div>
    <WrapperSize className="break-all">
      {(width) => {
        const flexDir =
          width && width < 300 - member.name.length ? 'col' : 'row'
        return (
          <div className={`flex flex-${flexDir}`}>
            <span className="font-bold mr-2">{member.name}</span>
            <MessageTime
              className="text-black opacity-50 text-xs flex items-center"
              time={message.createdAt}
            />
          </div>
        )
      }}
    </WrapperSize>
  </div>
)

export default MessageHeader
