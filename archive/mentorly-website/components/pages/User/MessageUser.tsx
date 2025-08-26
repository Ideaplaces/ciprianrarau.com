import { gql } from '@apollo/client'
import RequireLogin from 'components/Forms/Login/RequireLogin'
import TypedMutation from 'components/Graphql/TypedMutation'
import { useRouter } from 'lib/router'
import { useCurrentUser } from 'lib/UserContext'
import { isEmpty } from 'lodash'
import { FC, ReactElement } from 'react'
import { useIntl } from 'react-intl'
import {
  MessageUserMutationVariables,
  useMessageUserMutation,
} from 'types/graphql'

gql`
  mutation messageUser($userId: ID!) {
    createConversation(userId: $userId) {
      conversation {
        id
      }
      errors
      errorDetails
    }
  }
`

type MessageUserType = {
  name?: string
  userId: string
  children: ReactElement
}

export const MessageUser: FC<MessageUserType> = ({
  name = null,
  userId,
  children,
}) => {
  const { locale, formatMessage } = useIntl()
  const { currentUser } = useCurrentUser()
  const { push } = useRouter()

  // @TODO: there should be a better way of doing this
  // currently, a new conversation is created whether or not the user sends a message
  // this can lead to blank message conversations
  // recipients will also see a new conversation before the sender submits

  return (
    <TypedMutation<MessageUserMutationVariables>
      typedMutation={useMessageUserMutation}
      onSuccess={({ createConversation }) => {
        push(
          `/${locale}/personal/messaging/${createConversation.conversation.id}`
        )
      }}
      refetchQueries={['conversations']}
      variables={{ userId }}
    >
      {({ onClick }) => (
        <RequireLogin
          whenLoggedIn={
            currentUser?.id != userId
              ? onClick
              : () => alert(formatMessage({ id: 'user.noSelfMessage' }))
          }
        >
          {!isEmpty(children) ? (
            children
          ) : (
            <button className="flex space-x-2">
              {formatMessage({ id: 'user.sendMessage' })}&nbsp;{name}
            </button>
          )}
        </RequireLogin>
      )}
    </TypedMutation>
  )
}

export default MessageUser
